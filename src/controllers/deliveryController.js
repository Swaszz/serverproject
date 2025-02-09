
const DeliveryAddress = require('../models/deliveryModel.js')
const bcrypt = require('bcrypt')
const jwt =require("jsonwebtoken")
const tokenGenerator = require('../utils/token');




const adddeliveryaddress = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const { address, city, state, zipCode, country, isDefault } = req.body;

        if (!address || !city || !state || !zipCode || !country) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let userAddress = await DeliveryAddress.findOne({ userId: req.user.id });

        if (userAddress) {
            // 🛠️ If user already has addresses, update instead of creating a new document
            userAddress.addresses.push({ address, city, state, zipCode, country, isDefault });
            await userAddress.save();
        } else {
            // 🆕 If user has no saved address, create a new document
            userAddress = await DeliveryAddress.create({
                userId: req.user.id,
                addresses: [{ address, city, state, zipCode, country, isDefault }]
            });
        }

        res.status(201).json({ message: "Delivery address added successfully", data: userAddress });
    } catch (error) {
        console.error("Error adding delivery address:", error);
        res.status(500).json({ message: "Error adding delivery address", error });
    }
};


const getdeliveryaddress = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const userAddresses = await DeliveryAddress.findOne({ userId: req.user.id });

        if (!userAddresses || userAddresses.addresses.length === 0) {
            return res.status(404).json({ message: "No delivery addresses found" });
        }

        res.status(200).json({
            message: "Delivery addresses retrieved successfully",
            data: userAddresses.addresses // ✅ Return the array directly
        });

    } catch (error) {
        console.error("Error fetching delivery address:", error);
        res.status(500).json({ message: "Error fetching delivery address", error });
    }
};

const updatedeliveryaddress = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const {addressId, address, city, state, zipCode, country } = req.body;
       
        const updatedAddress = await DeliveryAddress.findOneAndUpdate(
            { userId: req.user.id, "addresses._id": addressId }, 
            {
                $set: {
                    "addresses.$.address": address,
                    "addresses.$.city": city,
                    "addresses.$.state": state,
                    "addresses.$.zipCode": zipCode,
                    "addresses.$.country": country,
               
                }
            },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Delivery address updated successfully", data: updatedAddress });
    } catch (error) {
        console.error("Error updating delivery address:", error);
        res.status(500).json({ message: "Error updating delivery address", error });
    }
};

const deletedeliveryaddress = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const deletedAddress = await DeliveryAddress.findOneAndDelete({ userId: req.user.id });

        if (!deletedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Delivery address deleted successfully" });
    } catch (error) {
        console.error("Error deleting delivery address:", error);
        res.status(500).json({ message: "Error deleting delivery address", error });
    }
};



module.exports ={
    adddeliveryaddress,
    getdeliveryaddress,
    updatedeliveryaddress,
    deletedeliveryaddress 
}