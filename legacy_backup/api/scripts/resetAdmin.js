const { Admin, sequelize } = require('../db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetAdmin = async () => {
    try {
        const email = 'admin@akfishfarms.com';
        const password = 'admin_password_2026';

        await sequelize.sync();

        const hashedPassword = await bcrypt.hash(password, 10);

        const [admin, created] = await Admin.findOrCreate({
            where: { email },
            defaults: { password: hashedPassword }
        });

        if (!created) {
            admin.password = hashedPassword;
            await admin.save();
            console.log('Admin password reset successfully.');
        } else {
            console.log('Admin created successfully.');
        }

        console.log('Email:', email);
        console.log('Password:', password);
        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin:', error);
        process.exit(1);
    }
};

resetAdmin();
