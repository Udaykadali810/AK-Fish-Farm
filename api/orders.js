import { db, initDb, withJson } from './lib/db';

async function handler(req, res) {
    const { method } = req;
    await initDb();

    switch (method) {
        case 'GET':
            const { id } = req.query;
            if (id) {
                console.log(`🔍 Tracking Order: ${id}`);
                const { rows } = await db`SELECT * FROM orders WHERE id = ${id}`;
                if (rows.length === 0) return res.status(404).json({ success: false, error: 'Order not found' });
                return res.status(200).json({
                    ...rows[0],
                    customerName: rows[0].customer_name,
                    items: rows[0].items_json,
                    timestamp: rows[0].created_at
                });
            }
            console.log('📋 Fetching All Orders...');
            const { rows: orders } = await db`SELECT * FROM orders ORDER BY created_at DESC`;
            return res.status(200).json(orders.map(o => ({
                ...o,
                customerName: o.customer_name,
                items: o.items_json,
                timestamp: o.created_at
            })));

        case 'POST':
            const {
                id: orderId, customerName, phone, city, items, total, status, coupon, note
            } = req.body;

            const finalId = orderId || `AKF-${Date.now().toString(36).toUpperCase()}`;
            console.log(`🛒 New Order Received: ${finalId}`);

            const itemsJson = JSON.stringify(items || []);

            const { rows: newOrder } = await db`
                INSERT INTO orders (id, customer_name, phone, city, items_json, total, status, coupon, note)
                VALUES (${finalId}, ${customerName}, ${phone}, ${city}, ${itemsJson}, ${total}, ${status || 'New'}, ${coupon}, ${note})
                RETURNING *
            `;

            return res.status(201).json({
                success: true,
                ...newOrder[0],
                customerName: newOrder[0].customer_name,
                items: newOrder[0].items_json,
                timestamp: newOrder[0].created_at
            });

        case 'PUT':
            const { id: upId, status: upStatus } = req.body;
            console.log(`🏷️ Updating Order Status: ${upId} -> ${upStatus}`);
            const { rows: updated } = await db`
                UPDATE orders SET status = ${upStatus} WHERE id = ${upId} RETURNING *
            `;
            return res.status(200).json({ success: true, order: updated[0] });

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT']);
            return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
    }
}

export default withJson(handler);
