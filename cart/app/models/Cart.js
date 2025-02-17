const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  src: { type: String },
  title: { type: String }
});

module.exports = mongoose.model('Cart', CartSchema);
