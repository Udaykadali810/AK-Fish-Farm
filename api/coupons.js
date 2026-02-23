/* ============================================================
   AK Fish Farms — Coupons API
   GET  /api/coupons         → all coupons
   GET  /api/coupons?code=X  → validate coupon
   POST /api/coupons         → add coupon
   ============================================================ */
'use strict';

const { query, initDb, withJson } = require('./lib/db');

async function handler(req, res) {
    const { method } = req;

    res.setHeader('Content-Type', 'application/json');
    await initDb();

    /* ─── GET ─────────────────────────────────────────────── */
    if (method === 'GET') {
        const { code } = req.query;

        if (code) {
            console.log(`🎫 Validating Coupon: ${code}`);
            const result = await query(
                "SELECT * FROM coupons WHERE code = $1 AND status = 'active'",
                [code.toUpperCase()]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, error: 'Invalid or inactive coupon' });
            }
            return res.status(200).json({ success: true, ...result.rows[0] });
        }

        console.log('📋 Fetching All Coupons...');
        const result = await query('SELECT * FROM coupons ORDER BY created_at DESC');
        return res.status(200).json(result.rows);
    }

    /* ─── POST: Add Coupon ───────────────────────────────── */
    if (method === 'POST') {
        const { code, discount_type, discount_value } = req.body || {};

        if (!code || !discount_type || !discount_value) {
            return res.status(400).json({ success: false, error: 'code, discount_type, and discount_value are required.' });
        }

        console.log(`🎫 Creating Coupon: ${code}`);
        const result = await query(
            'INSERT INTO coupons (code, discount_type, discount_value) VALUES ($1, $2, $3) RETURNING *',
            [code.toUpperCase(), discount_type, discount_value]
        );
        return res.status(201).json({ success: true, ...result.rows[0] });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
}

module.exports = withJson(handler);
