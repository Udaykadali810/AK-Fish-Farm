const { getData, saveData } = require('../utils/storage');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    const data = getData();

    if (username !== data.admin.username) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // First login case: Set password if it's null
    if (data.admin.password === null) {
        const hashedPassword = await bcrypt.hash(password, 10);
        data.admin.password = hashedPassword;
        saveData(data);
        const token = jwt.sign({ username }, process.env.JWT_SECRET || 'akfishfarms_secret', { expiresIn: '1d' });
        return res.json({ message: 'Admin password set and logged in', token });
    }

    // Regular login
    const isMatch = await bcrypt.compare(password, data.admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'akfishfarms_secret', { expiresIn: '1d' });
    res.json({ message: 'Logged in successfully', token });
};

const changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const data = getData();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    data.admin.password = hashedPassword;
    saveData(data);

    res.json({ message: 'Password updated successfully' });
};

module.exports = { adminLogin, changePassword };
