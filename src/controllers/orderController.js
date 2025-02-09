const Order = require('../models/orderModel.js')
const MenuItem = require("../models/menuModel.js")
const DeliveryAddress = require("../models/deliveryModel.js")
const Restaurant = require("../models/restaurantModel.js")
const Cart = require("../models/cartModel.js")
const bcrypt = require('bcrypt')
const jwt =require("jsonwebtoken")
const tokenGenerator = require('../utils/token');

const getordersummary = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const userId = req.user.id;

        
        const order = await Order.findOne({ userId })
            .sort({ createdAt: -1 })
            .populate({ path: "menuItem.menuItemId", model: "MenuItem" })
            .populate({ path: "restaurantId", model: "Restaurant" });

        if (!order) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        
        const userAddress = await DeliveryAddress.findOne({ userId });

        let deliveryAddress = null;
        if (userAddress && userAddress.addresses.length > 0) {
         
            deliveryAddress = userAddress.addresses.find(addr => addr.isDefault) || userAddress.addresses[0];
        }

        
        const totalPrice = order.menuItem.reduce((sum, item) => {
            if (item.menuItemId && item.menuItemId.price) {
                return sum + item.menuItemId.price * item.quantity;
            }
            return sum;
        }, 0);

      
        const orderSummary = {
            restaurant: order.restaurantId || null,
            menuItems: order.menuItem || [],
            totalPrice: totalPrice,
            coupon: order.coupon || null,
            deliveryAddress: deliveryAddress
        };

        res.status(200).json({ message: "Order Summary", data: orderSummary });
    } catch (error) {
        console.error("Error fetching order summary:", error);
        res.status(500).json({ message: "Error fetching order summary", error: error.message });
    }
};
const placeorder = async (req, res) => {
    try {
        const { userId,  menuItem,deliveryAddress} = req.body;

        if (!userId ||  !menuItem ) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        let addressId = deliveryAddress;
       
        const newOrder = await Order.create({
            userId,
            menuItem: menuItem, 
            deliveryAddress : addressId,
            status: "Pending",
        })

        

        res.status(201).json({ message: "Order placed successfully", data: newOrder });
    } catch (error) {
        console.error("Error placing order:", error); 
        res.status(500).json({ message: "Error placing order", error: error.message || error });
    }
};



const updateorderstatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const order = await Order.findById(orderId).populate('menuItem.menuItemId')
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error });
    }
};



const cancelorder = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "Delivered" || order.status === "Cancelled") {
            return res.status(400).json({ message: "Order cannot be cancelled" });
        }

        order.status = "Cancelled";
        await order.save();

        res.status(200).json({ message: "Order cancelled successfully", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling order", error });
    }
};

module.exports  = {
    
    getordersummary,
    updateorderstatus,
    placeorder,
    cancelorder
}