const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Public routes for orders
router.post('/', orderController.createOrder);
router.get('/:orderId', orderController.getOrderById);
router.get('/track/:orderId', orderController.getOrderById); // Matching frontend TrackOrder.jsx

module.exports = router;
