const Order = require('../models/orderModel.js')
const MenuItem = require("../models/menuModel.js")
const Cart = require("../models/cartModel.js")
const bcrypt = require('bcrypt')
const jwt =require("jsonwebtoken")
const tokenGenerator = require('../utils/token');



const getordersummary= async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User not authenticated" });
        }
        const userId  = req.user.id;  
        const cart = await Cart.findOne( {userId }).populate('menuItem.menuItemId');
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }
       
        const orderSummary = {
            menuItems: cart.menuItem,
            totalPrice: cart.total_price,
            coupon: cart.coupon, 
        };
        res.status(200).json({ message: "Order Summary", data: orderSummary });
    } catch (error) {
        res.status(500).json({ message: "Error fetching order summary", error });
    }
};

const adddeliveryaddress = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const {  Delivery_address } = req.body;
        if (! Delivery_address) {
            return res.status(400).json({ message: "Address is required" });
        }

        const newAddress = await  Order.create({
            userId: req.user.id,
            Delivery_address,
        })

        res.status(201).json({ message: "Delivery address added successfully", data: newAddress });
    } catch (error) {
        res.status(500).json({ message: "Error adding delivery address", error });
    }
};


const placeorder = async (req, res) => {
    try {
        const { userId,  menuItem, Delivery_address } = req.body;

        if (!userId ||  !menuItem ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

       
        const newOrder = await Order.create({
            userId,
            menuItem: menuItem, 
            Delivery_address,
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
    adddeliveryaddress,
    updateorderstatus,
    placeorder,
    cancelorder
}