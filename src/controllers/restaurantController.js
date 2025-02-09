const Restaurant = require('../models/restaurantModel.js')
const Review = require('../models/reviewModel.js')
const MenuItem = require('../models/menuModel.js')
const bcrypt = require('bcrypt')
const jwt =require("jsonwebtoken")
const tokenGenerator = require('../utils/token');



const addrestaurant = async (req,res,next)=>{
    try{
        const {name, address,phone,email} = req.body
        console.log(req.body)

        if( !name || !address || !phone || !email ){
            return res.status(400).json({message:"All fields are required"})
        }
            
           const RestaurantData = new Restaurant ({name, address,phone,email });
          
            await RestaurantData.save();
            console.log(RestaurantData)
    
    
            return res.json({ data: RestaurantData, message: "Restaurant created" });
        
    }catch(error){
        return res.status(error.statusCode || 500).json({message: error.message || "internal server error"})
    }
}



const  getrestaurant = async (req, res,next) => {
    try {
       
        const restaurants = await Restaurant.find().populate('menuItemId').lean();
          
        for (let restaurant of restaurants) {
           
            const reviews = await Review.find({ restaurantId: restaurant._id });

            const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

            restaurant.averageRating = averageRating;
        }

        res.status(200).json({
            message: 'Restaurants fetched successfully',
            data: restaurants,
        });
    } catch (error) {
        console.error('Error fetching restaurant details:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};




const getrestaurantDetails = async (req, res, next) => {
    try {
    const { id } = req.params;
        const restaurantDetails = await Restaurant.findById(id).populate("menuItemId") .lean();

        if (!restaurantDetails) {return res.status(404).json({ message: "Restaurant not found" });}
            
        const reviews = await Review.find({ restaurantId: restaurantDetails._id });

        const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

        restaurantDetails.averageRating = averageRating;

        console.log(restaurantDetails);
        return res.json({ data: restaurantDetails, message: "Restaurant details fetched successfully" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


const updaterestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, address,phone,email } = req.body; 

        const RestaurantData = await Restaurant.findById(id);

        if (!RestaurantData) {
            return res.status(404).json({ message: "Restaurant not found" });
        }


        if (name) RestaurantData.name = name;
        if (address) RestaurantData.address = address;
        if (phone ) RestaurantData.phone = phone;
        if (email ) RestaurantData.email = email;
      
        await RestaurantData.save();

      
        return res.json({ data: RestaurantData, message: "Restaurant updated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



const deleterestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedRestaurant = await Restaurant.findOneAndDelete({ _id: id });

        if (!deletedRestaurant) {
            return res.status(404).json({ message: "No Restaurant found to delete" });
        }

        return res.json({ data: deletedRestaurant, message: "Restaurant deleted successfully" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
module.exports  = {
    addrestaurant,
    getrestaurant,
    getrestaurantDetails,
    updaterestaurant,
    deleterestaurant
}