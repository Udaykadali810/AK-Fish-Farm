const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const secret = 'ak_fish_farms_secret_key_2026_v1';
        const decoded = jwt.verify(token, secret);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
