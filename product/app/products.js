const express = require('express');
const router = express.Router();
const Product = require('./models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Payload should be an array of products' });
    }

    const insertedProducts = await Product.insertMany(products);

    res.status(201).json({
      message: 'Products added successfully',
      products: insertedProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
