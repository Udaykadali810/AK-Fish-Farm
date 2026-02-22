import { db, initDb } from './lib/db';

export default async function handler(req, res) {
    const { method } = req;

    try {
        await initDb();

        if (method === 'GET') {
            const { rows } = await db`SELECT value FROM settings WHERE key = 'global_settings'`;
            const settings = rows.length > 0 ? JSON.parse(rows[0].value) : {};
            return res.status(200).json(settings);
        } else if (method === 'POST' || method === 'PUT') {
            const { rows: existingRows } = await db`SELECT value FROM settings WHERE key = 'global_settings'`;
            const existing = existingRows.length > 0 ? JSON.parse(existingRows[0].value) : {};
            const updated = { ...existing, ...req.body };

            await db`
                INSERT INTO settings (key, value)
                VALUES ('global_settings', ${JSON.stringify(updated)})
                ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
            `;
            return res.status(200).json(updated);
        }

        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    } catch (error) {
        console.error('Settings API Error:', error);
        return res.status(500).json({ error: 'Database Connection Error' });
    }
}
