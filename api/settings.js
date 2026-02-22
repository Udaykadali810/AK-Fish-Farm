import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const { method } = req;
    const SETTINGS_KEY = 'akf_settings';

    if (method === 'GET') {
        try {
            const settings = await kv.get(SETTINGS_KEY);
            res.status(200).json(settings || {});
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch settings' });
        }
    } else if (method === 'POST' || method === 'PUT') {
        try {
            const existing = await kv.get(SETTINGS_KEY) || {};
            const updated = { ...existing, ...req.body };
            await kv.set(SETTINGS_KEY, updated);
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({ error: 'Failed to save settings' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
