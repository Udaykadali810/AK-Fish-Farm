const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const offerController = require('../controllers/offerController');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Security
router.post('/change-password', authController.changePassword);

// Orders management
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:orderId', orderController.updateOrderStatus);
router.delete('/orders/:orderId', orderController.deleteOrder);

// Offers management
router.get('/offers', offerController.getAllOffers);
router.post('/offers', offerController.createOffer);
router.delete('/offers/:id', offerController.deleteOffer);

// Products management
router.get('/products', productController.getAllProducts);
router.put('/products/:id', productController.updateProduct);
router.post('/products/sync', productController.syncProducts);

module.exports = router;
