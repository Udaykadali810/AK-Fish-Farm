const { Order } = require('../db');

exports.createOrder = async (req, res) => {
    try {
        const { customerName, place, phone, items, total } = req.body;

        // Generate Order ID: AKF-XXXXX
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const orderId = `AKF-${randomNum}`;

        const newOrder = await Order.create({
            orderId,
            customerName,
            place,
            phone,
            items,
            total,
            status: 'Processing'
        });

        // Map for frontend which expects 'id' to be the orderId in some contexts, 
        // but here we return the whole object. 
        // The frontend Checkout.jsx expects data.id to be the order serial number or string.
        // Let's return the orderId as id to keep it simple.

        const responseData = {
            ...newOrder.toJSON(),
            id: orderId, // Legacy shim
            date: newOrder.createdAt // Legacy shim
        };

        res.status(201).json(responseData);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const responseData = {
            ...order.toJSON(),
            id: order.orderId,
            date: order.createdAt
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        const mappedOrders = orders.map(o => ({
            ...o.toJSON(),
            id: o.orderId,
            date: o.createdAt
        }));
        res.json(mappedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, deliveryNotes } = req.body;

        const order = await Order.findOne({ where: { orderId } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (status) order.status = status;
        if (deliveryNotes !== undefined) order.deliveryNotes = deliveryNotes;

        await order.save();

        res.json({ message: 'Order updated', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        await Order.destroy({ where: { orderId } });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
