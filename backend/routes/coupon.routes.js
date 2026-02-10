const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, validateCoupon } = require('../controllers/coupon.controller');
const { auth, admin } = require('../middleware/auth');

router.get('/', getCoupons);
router.post('/', auth, admin, createCoupon);
router.get('/validate/:code', auth, validateCoupon);

module.exports = router;
