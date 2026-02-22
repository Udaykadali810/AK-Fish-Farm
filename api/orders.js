import { db, initDb } from './lib/db';

export default async function handler(req, res) {
    const { method } = req;

    try {
        await initDb();

        switch (method) {
            case 'GET':
                const { id } = req.query;
                if (id) {
                    const { rows } = await db`SELECT * FROM orders WHERE id = ${id}`;
                    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
                    return res.status(200).json({
                        ...rows[0],
                        customerName: rows[0].customer_name,
                        items: rows[0].items_json,
                        timestamp: rows[0].created_at
                    });
                }
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
                const itemsJson = JSON.stringify(items || []);

                const { rows: newOrder } = await db`
                    INSERT INTO orders (id, customer_name, phone, city, items_json, total, status, coupon, note)
                    VALUES (${finalId}, ${customerName}, ${phone}, ${city}, ${itemsJson}, ${total}, ${status || 'New'}, ${coupon}, ${note})
                    RETURNING *
                `;

                return res.status(201).json({
                    ...newOrder[0],
                    customerName: newOrder[0].customer_name,
                    items: newOrder[0].items_json,
                    timestamp: newOrder[0].created_at
                });

            case 'PUT':
                const { id: upId, status: upStatus } = req.body;
                const { rows: updated } = await db`
                    UPDATE orders SET status = ${upStatus} WHERE id = ${upId} RETURNING *
                `;
                return res.status(200).json(updated[0]);

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Orders API Error:', error);
        return res.status(500).json({ error: 'Database Connection Error' });
    }
}
