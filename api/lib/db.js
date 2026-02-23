/* ============================================================
   AK Fish Farms — Centralized Database Connection
   Uses @vercel/postgres (Neon PostgreSQL)
   Compatible with Vercel Serverless Functions
   ============================================================ */

const { createPool } = require('@vercel/postgres');

// ─── Determine Database URL ───────────────────────────────────
const DB_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!DB_URL) {
    console.error('❌ FATAL: Neither POSTGRES_URL nor DATABASE_URL is set in environment variables.');
}

// ─── Create a pool connection ─────────────────────────────────
let pool = null;

function getPool() {
    if (!pool) {
        if (!DB_URL) {
            throw new Error('Database not configured. Add POSTGRES_URL to Vercel Environment Variables.');
        }
        console.log('🐘 Connecting to Neon Postgres...');
        pool = createPool({ connectionString: DB_URL });
        console.log('✅ Database Pool Created Successfully');
    }
    return pool;
}

// ─── Execute a query safely ───────────────────────────────────
async function query(text, params = []) {
    const p = getPool();
    try {
        const result = await p.query(text, params);
        return result;
    } catch (err) {
        console.error('❌ DB Query Error:', err.message);
        throw err;
    }
}

// ─── Schema Initialization ────────────────────────────────────
let schemaInitialized = false;

async function initDb() {
    if (!DB_URL) {
        throw new Error('Database not configured. Please add POSTGRES_URL in Vercel settings.');
    }

    if (schemaInitialized) return;

    console.log('📡 Neon Postgres URL found. Initializing schema...');

    try {
        const p = getPool();

        await p.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                img TEXT,
                category VARCHAR(50),
                status VARCHAR(50) DEFAULT 'in_stock',
                description TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await p.query(`
            CREATE TABLE IF NOT EXISTS orders (
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
            )
        `);

        await p.query(`
            CREATE TABLE IF NOT EXISTS offers (
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
            )
        `);

        await p.query(`
            CREATE TABLE IF NOT EXISTS coupons (
                id SERIAL PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                discount_type VARCHAR(20) NOT NULL,
                discount_value DECIMAL(10, 2) NOT NULL,
                status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await p.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await p.query(`
            CREATE TABLE IF NOT EXISTS settings (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        schemaInitialized = true;
        console.log('✅ Database Connected Successfully. Schema Verified.');
    } catch (err) {
        console.error('❌ Database Initialization Error:', err.message);
        throw new Error('Database connection failed: ' + err.message);
    }
}

// ─── JSON Error Wrapper ───────────────────────────────────────
function withJson(handler) {
    return async (req, res) => {
        // Always set JSON content-type header FIRST
        res.setHeader('Content-Type', 'application/json');

        try {
            return await handler(req, res);
        } catch (error) {
            console.error(`🚨 API Error [${req.url}]:`, error.message);
            // Ensure we always respond with JSON, never HTML
            if (!res.headersSent) {
                return res.status(500).json({
                    success: false,
                    error: error.message || 'Internal Server Error'
                });
            }
        }
    };
}

module.exports = { query, initDb, withJson, getPool };
