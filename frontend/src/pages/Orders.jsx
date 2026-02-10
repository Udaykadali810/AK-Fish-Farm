import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowRight, ExternalLink, ShoppingBag, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('ak_orders') || '[]');
        setOrders(saved);
        if (saved.length === 0) {
            // Seed a mock order if list is empty
            const mock = [{
                id: 'AK827491',
                date: new Date(Date.now() - 86400000).toISOString(),
                items: [
                    { id: 1, name: "Red Cap Oranda Goldfish", quantity: 2, price: 450, offerPrice: 399, image: "https://images.unsplash.com/photo-1544280597-906f363c467d?q=80&w=800&auto=format&fit=crop" }
                ],
                total: 848,
                status: 'Shipped',
                address: { name: 'Rahul S.', city: 'Hyderabad', phone: '9492045766' }
            }];
            setOrders(mock);
            localStorage.setItem('ak_orders', JSON.stringify(mock));
        }
    }, []);

    const statusMap = {
        'Ordered': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600', icon: <Clock className="w-5 h-5" /> },
        'Shipped': { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600', icon: <Truck className="w-5 h-5" /> },
        'Delivered': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600', icon: <CheckCircle2 className="w-5 h-5" /> },
        'Cancelled': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600', icon: <XCircle className="w-5 h-5" /> }
    };

    return (
        <div className="bg-bg-main min-h-screen pb-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <header className="flex justify-between items-end mb-16">
                    <div>
                        <h1 className="text-4xl lg:text-7xl font-black text-dark dark:text-white italic mb-4">My <span className="text-primary italic">Journey</span></h1>
                        <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Track your aquatic acquisitions</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-3xl text-primary md:block hidden">
                        <Package className="w-12 h-12" />
                    </div>
                </header>

                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-gray-100 dark:border-gray-800 shadow-xl">
                        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-dark dark:text-white mb-4 italic">No life added yet</h2>
                        <p className="text-gray-500 mb-10 font-medium">You haven't placed any orders with AK Fish Farms yet.</p>
                        <Link to="/shop" className="px-12 py-5 bg-primary text-white rounded-[2rem] font-black text-xl shadow-xl">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order.id}
                                className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                            >
                                <div className="p-8 sm:p-10 flex flex-wrap justify-between items-center gap-8 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                                    <div className="flex gap-10">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Order ID</p>
                                            <p className="text-lg font-black text-dark dark:text-white italic">#{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Date</p>
                                            <p className="text-lg font-black text-dark dark:text-white">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total</p>
                                            <p className="text-lg font-black text-primary">₹{order.total}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest ${statusMap[order.status]?.bg} ${statusMap[order.status]?.text}`}>
                                        {statusMap[order.status]?.icon}
                                        {order.status}
                                    </div>
                                </div>

                                <div className="p-10">
                                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                                        <div className="flex -space-x-4 overflow-hidden">
                                            {order.items.slice(0, 3).map((item, i) => (
                                                <div key={i} className="w-16 h-16 rounded-2xl border-4 border-white dark:border-slate-900 overflow-hidden bg-gray-100 shadow-xl">
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-16 h-16 rounded-2xl border-4 border-white dark:border-slate-900 bg-accent flex items-center justify-center text-secondary font-black text-xs">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-4 w-full md:w-auto">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="flex-grow md:flex-none px-8 py-4 bg-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-all"
                                            >
                                                Details <Eye className="w-4 h-4" />
                                            </button>
                                            <Link to={`/track-order?id=${order.id}`} className="flex-grow md:flex-none px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                                Track <ExternalLink className="w-4 h-4" />
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
                            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3.5rem] shadow-4xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="p-10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h2 className="text-3xl font-black italic text-dark dark:text-white">Order <span className="text-primary mt-1">#{(selectedOrder.id).toUpperCase()}</span></h2>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"><XCircle className="w-8 h-8 text-gray-400" /></button>
                            </div>
                            <div className="p-10 space-y-10">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items Purchased</h4>
                                    {selectedOrder.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{item.name}</p>
                                                    <p className="text-[10px] font-black text-primary uppercase">Quantity: {item.quantity} × ₹{item.offerPrice || item.price}</p>
                                                </div>
                                            </div>
                                            <p className="font-black text-dark dark:text-white">₹{(item.offerPrice || item.price) * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Delivery To</h4>
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 space-y-1">
                                            <p className="font-black text-dark dark:text-white">{selectedOrder.address.name}</p>
                                            <p>{selectedOrder.address.street}</p>
                                            <p>{selectedOrder.address.city}, {selectedOrder.address.zip}</p>
                                            <p>Phone: {selectedOrder.address.phone}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Summary</h4>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-gray-400">Subtotal: <span className="text-dark dark:text-white">₹{selectedOrder.total}</span></p>
                                            <p className="text-sm font-bold text-gray-400">Coupon: <span className="text-green-500">-{selectedOrder.discount || 0}</span></p>
                                            <p className="text-2xl font-black text-primary italic mt-4">Total: ₹{selectedOrder.total}</p>
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

export default Orders;
