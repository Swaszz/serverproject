const Cart = require('../models/cartModel.js')
const MenuItem = require('../models/menuModel.js')
const bcrypt = require('bcrypt')
const jwt =require("jsonwebtoken")
const tokenGenerator = require('../utils/token');


const addcart = async (req, res) => {
    try {
        const userId = req.user.id;
        const {menuItemId} = req.body;

        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ message: "menuItem not found" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, menuItem: [] });
        }

        
        cart.menuItem.push({
            menuItemId,
            price: menuItem.price,
        });

        cart.calculateTotalPrice();

        await cart.save();

        res.status(200).json({ data: cart, message: "menuItem added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};



const getcart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).populate("menuItem.menuItemId");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ data: cart, message: "cart fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


const   deletecart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { menuItemId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.menuItem = cart.menuItem.filter((item) => !item.menuItemId.equals(menuItemId));

        cart.calculateTotalPrice();

        await cart.save();

        res.status(200).json({ data: cart, message: "MenuItem removed form cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

const updatemenuItemQuantity = async (req, res) => {
    try {
        const { cartId, menuItemId, quantity } = req.body;
        const userId = req.user.id; 
       
        const cart = await Cart.findOne({ _id: cartId, userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        const itemIndex = cart.menuItem.findIndex(
            (item) => item.menuItemId.toString() === menuItemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Menu item not found in the cart" });
        }

        cart.menuItem[itemIndex].quantity = quantity;

        cart.calculateTotalPrice();

        await cart.save();

        res.status(200).json({message: "Menu item quantity updated successfully",data: cart,});
    } catch (error) {
        console.error("Error updating menu item quantity:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};


const proceedToCheckout = async (req, res) => {
    try {
        const { cartId } = req.body;
        const userId = req.user.id; 

       
        const cart = await Cart.findOne({ _id: cartId, userId }).populate("menuItem.menuItemId");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        if (!cart.menuItem.length) {
            return res.status(400).json({ message: "Cart is empty. Add items to your cart before proceeding to checkout." });
        }

       
        res.status(200).json({message: "checkout sucessfull",data: {cartId, userId },});
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
    proceedToCheckout,
    updatemenuItemQuantity,
    deletecart,
    emptycart
}





 

 