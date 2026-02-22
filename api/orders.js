import { getOrders, saveOrder, saveOrders } from './lib/storage';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        try {
            const orderData = {
                ...req.body,
                id: `AKF-${Date.now().toString(36).toUpperCase()}`,
                status: 'Pending',
                timestamp: new Date().toISOString()
            };

            if (saveOrder(orderData)) {
                res.status(201).json(orderData);
            } else {
                res.status(500).json({ error: 'Failed to record order' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (method === 'GET') {
        try {
            const { id } = req.query;
            const orders = getOrders();
            if (id) {
                const order = orders.find(o => o.id === id);
                if (order) res.status(200).json(order);
                else res.status(404).json({ error: 'Order not found' });
            } else {
                res.status(200).json(orders);
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    } else if (method === 'PUT') {
        try {
            const { id, status } = req.body;
            const orders = getOrders();
            const index = orders.findIndex(o => o.id === id);
            if (index !== -1) {
                orders[index].status = status;
                saveOrders(orders);
                res.status(200).json(orders[index]);
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update order' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
