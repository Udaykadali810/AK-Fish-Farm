import { db, initDb, withJson } from './lib/db';

async function handler(req, res) {
    const { method } = req;
    await initDb();

    switch (method) {
        case 'GET':
            const { code } = req.query;
            if (code) {
                console.log(`🎫 Validating Coupon: ${code}`);
                const { rows } = await db`SELECT * FROM coupons WHERE code = ${code} AND status = 'active'`;
                if (rows.length === 0) return res.status(404).json({ success: false, error: 'Invalid or inactive coupon' });
                return res.status(200).json(rows[0]);
            }
            console.log('📋 Fetching All Coupons...');
            const { rows: coupons } = await db`SELECT * FROM coupons ORDER BY created_at DESC`;
            return res.status(200).json(coupons);

        case 'POST':
            const { code: nCode, discount_type, discount_value } = req.body;
            console.log(`🎫 Creating Coupon: ${nCode}`);
            const { rows: newCoupon } = await db`
                INSERT INTO coupons (code, discount_type, discount_value)
                VALUES (${nCode}, ${discount_type}, ${discount_value})
                RETURNING *
            `;
            return res.status(201).json(newCoupon[0]);

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
    }
}

export default withJson(handler);
