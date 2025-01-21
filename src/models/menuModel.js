
const mongoose = require('mongoose')


const menuItemSchema = new mongoose.Schema({
    menuItemId:{type:String,required:true, unique:true},
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    availability: { type: Boolean, default: true },
    image: { type: string },
    createdAt: { type: Date, default: Date.now }, 
  });
  const MenuItem = mongoose.model('MenuItem', menuItemSchema);
  

  module.exports = MenuItem;