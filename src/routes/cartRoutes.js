const express = require('express');
const { addcart, getcart,  proceedToCheckout,updatemenuItemQuantity,emptycart,  deletecart} = require('../controllers/cartController.js');
const userAuth = require("../middlewares/userAuth.js");
const jwt =require("jsonwebtoken")

const cartRouter = express.Router();


cartRouter.post('/addcart',userAuth, addcart);

cartRouter.get('/getcart',userAuth, getcart);

cartRouter.post('/checkout',userAuth,   proceedToCheckout);

cartRouter.put('/updatequantity',userAuth, updatemenuItemQuantity);

cartRouter.delete('/deletecart',userAuth,  deletecart);

cartRouter.delete('/emptycart',userAuth,  emptycart);

module.exports = cartRouter;