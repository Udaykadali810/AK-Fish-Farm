import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, ArrowRight, ShoppingBag, Tag } from 'lucide-react';

const Checkout = () => {
    const location = useLocation();
    const discount = location.state?.discount || null;
    const { cart, getCartTotal, clearCart } = useCart();
    const [formData, setFormData] = useState({
        customerName: '',
        place: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (cart.length === 0) {
        navigate('/shop');
        return null;
    }

    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    const subtotal = getCartTotal();
    const finalTotal = discount ? Math.max(0, subtotal - discount.value) : subtotal;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.customerName || !formData.place || !formData.phone) {
            setError('All fields are required.');
            return;
        }

        if (!validatePhone(formData.phone)) {
            setError('Phone number must be exactly 10 digits.');
            return;
        }

        setLoading(true);

        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${baseUrl}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: cart,
                    total: finalTotal,
                    appliedCoupon: discount?.code || null
                })
            });

            const data = await res.json();
            if (res.ok) {
                // Save to local order history
                const existingHistory = JSON.parse(localStorage.getItem('akf_user_orders') || '[]');
                localStorage.setItem('akf_user_orders', JSON.stringify([data.id, ...existingHistory]));

                // WhatsApp Notification Formatting
                const shopNumber = "919492045766";
                const itemsList = cart.map(item => `   - ${item.name} (x${item.quantity}) – ₹${item.price * item.quantity}`).join('\n');

                const message = `🐟 *NEW ORDER RECEIVED – AK FISH FARMS*\n\n` +
                    `*Order ID:* ${data.id}\n` +
                    `*Date:* ${new Date().toLocaleString('en-IN')}\n\n` +
                    `*Customer Details:*\n` +
                    `Name: ${formData.customerName}\n` +
                    `Place: ${formData.place}\n` +
                    `Phone: ${formData.phone}\n\n` +
                    `*Items Ordered:*\n${itemsList}\n\n` +
                    (discount ? `*Applied Coupon:* ${discount.code} (-₹${discount.value})\n` : '') +
                    `*Total Amount:* ₹${finalTotal}\n\n` +
                    `*Status:* Processing\n\n` +
                    `_Sent via AK Fish Farms Web Interface_`;

                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${shopNumber}?text=${encodedMessage}`;

                // Open WhatsApp in new tab
                window.open(whatsappUrl, '_blank');

                // Small delay to ensure tab opens before navigation
                setTimeout(() => {
                    clearCart();
                    navigate('/order-confirmation', { state: { order: data } });
                }, 1000);
            } else {
                setError(data.message || 'Order placement failed');
            }
        } catch (err) {
            setError('Connection failed. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl lg:text-7xl font-black text-white italic mb-4">Final <span className="text-primary italic">Step</span></h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Secure your aquatic life delivery</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-10 rounded-[3rem] border border-white/10 shadow-2xl"
                    >
                        <h2 className="text-2xl font-black text-white italic mb-8 flex items-center gap-3">
                            <ShoppingBag className="text-primary w-6 h-6" /> Delivery Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl text-xs font-bold text-center border border-red-500/20 italic">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 text-white font-bold transition-all"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                    <User className="absolute left-5 top-4 text-gray-400 group-focus-within:text-primary h-6 w-6" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Place (City/Town/Village)</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Where should we deliver?"
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 text-white font-bold transition-all"
                                        value={formData.place}
                                        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                                    />
                                    <MapPin className="absolute left-5 top-4 text-gray-400 group-focus-within:text-primary h-6 w-6" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Phone Number</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="tel"
                                        placeholder="10 digit mobile number"
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 text-white font-bold transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    />
                                    <Phone className="absolute left-5 top-4 text-gray-400 group-focus-within:text-primary h-6 w-6" />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-6 bg-primary text-dark rounded-3xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4"
                            >
                                {loading ? 'Processing...' : <>Place Order <ArrowRight className="w-6 h-6" /></>}
                            </button>
                        </form>
                    </motion.div>

                    {/* Summary Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="glass-card p-10 rounded-[3rem] border border-white/10">
                            <h3 className="text-xl font-black text-white italic mb-6 uppercase tracking-widest">Order Summary</h3>
                            <div className="space-y-4 mb-8">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-bold">{item.name} × {item.quantity}</span>
                                        <span className="text-white font-black">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}

                                {discount && (
                                    <div className="flex justify-between text-sm py-2 border-t border-white/5 mt-4">
                                        <span className="text-green-500 font-bold flex items-center gap-2"><Tag className="w-3 h-3" /> Coupon: {discount.code}</span>
                                        <span className="text-green-500 font-black">-₹{discount.value}</span>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                                <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Grand Total</span>
                                <span className="text-4xl font-black text-primary italic">₹{finalTotal}</span>
                            </div>
                        </div>

                        <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/20">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Notice</p>
                            <p className="text-gray-400 text-xs font-medium leading-relaxed">
                                No payment required online. We will contact you on WhatsApp/Phone for payment confirmation and shipping updates.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
