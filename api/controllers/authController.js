const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otps = new Map(); // In production, use Redis or a DB table

// Hardcoded admin credentials for serverless deployment
const ADMIN_EMAIL = 'admin@akfishfarms.com';
const ADMIN_PASSWORD = 'AKFish2026!';
const JWT_SECRET = 'ak_fish_farms_secret_key_2026_v1';


exports.login = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const identifier = email || username;

        console.log('Login attempt for:', identifier);

        // Check if it's the admin account
        if (identifier === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = jwt.sign({ id: 1, role: 'admin', email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, role: 'admin' });
        }

        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.sendOtp = async (req, res) => {
    try {
        console.log('sendOtp called with body:', req.body);
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            console.log('Phone number missing');
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 5 * 60 * 1000; // 5 mins

        otps.set(phoneNumber, { otp, expires });

        // In reality, send via SMS service (Twilio/fast2sms)
        console.log(`OTP for ${phoneNumber}: ${otp}`);

        res.json({ message: 'OTP sent successfully', debugOtp: otp }); // Don't send OTP in response in production
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        const record = otps.get(phoneNumber);

        if (!record || record.otp !== otp || record.expires < Date.now()) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        otps.delete(phoneNumber);

        const { User } = require('../db');
        let [user] = await User.findOrCreate({ where: { phoneNumber } });

        const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user, role: 'user' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};

exports.loginWithPhone = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

        const { User } = require('../db');
        let [user] = await User.findOrCreate({ where: { phoneNumber } });

        const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user, role: 'user' });
    } catch (error) {
        console.error('Phone login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const adminId = req.adminId;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Admin.update({ password: hashedPassword }, { where: { id: adminId } });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
