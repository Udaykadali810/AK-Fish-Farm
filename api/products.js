/* ============================================================
   AK Fish Farms — Products API
   GET    /api/products       → all products
   POST   /api/products       → add product
   PUT    /api/products       → update product
   DELETE /api/products?id=X  → delete product
   ============================================================ */
'use strict';

const { query, initDb, withJson } = require('./lib/db');

async function handler(req, res) {
    const { method } = req;

    res.setHeader('Content-Type', 'application/json');
    await initDb();

    /* ─── GET ─────────────────────────────────────────────── */
    if (method === 'GET') {
        console.log('📦 Fetching Products from Postgres...');
        const result = await query('SELECT * FROM products ORDER BY id ASC');
        return res.status(200).json(result.rows);
    }

    /* ─── POST: Add Product ──────────────────────────────── */
    if (method === 'POST') {
        const { name, price, img, category, status, desc, description } = req.body || {};

        if (!name || !price) {
            return res.status(400).json({ success: false, error: 'name and price are required.' });
        }

        console.log(`➕ Adding Product: ${name}`);
        const result = await query(
            `INSERT INTO products (name, price, img, category, status, description)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [name, price, img || null, category || 'special', status || 'in_stock', desc || description || null]
        );

        console.log(`✅ Product added: ${result.rows[0].id} — ${name}`);
        return res.status(201).json({ success: true, ...result.rows[0] });
    }

    /* ─── PUT: Update Product ────────────────────────────── */
    if (method === 'PUT') {
        const { id, name, price, img, category, status, description, desc } = req.body || {};

        if (!id) {
            return res.status(400).json({ success: false, error: 'Product id is required.' });
        }

        console.log(`📝 Updating Product ID: ${id}`);
        const result = await query(
            `UPDATE products
             SET name = $1, price = $2, img = $3, category = $4, status = $5,
                 description = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [name, price, img || null, category || 'special', status || 'in_stock', desc || description || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        console.log(`✅ Product updated: ${id}`);
        return res.status(200).json({ success: true, ...result.rows[0] });
    }

    /* ─── DELETE: Remove Product ─────────────────────────── */
    if (method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, error: 'Product id is required as query parameter.' });
        }

        console.log(`🗑️ Deleting Product ID: ${id}`);
        await query('DELETE FROM products WHERE id = $1', [id]);
        console.log(`✅ Product deleted: ${id}`);
        return res.status(200).json({ success: true, message: `Product ${id} deleted.` });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
}

module.exports = withJson(handler);
