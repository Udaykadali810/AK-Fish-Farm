import { db, initDb } from './lib/db';

export default async function handler(req, res) {
    const { method } = req;

    try {
        await initDb();

        switch (method) {
            case 'GET':
                const { code } = req.query;
                if (code) {
                    const { rows } = await db`SELECT * FROM coupons WHERE code = ${code} AND status = 'active'`;
                    if (rows.length === 0) return res.status(404).json({ error: 'Invalid coupon' });
                    return res.status(200).json(rows[0]);
                }
                const { rows: coupons } = await db`SELECT * FROM coupons ORDER BY created_at DESC`;
                return res.status(200).json(coupons);

            case 'POST':
                const { code: nCode, discount_type, discount_value } = req.body;
                const { rows: newCoupon } = await db`
                    INSERT INTO coupons (code, discount_type, discount_value)
                    VALUES (${nCode}, ${discount_type}, ${discount_value})
                    RETURNING *
                `;
                return res.status(201).json(newCoupon[0]);

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Coupons API Error:', error);
        return res.status(500).json({ error: 'Database Connection Error' });
    }
}
