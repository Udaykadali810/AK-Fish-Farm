/* ============================================================
   AK Fish Farms — Reset API
   DELETE /api/reset-data?type=all|orders|offers|products
   ============================================================ */
'use strict';

const { query, initDb, withJson } = require('./lib/db');

async function handler(req, res) {
    const { method } = req;
    const { type } = req.query;

    if (method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
    }

    await initDb();

    console.log(`🧹 RESET REQUEST: type=${type}`);

    try {
        if (type === 'all') {
            await query('DELETE FROM orders');
            await query('DELETE FROM offers');
            // We usually don't delete products on 'Reset Data' unless specified, 
            // but let's stick to 'all stored admin data' which implies records.
            // Documentation says "clear orders, offers, and optionally products".
            // I'll stick to orders and offers for safety unless 'type=products' is used.
            return res.status(200).json({ success: true, message: 'All orders and offers cleared.' });
        }

        if (type === 'orders') {
            await query('DELETE FROM orders');
            return res.status(200).json({ success: true, message: 'All orders cleared.' });
        }

        if (type === 'offers') {
            await query('DELETE FROM offers');
            return res.status(200).json({ success: true, message: 'All offers cleared.' });
        }

        if (type === 'products') {
            await query('DELETE FROM products');
            return res.status(200).json({ success: true, message: 'All products cleared.' });
        }

        return res.status(400).json({ success: false, error: 'Invalid reset type.' });

    } catch (e) {
        console.error('❌ Reset Failed:', e);
        return res.status(500).json({ success: false, error: e.message });
    }
}

module.exports = withJson(handler);
