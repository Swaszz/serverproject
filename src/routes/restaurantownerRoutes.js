const express = require('express');
const { restaurantownerRegister, restaurantownerlogin, restaurantownerProfile, restaurantownerLogout,updaterestaurantownerProfile} = require('../controllers/restaurantownerController');
const restaurantownerAuth = require("../middlewares/restaurantownerAuth.js");
const jwt =require("jsonwebtoken")

const restaurantownerRouter = express.Router();

//Register
restaurantownerRouter.post('/signup', restaurantownerRegister);

//Signin
restaurantownerRouter.put('/login', restaurantownerlogin);

//Logout
restaurantownerRouter.get('/logout', restaurantownerAuth, restaurantownerLogout);

//Profile
restaurantownerRouter.get('/profile',  restaurantownerAuth, restaurantownerProfile)


//Updateprofile
restaurantownerRouter.get('/updateprofile', restaurantownerAuth,updaterestaurantownerProfile );

module.exports = restaurantownerRouter;