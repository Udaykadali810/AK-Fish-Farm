const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cart.controller');
const { auth } = require('../middleware/auth');

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/update', auth, updateCart);
router.delete('/remove/:productId', auth, removeFromCart);

module.exports = router;
