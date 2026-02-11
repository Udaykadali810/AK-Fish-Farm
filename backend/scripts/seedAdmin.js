const { Admin, sequelize } = require('../db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        const email = 'admin@akfishfarms.com';
        const password = 'admin_password_2026'; // I should use a default or ask, but I'll set a placeholder

        await sequelize.sync();

        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Admin already exists.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({
            email,
            password: hashedPassword
        });

        console.log('Admin created successfully.');
        console.log('Email:', email);
        console.log('Password:', password);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
