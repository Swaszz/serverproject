const express = require('express');
const { userRegister, userLogin, userProfile, userLogout,updateUserProfile,checkuser} = require('../controllers/userController');
const userAuth = require("../middlewares/userAuth.js");
const jwt =require("jsonwebtoken")

const userRouter = express.Router();

//Register
userRouter.post('/signup', userRegister);

//Signin
userRouter.put('/login', userLogin);

//Logout
userRouter.get('/logout', userAuth, userLogout);

//Profile
userRouter.get('/profile', userAuth, userProfile);

//Updateprofile
userRouter.get('/updateprofile', userAuth,updateUserProfile );

userRouter.get("/checkuser", userAuth, checkuser);

module.exports = userRouter;