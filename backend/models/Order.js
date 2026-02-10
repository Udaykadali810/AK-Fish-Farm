const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zip: String
    },
    paymentMethod: { type: String, enum: ['COD', 'UPI'], default: 'COD' },
    status: {
        type: String,
        enum: ['Ordered', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Ordered'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
