const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

  id: { type: Number },
  date: { type: String },
  quantity: { type: Number },
  total: { type: Number },
});

module.exports = mongoose.model('Order', OrderSchema);
