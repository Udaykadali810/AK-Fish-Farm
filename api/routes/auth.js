const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log('Loading auth routes...');
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login-phone', authController.loginWithPhone);

module.exports = router;
