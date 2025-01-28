const express = require('express');
const { userRegister, userSignin, userProfile, userLogout,updateUserProfile,checkuser} = require('../controllers/userController');
const userAuth = require("../middlewares/userAuth.js");
const jwt =require("jsonwebtoken")

const userRouter = express.Router();

//Register
userRouter.post('/register', userRegister);

//Signin
userRouter.put('/signin', userSignin);

//Logout
userRouter.get('/logout', userAuth, userLogout);

//Profile
userRouter.get('/profile', userAuth, userProfile);

//Updateprofile
userRouter.get('/updateprofile', userAuth,updateUserProfile );

userRouter.get("/checkuser", userAuth, checkuser);

module.exports = userRouter;