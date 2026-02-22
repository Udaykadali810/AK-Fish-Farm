import { sql } from '@vercel/postgres';

export const db = sql;

let isDbInitialized = false;

/**
 * Ensures the database schema is initialized and environment variables are present.
 * Throws a JSON-friendly error if configuration is missing.
 */
export async function initDb() {
    if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
        console.error('❌ Database Error: POSTGRES_URL or DATABASE_URL missing.');
        throw new Error('Database not configured in Vercel. Please add POSTGRES_URL/DATABASE_URL in settings.');
    }

    if (isDbInitialized) return;

    console.log('🐘 Connecting to Postgres...');
    console.log('📡 POSTGRES_URL found. Initializing Schema...');

    try {
        await Promise.all([
            sql`CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                img TEXT,
                category VARCHAR(50),
                status VARCHAR(50) DEFAULT 'in_stock',
                description TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            sql`CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(100) PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                city VARCHAR(100) NOT NULL,
                items_json JSONB NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'New',
                coupon VARCHAR(50),
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            sql`CREATE TABLE IF NOT EXISTS offers (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                coupon_code VARCHAR(50) UNIQUE NOT NULL,
                discount_type VARCHAR(20) NOT NULL,
                discount_value DECIMAL(10, 2) NOT NULL,
                min_order DECIMAL(10, 2) DEFAULT 0,
                status VARCHAR(20) DEFAULT 'active',
                expiry VARCHAR(50),
                banner TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            sql`CREATE TABLE IF NOT EXISTS coupons (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                discount_type VARCHAR(20) NOT NULL,
                discount_value DECIMAL(10, 2) NOT NULL,
                status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            sql`CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            sql`CREATE TABLE IF NOT EXISTS settings (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`
        ]);

        isDbInitialized = true;
        console.log('✅ Postgres Connected Successfully. Schema Verified.');
    } catch (err) {
        console.error('❌ Database Initialization Error:', err);
        throw new Error('Database connection failed during initialization: ' + err.message);
    }
}

/**
 * Wrapper to ensure every API response is valid JSON.
 */
export function withJson(handler) {
    return async (req, res) => {
        try {
            return await handler(req, res);
        } catch (error) {
            console.error(`🚨 API Error [${req.url}]:`, error.message);
            return res.status(500).json({
                success: false,
                error: 'Server Error',
                message: error.message
            });
        }
    };
}
