const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { auth, admin } = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get('/', auth, admin, getAllOrders);
router.put('/:id/status', auth, admin, updateOrderStatus);

module.exports = router;
