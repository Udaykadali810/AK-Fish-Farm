import { db, initDb, withJson } from './lib/db';

async function handler(req, res) {
    const { method } = req;
    await initDb();

    switch (method) {
        case 'GET':
            console.log('🎏 Fetching Offers...');
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
            console.log(`🎁 Adding New Offer: ${couponCode}`);
            const { rows: newOffer } = await db`
                INSERT INTO offers (title, coupon_code, discount_type, discount_value, min_order, expiry, banner, status)
                VALUES (${title}, ${couponCode}, ${discountType}, ${discountValue}, ${minOrder}, ${expiry}, ${banner}, ${status || 'active'})
                RETURNING *
            `;
            return res.status(201).json(newOffer[0]);

        case 'PUT':
            const { id, status: upStatus } = req.body;
            console.log(`Toggle Offer: ${id} -> ${upStatus}`);
            const { rows: updated } = await db`
                UPDATE offers SET status = ${upStatus} WHERE id = ${id} RETURNING *
            `;
            return res.status(200).json(updated[0]);

        case 'DELETE':
            const { id: delId } = req.query;
            console.log(`Delet Offer ID: ${delId}`);
            await db`DELETE FROM offers WHERE id = ${delId}`;
            return res.status(200).json({ success: true });

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
    }
}

export default withJson(handler);
