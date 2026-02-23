/* ============================================================
   AK Fish Farms — Offers API
   GET    /api/offers       → all offers
   POST   /api/offers       → add offer
   PUT    /api/offers       → toggle status
   DELETE /api/offers?id=X  → delete offer
   ============================================================ */
'use strict';

const { query, initDb, withJson } = require('./lib/db');

function mapOffer(o) {
    return {
        ...o,
        couponCode: o.coupon_code,
        discountType: o.discount_type,
        discountValue: parseFloat(o.discount_value),
        minOrder: parseFloat(o.min_order) || 0
    };
}

async function handler(req, res) {
    const { method } = req;

    res.setHeader('Content-Type', 'application/json');
    await initDb();

    /* ─── GET: All Offers ────────────────────────────────── */
    if (method === 'GET') {
        console.log('🎏 Fetching Global Offers from Postgres...');
        const result = await query('SELECT * FROM offers ORDER BY created_at DESC');
        return res.status(200).json(result.rows.map(mapOffer));
    }

    /* ─── POST: Add Offer ────────────────────────────────── */
    if (method === 'POST') {
        const { title, couponCode, discountType, discountValue, minOrder, expiry, banner, status } = req.body || {};

        if (!title || !couponCode || !discountType || !discountValue) {
            return res.status(400).json({ success: false, error: 'title, couponCode, discountType, and discountValue are required.' });
        }

        console.log(`🎁 Adding Global Offer: ${couponCode}`);
        const result = await query(
            `INSERT INTO offers (title, coupon_code, discount_type, discount_value, min_order, expiry, banner, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                title,
                couponCode.toUpperCase(),
                discountType,
                discountValue,
                minOrder || 0,
                expiry || null,
                banner || null,
                status || 'active'
            ]
        );

        console.log(`✅ Offer created globally: ${couponCode}`);
        return res.status(201).json({ success: true, ...mapOffer(result.rows[0]) });
    }

    /* ─── PUT: Toggle Status ─────────────────────────────── */
    if (method === 'PUT') {
        const { id, status } = req.body || {};

        if (!id || !status) {
            return res.status(400).json({ success: false, error: 'id and status are required.' });
        }

        console.log(`🔄 Toggling Offer: ${id} → ${status}`);
        const result = await query(
            'UPDATE offers SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Offer not found' });
        }

        return res.status(200).json({ success: true, ...mapOffer(result.rows[0]) });
    }

    /* ─── DELETE: Remove Offer ───────────────────────────── */
    if (method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, error: 'Offer id is required as query parameter.' });
        }

        console.log(`🗑️ Deleting Offer ID: ${id}`);
        await query('DELETE FROM offers WHERE id = $1', [id]);
        console.log(`✅ Offer deleted globally: ${id}`);
        return res.status(200).json({ success: true, message: `Offer ${id} deleted.` });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
}

module.exports = withJson(handler);
