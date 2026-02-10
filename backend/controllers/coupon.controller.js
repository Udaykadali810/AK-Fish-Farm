const Coupon = require('../models/Coupon');

const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOne({ code, isActive: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found or inactive' });

        if (new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ message: 'Coupon expired' });
        }

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCoupons, createCoupon, validateCoupon };
