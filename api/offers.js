import { db, initDb } from './lib/db';

export default async function handler(req, res) {
    const { method } = req;

    try {
        await initDb();

        switch (method) {
            case 'GET':
                const { rows: offers } = await db`SELECT * FROM offers ORDER BY created_at DESC`;
                return res.status(200).json(offers.map(o => ({
                    ...o,
                    couponCode: o.coupon_code,
                    discountType: o.discount_type,
                    discountValue: o.discount_value,
                    minOrder: o.min_order
                })));

            case 'POST':
                const { title, couponCode, discountType, discountValue, minOrder, expiry, banner, status } = req.body;
                const { rows: newOffer } = await db`
                    INSERT INTO offers (title, coupon_code, discount_type, discount_value, min_order, expiry, banner, status)
                    VALUES (${title}, ${couponCode}, ${discountType}, ${discountValue}, ${minOrder}, ${expiry}, ${banner}, ${status || 'active'})
                    RETURNING *
                `;
                return res.status(201).json(newOffer[0]);

            case 'PUT':
                const { id, status: upStatus } = req.body;
                const { rows: updated } = await db`
                    UPDATE offers SET status = ${upStatus} WHERE id = ${id} RETURNING *
                `;
                return res.status(200).json(updated[0]);

            case 'DELETE':
                const { id: delId } = req.query;
                await db`DELETE FROM offers WHERE id = ${delId}`;
                return res.status(200).json({ success: true });

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Offers API Error:', error);
        return res.status(500).json({ error: 'Database Connection Error' });
    }
}
