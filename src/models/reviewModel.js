const mongoose = require('mongoose')


   const reviewSchema = new mongoose.Schema({
    reviewId:{type:String,required:true, unique:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  });

  const Review = mongoose.model('Review', reviewSchema);

  module.exports= Review;
  