const MenuItem = require('../models/menuModel.js')
const Restaurant = require('../models/restaurantModel.js')
const bcrypt = require('bcrypt')
const jwt =require("jsonwebtoken")
const tokenGenerator = require('../utils/token');
const cloudinaryInstance = require('../config/cloudinaryConfig.js');



const createmenuItem = async (req,res,next)=>{
    try{
        const { name, description,price,category, availability} = req.body;

        let  cloudinaryResponse 

        if( !name || !description || !price || !category || ! availability ){
            return res.status(400).json({message:"All fields are required"})
        }

        console.log('image ===',req.file)

        if(req.file){
             cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
        }
      
        console.log("response ===" , cloudinaryResponse)
           const menuitemData = new MenuItem ({name, description,price,category,image:cloudinaryResponse.url, availability});
          
            await menuitemData.save();
    
    
            return res.json({ data: menuitemData, message: "Menuitem created" });
        
    }catch(error){
        return res.status(error.statusCode || 500).json({message: error.message || "internal server error"})
    }
}



const getmenuItem = async (req,res,next)=>{
    try{
         const menuitemList = await MenuItem.find() .select("-description")
           
            return res.json({ data: menuitemList, message: "Menuitem fetched" });
        
    }catch(error){
        return res.status(error.statusCode || 500).json({message: error.message || "internal server error"})
    }
}


const getmenuItemDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const menuItemDetails = await MenuItem.findById(id).populate("restaurantId");
        console.log('Populated Single MenuItem:', menuItemDetails );
        return res.json({ data: menuItemDetails, message: "Menuitem Details  fetched " });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



const updatemenuItem = async (req, res, next) => {
    try {
      
        const { id} = req.params;
        const {name, description, price, category, availability} = req.body; 

        let  cloudinaryResponse 

        console.log('image ===',req.file)

        if(req.file){
             cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
        }
      
        console.log("response ===" , cloudinaryResponse)

    
        const updateData = await MenuItem.findById(id);

        if (!updateData) {
            return res.status(404).json({ message: "Menu item not found" });
        }


        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (category) updateData.category = category;
        if (availability) updateData.availability = availability;
        if (cloudinaryResponse) updateData.image = cloudinaryResponse.url;

        await updateData.save();

        return res.json({ data: updateData, message: "Menu item updated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

const getmenuItemcategory = async (req, res) => {
    try {
        const { category } = req.body; 
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

      
        const menuItems = await MenuItem.find({ category: { $regex: category, $options: "i" } });

        if (menuItems.length === 0) {
            return res.status(404).json({ message: "No menu items found for this category" });
        }

        res.status(200).json({
            message: "Menu items fetched successfully",
            data: menuItems,
        });
    } catch (error) {
        console.error("Error fetching menu items by category:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const deletemenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedMenuItem = await MenuItem.findOneAndDelete({ _id: id });

        if (!deletedMenuItem) {
            return res.status(404).json({ message: "No menu items found to delete" });
        }

        return res.json({ data: deletedMenuItem, message: "Menu item deleted successfully" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
module.exports  = {
    createmenuItem,
    getmenuItem,
    getmenuItemDetails,
    updatemenuItem,
    getmenuItemcategory,
    deletemenuItem
}