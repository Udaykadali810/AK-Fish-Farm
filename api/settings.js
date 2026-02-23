/* ============================================================
   AK Fish Farms — Settings API
   GET         /api/settings → get global settings
   POST or PUT /api/settings → update settings
   ============================================================ */
'use strict';

const { query, initDb, withJson } = require('./lib/db');

async function handler(req, res) {
    const { method } = req;

    res.setHeader('Content-Type', 'application/json');
    await initDb();

    /* ─── GET ─────────────────────────────────────────────── */
    if (method === 'GET') {
        console.log('⚙️ Fetching Global Settings...');
        const result = await query("SELECT value FROM settings WHERE key = 'global_settings'");
        const settings = result.rows.length > 0 ? JSON.parse(result.rows[0].value) : {};
        return res.status(200).json(settings);
    }

    /* ─── POST / PUT: Update Settings ───────────────────── */
    if (method === 'POST' || method === 'PUT') {
        console.log('⚙️ Updating Global Settings...');

        const existing_result = await query("SELECT value FROM settings WHERE key = 'global_settings'");
        const existing = existing_result.rows.length > 0 ? JSON.parse(existing_result.rows[0].value) : {};
        const updated = { ...existing, ...req.body };

        await query(
            `INSERT INTO settings (key, value, updated_at)
             VALUES ('global_settings', $1, CURRENT_TIMESTAMP)
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
            [JSON.stringify(updated)]
        );

        return res.status(200).json({ success: true, settings: updated });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
}

module.exports = withJson(handler);
