const express = require('express');
const { createmenuItem, getmenuItem, getmenuItemDetails, updatemenuItem,getmenuItemcategory, deletemenuItem} = require('../controllers/menuitemController.js');
const restaurantownerAuth = require("../middlewares/restaurantownerAuth.js");
const upload = require("../middlewares/multer.js");
const jwt =require("jsonwebtoken")

const menuitemRouter = express.Router();


menuitemRouter.post('/createmenu',restaurantownerAuth,upload.single("image"),createmenuItem);

menuitemRouter.get('/getmenu', getmenuItem);

menuitemRouter.get('/getmenudetails/:id', getmenuItemDetails);

menuitemRouter.get('/updatemenu/:id',restaurantownerAuth,upload.single("image"), updatemenuItem);

menuitemRouter.get('/category', getmenuItemcategory);


menuitemRouter.delete('/deletemenu/:id',restaurantownerAuth,  deletemenuItem);

module.exports = menuitemRouter;