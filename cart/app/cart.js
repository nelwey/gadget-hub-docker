const express = require('express');
const router = express.Router();
const Cart = require('./models/Cart');

router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add', async (req, res) => {
  let { userId, productId, quantity, price, subtotal, src, title } = req.body;
  try {
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      existingCartItem.subtotal = existingCartItem.quantity * price;
      await existingCartItem.save();
      return res.json(existingCartItem);
    } else {
      subtotal = price;
      const newCartItem = new Cart({ userId, productId, quantity, price, subtotal, src, title });
      await newCartItem.save();
      res.status(201).json(newCartItem);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete/:userId/:productId', async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.params.userId, productId: req.params.productId });
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/update/:productId', async (req, res) => {
  const { quantity, action } = req.body;
  try {
    let cartItem = await Cart.findOne({ productId: req.params.productId });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (action === 'increase') {
      cartItem.quantity += quantity;
      cartItem.subtotal += cartItem.price;
      await cartItem.save();
      return res.json(cartItem);
    } else if (action === 'decrease') {
      cartItem.quantity -= quantity;
      cartItem.subtotal -= cartItem.price;

      if (cartItem.quantity <= 0) {
        await Cart.deleteOne({ productId: req.params.productId });
        return res.json({ message: 'Cart item removed' });
      }

      await cartItem.save();
      return res.json(cartItem);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
