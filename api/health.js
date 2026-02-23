/* ============================================================
   AK Fish Farms — API Health Check & DB Debug
   GET /api/health  → Returns DB connection status + env info
   ============================================================ */
'use strict';

module.exports = async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');

    const hasPostgresUrl = !!process.env.POSTGRES_URL;
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const hasAdminUser = !!process.env.ADMIN_USER;
    const hasAdminPass = !!process.env.ADMIN_PASS;

    let dbConnected = false;
    let dbError = null;
    let tablesFound = [];

    if (hasPostgresUrl || hasDatabaseUrl) {
        try {
            const { createPool } = require('@vercel/postgres');
            const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
            const pool = createPool({ connectionString: url });

            const result = await pool.query(`
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = 'public'
                ORDER BY table_name
            `);
            tablesFound = result.rows.map(r => r.table_name);
            dbConnected = true;
        } catch (err) {
            dbError = err.message;
        }
    }

    return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: {
            POSTGRES_URL: hasPostgresUrl ? '✅ Set' : '❌ Missing',
            DATABASE_URL: hasDatabaseUrl ? '✅ Set' : '❌ Missing',
            ADMIN_USER: hasAdminUser ? '✅ Set' : '⚠️ Not set (will use "admin")',
            ADMIN_PASS: hasAdminPass ? '✅ Set' : '⚠️ Not set (will use "admin123")'
        },
        database: {
            connected: dbConnected,
            error: dbError || null,
            tables: tablesFound
        },
        message: dbConnected
            ? '✅ Neon Postgres connected and working!'
            : '❌ Database not connected. Check environment variables.'
    });
};
