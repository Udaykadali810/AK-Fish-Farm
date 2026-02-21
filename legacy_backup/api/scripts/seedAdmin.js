const { Admin, sequelize } = require('../db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        const email = 'admin@akfishfarms.com';
        const password = 'admin_password_2026'; // I should use a default or ask, but I'll set a placeholder

        await sequelize.sync();

        const hashedPassword = await bcrypt.hash(password, 10);

        const [admin, created] = await Admin.findOrCreate({
            where: { email },
            defaults: { password: hashedPassword }
        });

        if (!created) {
            console.log('Admin exists. Updating password...');
            admin.password = hashedPassword;
            await admin.save();
        }

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
