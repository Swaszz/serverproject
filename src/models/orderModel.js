const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderId:{type:String,required:true, unique:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    menuItemId:  { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number },
    total_price: { type: Number },
    status: { type: String,enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], default: 'Pending' },
    Delivery_address:{type : string},
    orderedAt: { type: Date, default: Date.now }
  });
  const Order = mongoose.model('Order', orderSchema);

  module.exports =Order;