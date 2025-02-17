const express = require('express');
const router = express.Router();
const Order = require('./models/Order');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const order = req.body;

    const newOrder = new Order(order);
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order added successfully',
      product: savedOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
