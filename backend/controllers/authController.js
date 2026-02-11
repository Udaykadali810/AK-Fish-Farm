const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../db');

exports.login = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const identifier = email || username;

        console.log('Login attempt for:', identifier);
        const admin = await Admin.findOne({ where: { email: identifier } });
        console.log('Admin record found:', admin ? 'Yes' : 'No');

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
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
