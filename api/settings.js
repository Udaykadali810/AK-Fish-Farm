import { db, initDb, withJson } from './lib/db';

async function handler(req, res) {
    const { method } = req;
    await initDb();

    if (method === 'GET') {
        console.log('⚙️ Fetching Global Settings...');
        const { rows } = await db`SELECT value FROM settings WHERE key = 'global_settings'`;
        const settings = rows.length > 0 ? JSON.parse(rows[0].value) : {};
        return res.status(200).json(settings);
    }

    if (method === 'POST' || method === 'PUT') {
        console.log('⚙️ Updating Global Settings...');
        const { rows: existingRows } = await db`SELECT value FROM settings WHERE key = 'global_settings'`;
        const existing = existingRows.length > 0 ? JSON.parse(existingRows[0].value) : {};
        const updated = { ...existing, ...req.body };

        await db`
            INSERT INTO settings (key, value)
            VALUES ('global_settings', ${JSON.stringify(updated)})
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
        `;
        return res.status(200).json({ success: true, settings: updated });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
}

export default withJson(handler);
