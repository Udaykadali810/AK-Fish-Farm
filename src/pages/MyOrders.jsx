import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, XCircle, ShoppingBag, Eye, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const savedOrderIds = JSON.parse(localStorage.getItem('akf_user_orders') || '[]');

            if (savedOrderIds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const baseUrl = import.meta.env.VITE_API_URL || '';
                const orderPromises = savedOrderIds.map(id =>
                    fetch(`${baseUrl}/api/orders/track/${id}`).then(res => res.ok ? res.json() : null)
                );

                const results = await Promise.all(orderPromises);
                const validOrders = results.filter(order => order !== null);

                // Sort by date descending
                validOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setOrders(validOrders);
            } catch (error) {
                console.error("Failed to load orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const statusMap = {
        'Processing': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600', icon: <Clock className="w-4 h-4" /> },
        'Packing': { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600', icon: <Box className="w-4 h-4" /> },
        'Shipped': { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600', icon: <Truck className="w-4 h-4" /> },
        'Delivered': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600', icon: <CheckCircle2 className="w-4 h-4" /> },
        'Cancelled': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600', icon: <XCircle className="w-4 h-4" /> }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-main flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-bg-main min-h-screen pb-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-dark dark:text-white italic mb-2">My <span className="text-primary italic">Orders</span></h1>
                        <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Track your aquatic acquisitions</p>
                    </div>
                </header>

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-gray-100 dark:border-gray-800 shadow-xl">
                        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-dark dark:text-white mb-4 italic">No orders found</h2>
                        <p className="text-gray-500 mb-10 font-medium">You haven't placed any orders with AK Fish Farms yet.</p>
                        <Link to="/shop" className="px-12 py-5 bg-primary text-white rounded-[2rem] font-black text-xl shadow-xl hover:scale-105 transition-transform inline-block">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order.orderId || order.id}
                                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                                        {/* Order Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${statusMap[order.status]?.bg || 'bg-gray-100'} ${statusMap[order.status]?.text || 'text-gray-600'} border-transparent`}>
                                                    {statusMap[order.status]?.icon}
                                                    {order.status}
                                                </span>
                                                <span className="text-gray-400 text-xs font-bold">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                                            </div>

                                            <h3 className="text-xl font-black text-dark dark:text-white italic mb-2">
                                                Order #{order.orderId || order.id}
                                            </h3>

                                            <div className="space-y-1 mb-6">
                                                {order.items && order.items.map((item, i) => (
                                                    <p key={i} className="text-sm font-bold text-gray-500">
                                                        {item.name} <span className="text-primary">x{item.quantity}</span>
                                                    </p>
                                                ))}
                                            </div>

                                            <div className="flex items-baseline gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                                                <span className="text-2xl font-black text-primary">₹{order.total}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-row md:flex-col gap-3 justify-center md:items-end border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-6 md:pt-0 md:pl-8 mt-4 md:mt-0">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 text-dark dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" /> Details
                                            </button>
                                            <Link
                                                to="/track-order"
                                                state={{ orderId: order.orderId || order.id }}
                                                className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-105 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Truck className="w-4 h-4" /> Track Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-dark/60 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black italic text-dark dark:text-white">Order Details</h2>
                                        <p className="text-primary font-bold">#{selectedOrder.orderId || selectedOrder.id}</p>
                                    </div>
                                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all">
                                        <XCircle className="w-8 h-8 text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-6">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Items</h4>
                                        <div className="space-y-4">
                                            {selectedOrder.items.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Package className="w-6 h-6 text-gray-300" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-dark dark:text-white">{item.name}</p>
                                                            <p className="text-[10px] font-black text-primary">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-black text-dark dark:text-white">₹{(item.offerPrice || item.price) * item.quantity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Delivery Address</h4>
                                            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 space-y-1 bg-gray-50 dark:bg-white/5 p-6 rounded-3xl">
                                                <p className="font-black text-dark dark:text-white mb-2 text-lg">{selectedOrder.customerName}</p>
                                                <p className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> {selectedOrder.place}</p>
                                                <p className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"></div> {selectedOrder.phone}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Payment Summary</h4>
                                            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 font-bold">Subtotal</span>
                                                    <span className="font-bold">₹{selectedOrder.total + (selectedOrder.discount || 0)}</span>
                                                </div>
                                                {selectedOrder.discount > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-green-500 font-bold">Discount</span>
                                                        <span className="text-green-500 font-bold">-₹{selectedOrder.discount}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                                    <span className="font-black text-dark dark:text-white">Total</span>
                                                    <span className="font-black text-primary text-xl">₹{selectedOrder.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyOrders;
