const Cart = require('../models/cartModel.js')
const MenuItem = require('../models/menuModel.js')
const User = require('../models/userModel.js')
const bcrypt = require('bcrypt')
const jwt =require("jsonwebtoken")
const tokenGenerator = require('../utils/token');
const Restaurant = require('../models/restaurantModel.js');

const addcart = async (req, res) => {
    try {
        const userId = req.user.id;
        const {menuItemId, quantity  } = req.body;

        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ message: "menuItem not found" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, menuItem: [] });
        }

        const existingItem = cart.menuItem.find(item => item.menuItemId.equals(menuItemId));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.menuItem.push({
                menuItemId,
                price: menuItem.price,
                quantity: quantity, 
            });
        }

        cart.calculateTotalPrice();

        await cart.save();

        res.status(200).json({
            cartItems: cart.menuItem.map(item => ({
                _id: item.menuItemId._id,
                price: item.price,
                quantity: item.quantity,
            })),
            totalAmount: cart.totalAmount,
            message: "Menu item added to cart",
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
const getcart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).populate("menuItem.menuItemId").populate("restaurantId");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ data: cart, message: "cart fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
const getCartDetails = async (req, res) => {
    try {
        const userId = req.user.id; 

        const cart = await Cart.findOne({ userId }).populate("menuItem.menuItemId");

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const cartItems = cart.menuItem.map((item) => ({
            _id: item.menuItemId._id,
            name: item.menuItemId.name || "Unnamed Item",
            image: item.menuItemId.image || "/placeholder.jpg",
            price: item.price,
            quantity: item.quantity
        }));

        res.status(200).json({
            cartId: cart._id, 
            cartItems: cartItems,
            totalAmount: cart.totalPrice || 0, 
            totalQuantity: cart.menuItem.reduce((acc, item) => acc + item.quantity, 0),
        });

        console.log(" Cart API Response:", {
            cartId: cart._id,
            cartItems: cartItems,
            totalAmount: cart.totalPrice,
            totalQuantity: cart.menuItem.length,
        }); 
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const deletecart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { menuItemId } = req.body;

     
        if (!menuItemId || typeof menuItemId !== "string" || !menuItemId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid or missing menuItemId" });
        }

        let cart = await Cart.findOne({ userId }).populate("menuItem.menuItemId");

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

       
        const itemIndex = cart.menuItem.findIndex(item => item.menuItemId._id.toString() === menuItemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.menuItem.splice(itemIndex, 1);

        if (cart.menuItem.length === 0) {
            await Cart.findByIdAndDelete(cart._id);
            return res.status(200).json({ message: "Cart is now empty and has been deleted" });
        }

        cart.totalAmount = cart.menuItem.reduce((acc, item) => acc + item.quantity * item.price, 0);
        cart.totalQuantity = cart.menuItem.reduce((acc, item) => acc + item.quantity, 0);

        console.log("Recalculated Total Amount:", cart.totalAmount);
        console.log("Recalculated Total Quantity:", cart.totalQuantity);

        await cart.save();

        res.status(200).json({
            message: "Menu item removed from cart",
            data: {
                cartId: cart._id,
                cartItems: cart.menuItem,
                totalAmount: cart.totalAmount,
                totalQuantity: cart.totalQuantity,
            },
        });

        console.log("Updated Cart Response:", cart);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const updatemenuItemQuantity = async (req, res) => {
    try {
      
        const { cartId, menuItemId, quantity } = req.body;
        const userId = req.user.id;

        console.log("Checking cartId:", cartId);
        console.log("Checking menuItemId:", menuItemId);

        const cart = await Cart.findOne({ _id: cartId, userId })
        .populate("menuItem.menuItemId");
        if (!cart) {
            console.log("Cart NOT FOUND in Database!");
            return res.status(404).json({ message: "Cart not found" });
        }

        console.log(" Cart Found:", cart);
        console.log("Existing menu items in cart:", cart.menuItem.map(item => String(item.menuItemId)));

        const itemIndex = cart.menuItem.findIndex(
            (item) => String(item.menuItemId._id) === String(menuItemId)
        );

        console.log("Item Index Found:", itemIndex);

        if (itemIndex === -1) {
            console.log("Menu item NOT FOUND in cart!");
            return res.status(404).json({ message: "Menu item not found in the cart" });
        }

        cart.menuItem[itemIndex].quantity = quantity;

        const updatedCartItems = cart.menuItem.map(item => ({
            _id: item.menuItemId._id,
            menuItemId: item.menuItemId._id,
            name: item.menuItemId.name || "Unknown Item",
            image: item.menuItemId.image || "/placeholder.jpg",
            price: item.menuItemId.price || 0,
            quantity: item.quantity
        }));

        cart.totalAmount = cart.menuItem.reduce((acc, item) => {
            let itemPrice = item.menuItemId.price || 0; 
            return acc + (item.quantity * itemPrice);
        }, 0);

        cart.totalQuantity = cart.menuItem.reduce((acc, item) => acc + item.quantity, 0);
        await cart.save();

        console.log("Backend API Response:", updatedCartItems);

        res.status(200).json({
            message: "Quantity updated successfully",
            data: {
                cartId: cart._id,
                cartItems: updatedCartItems, 
                totalAmount: cart.totalAmount,
                totalQuantity: updatedCartItems.reduce((acc, item) => acc + item.quantity, 0),
            },
        });

       
    } catch (error) {
        console.error(" Error updating quantity:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
const proceedToCheckout = async (req, res) => {
    try {
      

        const { cartId } = req.body;
        const userId = req.user.id;

        const cart = await Cart.findOne({ _id: cartId, userId }).populate("menuItem.menuItemId");

        if (!cart) {
            console.log("Cart NOT FOUND!");
            return res.status(404).json({ message: "Cart not found" });
        }

        if (!cart.menuItem.length) {
            console.log("Cart is empty!");
            return res.status(400).json({ message: "Cart is empty. Add items before checkout." });
        }

        console.log("Checkout Success!");
        res.status(200).json({
            message: "Checkout successful!",
            data: {
                cartId: cart._id,
                userId: cart.userId,
                totalAmount: cart.totalAmount,
                totalQuantity: cart.totalQuantity,
                cartItems: cart.menuItem.map(item => ({
                    name: item.menuItemId.name,
                    price: item.menuItemId.price,
                    quantity: item.quantity
                }))
            }
        });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const emptycart = async (req, res) => {
    try {
        const { cartId } = req.body;
        const userId = req.user.id; 

      
        const cart = await Cart.findOne({ _id: cartId, userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.menuItem = [];
        cart.total_price = 0; 
        await cart.save();

        res.status(200).json({  message: "Cart emptied successfully",  data: cart });
          
        } catch (error) {
    
        res.status(500).json({ message: "Internal server error", error });
    }
};


module.exports  = {
    addcart,
    getcart,
    getCartDetails,
    proceedToCheckout,
    updatemenuItemQuantity,
    deletecart,
    emptycart
}





 

 