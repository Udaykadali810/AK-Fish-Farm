const mongoose = require('mongoose');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const products = [
    {
        name: "Red Cap Oranda Goldfish",
        description: "The Red Cap Oranda is a favorite among goldfish enthusiasts. It features a distinctive red cap or 'wen' on its head and a beautiful white body.",
        price: 450,
        offerPrice: 399,
        category: "Goldfish",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1544280597-906f363c467d?q=80&w=800&auto=format&fit=crop"],
        featured: true
    },
    {
        name: "Blue Dragon Halfmoon Betta",
        description: "Stunning metallic blue body with dragon scales and a beautiful halfmoon tail. This male Betta is a true showstopper for any small aquarium.",
        price: 800,
        offerPrice: 650,
        category: "Betta",
        stock: 10,
        images: ["https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800&auto=format&fit=crop"],
        featured: true
    },
    {
        name: "Electric Blue Cichlid",
        description: "One of the most vibrant freshwater fish available. These African cichlids are known for their intense blue coloration and active personality.",
        price: 350,
        offerPrice: 299,
        category: "Cichlids",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=800&auto=format&fit=crop"],
        featured: true
    },
    {
        name: "Nano Aquatic Plant Pack",
        description: "A selection of 5 easy-to-grow aquatic plants perfect for beginners and nano tanks. Includes Anubias, Java Fern, and Moss.",
        price: 1200,
        offerPrice: 999,
        category: "Live Plants",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1502472545332-e24172e772ea?q=80&w=800&auto=format&fit=crop"],
        featured: false
    }
];

const coupons = [
    {
        code: "WELCOME10",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 500,
        expiryDate: new Date("2026-12-31"),
        isActive: true
    },
    {
        code: "FISHLOVE",
        discountType: "fixed",
        discountValue: 100,
        minOrderAmount: 1000,
        expiryDate: new Date("2026-12-31"),
        isActive: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/akfishfarms');
        console.log("Connected to DB for seeding...");

        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log("Products seeded!");

        await Coupon.deleteMany({});
        await Coupon.insertMany(coupons);
        console.log("Coupons seeded!");

        // Create Admin User
        await User.deleteMany({ role: 'admin' });
        const admin = new User({
            name: "Admin AK",
            email: "admin@akfishfarms.com",
            password: "adminpassword", // Will be hashed by pre-save middleware
            role: "admin"
        });
        await admin.save();
        console.log("Admin user created: admin@akfishfarms.com / adminpassword");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
