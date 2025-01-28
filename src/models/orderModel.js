const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderId:{type:String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    restaurantId: {type: mongoose.Schema.Types.ObjectId,ref: 'Restaurant'},
    menuItem: [
      {
          menuItemId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'MenuItem',
              required: true,
          },
          price: {
              type: Number,
              required: true,
          },
          quantity: {
              type: Number,
              required: true,
              min: 1,
          },
          totalItemPrice: {
              type: Number,
              required: true,
          },
      },
  ],
  totalItems: { type: Number},
  totalPrice: {type: Number},
  status: { type: String,enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], default: 'Pending' },
  Delivery_address:{type : String},
  createdAt: {type: Date,default: Date.now},
  updatedAt: {type: Date,default: Date.now},
  })
  const Order = mongoose.model('Order', orderSchema);

  module.exports =Order;



 
