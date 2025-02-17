const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  description: { type: String, required: true },
  characteristics: {
    Гарантия: { type: String, required: true },
    Экран: { type: String, required: true },
    Процессор: { type: String, required: true },
  },
  status: { type: String, required: true }, 
  src: { type: String, required: true },   
  price: { type: Number, required: true },
  title: { type: String, required: true },
  rating: { type: String }, 
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  inStock: { type: Boolean, required: true },
  color: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
