/* ============================================================
   AK Fish Farms — Orders API
   GET  /api/orders        → all orders  (admin)
   GET  /api/orders?id=X   → single order (track)
   POST /api/orders        → create new order
   PUT  /api/orders        → update order status
   ============================================================ */
'use strict';

const { query, initDb, withJson } = require('./lib/db');

async function handler(req, res) {
    const { method } = req;

    res.setHeader('Content-Type', 'application/json');
    await initDb();

    /* ─── GET ─────────────────────────────────────────────── */
    if (method === 'GET') {
        const { id } = req.query;

        if (id) {
            console.log(`🔍 Tracking Order: ${id}`);
            const result = await query('SELECT * FROM orders WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, error: 'Order not found' });
            }
            const o = result.rows[0];
            return res.status(200).json({
                success: true,
                ...o,
                customerName: o.customer_name,
                items: o.items_json,
                timestamp: o.created_at
            });
        }

        console.log('📋 Fetching ALL orders...');
        const result = await query('SELECT * FROM orders ORDER BY created_at DESC');
        const orders = result.rows.map(o => ({
            ...o,
            customerName: o.customer_name,
            items: o.items_json,
            timestamp: o.created_at
        }));
        return res.status(200).json(orders);
    }

    /* ─── POST: Create Order ─────────────────────────────── */
    if (method === 'POST') {
        const { id: bodyId, customerName, phone, city, items, total, status, coupon, note } = req.body || {};

        if (!customerName || !phone || !city) {
            return res.status(400).json({ success: false, error: 'customerName, phone, and city are required.' });
        }

        const finalId = bodyId || `AKF-${Date.now().toString(36).toUpperCase()}`;
        console.log(`🛒 New Order: ${finalId} from ${customerName}`);

        const itemsJson = JSON.stringify(items || []);

        const result = await query(
            `INSERT INTO orders (id, customer_name, phone, city, items_json, total, status, coupon, note)
             VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9)
             RETURNING *`,
            [finalId, customerName, phone, city, itemsJson, total || 0, status || 'New', coupon || null, note || null]
        );

        const o = result.rows[0];
        console.log(`✅ Order saved to Postgres: ${finalId}`);
        return res.status(201).json({
            success: true,
            ...o,
            customerName: o.customer_name,
            items: o.items_json,
            timestamp: o.created_at
        });
    }

    /* ─── PUT: Update Status ─────────────────────────────── */
    if (method === 'PUT') {
        const { id, status } = req.body || {};

        if (!id || !status) {
            return res.status(400).json({ success: false, error: 'id and status are required.' });
        }

        console.log(`🏷️ Updating Order Status: ${id} → ${status}`);
        const result = await query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        return res.status(200).json({ success: true, order: result.rows[0] });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
}

module.exports = withJson(handler);
