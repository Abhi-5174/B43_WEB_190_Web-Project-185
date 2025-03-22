const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', (req, res) => {
    res.render('layouts/main', { body: '../pages/cart.ejs' });
});

router.post('/checkout', async (req, res) => {
    const { items, totalPrice } = req.body;
    const order = new Order({ items, totalPrice });
    await order.save();
    res.json({ success: true, message: 'Order placed successfully!' });
});

module.exports = router;
