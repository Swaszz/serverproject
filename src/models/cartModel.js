const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    cartId:{type:String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    menuItem: [
      {
        menuItemId: {
              type: mongoose.Schema.Types.ObjectId,ref: "MenuItem"},
          price: {
              type: Number,
              required: true,
          },
          quantity: { type: Number, default: 1 }
      },
  ],
   
  totalAmount: { type: Number,default: 0},
    updatedAt: { type: Date, default: Date.now }
  });
  
  
  cartSchema.methods.calculateTotalPrice = function () {
    this.totalAmount = this.menuItem.reduce((total, menuItem) => total + (menuItem.price * menuItem.quantity), 0);
};
const Cart = mongoose.model('Cart', cartSchema);
  module.exports = Cart;
  