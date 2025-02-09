const express = require('express');
const { getordersummary,placeorder,updateorderstatus,cancelorder} = require('../controllers/orderController.js');
const userAuth = require("../middlewares/userAuth.js");
const restaurantownerAuth = require("../middlewares/restaurantownerAuth.js");
const jwt =require("jsonwebtoken")

const orderRouter = express.Router();



orderRouter.get('/getorder',userAuth, getordersummary);

orderRouter.put('/updatestatus',restaurantownerAuth, updateorderstatus);

orderRouter.post('/placeorder',userAuth, placeorder);

orderRouter.delete('/cancelorder',userAuth, cancelorder);


module.exports = orderRouter;