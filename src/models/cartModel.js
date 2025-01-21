
const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    cartId:{type:String,required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    MenuItemId: {type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, default: 1 },
    total_price: { type: number},
    updatedAt: { type: Date, default: Date.now }
  });
  const Cart = mongoose.model('Cart', cartSchema);


  module.exports = Cart;
  