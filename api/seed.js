/* ============================================================
   AK Fish Farms — Database Seeder
   GET /api/seed  → Seeds products, offers, and admin user
   ⚠️  Run ONLY ONCE after first Vercel deployment.
   ============================================================ */
'use strict';

const { initDb, query, withJson } = require('./lib/db');
const bcrypt = require('bcryptjs');

const SEED_PRODUCTS = [
    { name: 'Flowerhorn (S)', price: 500, category: 'special', status: 'in_stock', description: 'Baby Flowerhorn with premium hump.', img: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=400&q=80' },
    { name: 'Flowerhorn (B)', price: 1500, category: 'special', status: 'in_stock', description: 'Adult Flowerhorn with vibrant colours.', img: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=400&q=80' },
    { name: 'Arowana (S)', price: 2000, category: 'special', status: 'in_stock', description: 'Silver Arowana in planted tank.', img: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Arowana (B)', price: 6000, category: 'special', status: 'in_stock', description: 'Silver Arowana against black background.', img: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Oscar Fish', price: 300, category: 'special', status: 'in_stock', description: 'Tiger Oscar — energetic & bold.', img: 'https://images.unsplash.com/photo-1592419186946-e81df7d4dd5a?auto=format&fit=crop&w=400&q=80' },
    { name: 'Parrot Fish', price: 250, category: 'special', status: 'in_stock', description: 'Blood Parrot — peaceful cichlid.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
    { name: 'Betta Fish', price: 200, category: 'special', status: 'in_stock', description: 'Halfmoon Betta — stunning fins.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Goldfish', price: 150, category: 'special', status: 'in_stock', description: 'Fancy Goldfish — classic beauty.', img: 'https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?auto=format&fit=crop&w=400&q=80' },
    { name: 'Koi', price: 800, category: 'special', status: 'in_stock', description: 'Japanese Koi — pond royalty.', img: 'https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?auto=format&fit=crop&w=400&q=80' },
    { name: 'Fancy Guppy Pair', price: 150, category: 'guppy', status: 'in_stock', description: 'Colorful fancy guppy pair.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
    { name: 'Dragon Guppy', price: 200, category: 'guppy', status: 'in_stock', description: 'Dragon scale pattern guppy.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
    { name: 'Red Tail Guppy', price: 180, category: 'guppy', status: 'in_stock', description: 'Vivid red tail guppy.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
];

const SEED_OFFERS = [
    { title: 'Welcome Discount', coupon_code: 'AK10', discount_type: 'percentage', discount_value: 10, min_order: 0, status: 'active', expiry: '2026-12-31', banner: 'Get 10% off on your first order!' },
    { title: 'Big Fish Savings', coupon_code: 'FISH50', discount_type: 'flat', discount_value: 50, min_order: 500, status: 'active', expiry: '2026-12-31', banner: 'Flat ₹50 off on orders above ₹500' },
];

async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    console.log('🌱 Starting database seed...');
    const report = { products: 0, offers: 0, admin: false, skipped: [] };

    await initDb();

    // ─── Seed Products ───────────────────────────────────────
    const existingProds = await query('SELECT COUNT(*) as cnt FROM products');
    if (parseInt(existingProds.rows[0].cnt, 10) === 0) {
        console.log('🌱 Seeding products...');
        for (const p of SEED_PRODUCTS) {
            await query(
                'INSERT INTO products (name, price, img, category, status, description) VALUES ($1, $2, $3, $4, $5, $6)',
                [p.name, p.price, p.img, p.category, p.status, p.description]
            );
            report.products++;
        }
        console.log(`✅ Inserted ${report.products} products.`);
    } else {
        report.skipped.push(`products (already have ${existingProds.rows[0].cnt} rows)`);
    }

    // ─── Seed Offers ─────────────────────────────────────────
    const existingOffers = await query('SELECT COUNT(*) as cnt FROM offers');
    if (parseInt(existingOffers.rows[0].cnt, 10) === 0) {
        console.log('🌱 Seeding offers...');
        for (const o of SEED_OFFERS) {
            await query(
                'INSERT INTO offers (title, coupon_code, discount_type, discount_value, min_order, status, expiry, banner) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (coupon_code) DO NOTHING',
                [o.title, o.coupon_code, o.discount_type, o.discount_value, o.min_order, o.status, o.expiry, o.banner]
            );
            report.offers++;
        }
        console.log(`✅ Inserted ${report.offers} offers.`);
    } else {
        report.skipped.push(`offers (already have ${existingOffers.rows[0].cnt} rows)`);
    }

    // ─── Seed Admin User ──────────────────────────────────────
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';

    const existingAdmin = await query('SELECT COUNT(*) as cnt FROM admin_users WHERE username = $1', [adminUser]);
    if (parseInt(existingAdmin.rows[0].cnt, 10) === 0) {
        console.log(`🌱 Seeding admin user: "${adminUser}"...`);
        const hashed = await bcrypt.hash(adminPass, 10);
        await query(
            'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
            [adminUser, hashed]
        );
        report.admin = true;
        console.log(`✅ Admin user "${adminUser}" created.`);
    } else {
        report.skipped.push(`admin user "${adminUser}" (already exists)`);
    }

    console.log('🎉 Seed completed!', report);

    return res.status(200).json({
        success: true,
        message: '🌱 Database seeded successfully!',
        report,
        note: 'Products, offers, and admin user are now ready. You can now delete or protect this endpoint.'
    });
}

module.exports = withJson(handler);
