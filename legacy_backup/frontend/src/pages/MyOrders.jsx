import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, XCircle, ShoppingBag, Eye, Box, MapPin, Phone } from 'lucide-react';
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
        'Processing': { bg: 'bg-[#0B2A4A]/40', text: 'text-blue-400', icon: <Clock className="w-4 h-4" /> },
        'Packing': { bg: 'bg-[#0B2A4A]/40', text: 'text-purple-400', icon: <Box className="w-4 h-4" /> },
        'Shipped': { bg: 'bg-[#0B2A4A]/40', text: 'text-orange-400', icon: <Truck className="w-4 h-4" /> },
        'Delivered': { bg: 'bg-[#0B2A4A]/40', text: 'text-green-400', icon: <CheckCircle2 className="w-4 h-4" /> },
        'Cancelled': { bg: 'bg-[#0B2A4A]/40', text: 'text-red-400', icon: <XCircle className="w-4 h-4" /> }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#071A2F] flex items-center justify-center">
                <div className="flex flex-col items-center gap-8">
                    <div className="w-20 h-20 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(0,229,255,0.2)]"></div>
                    <span className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Logbook...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#071A2F] min-h-screen pb-32 pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <header className="flex flex-col justify-between items-start gap-4 mb-20">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-[#BFEFFF] italic mb-6 leading-[0.8] tracking-tighter uppercase">Quest <span className="text-[#00E5FF] glow-text">Logs</span></h1>
                        <p className="text-[#BFEFFF]/30 font-black tracking-[0.4em] uppercase text-[10px]">Tracking your elite aquatic acquisitions</p>
                    </motion.div>
                </header>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-[4rem] p-24 text-center border border-[#00E5FF]/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#0B2A4A]/40 to-transparent"
                    >
                        <ShoppingBag className="w-32 h-32 text-[#00E5FF]/20 mx-auto mb-10 animate-pulse" />
                        <h2 className="text-4xl font-black text-[#BFEFFF] mb-6 italic uppercase tracking-tighter">No History <span className="text-[#00E5FF]">Found</span></h2>
                        <p className="text-[#BFEFFF]/40 mb-12 font-medium uppercase text-xs tracking-widest leading-relaxed">You haven't initiated any acquisition protocols with AK Fish Farms yet.</p>
                        <Link to="/shop" className="px-16 h-20 btn-premium inline-flex items-center justify-center text-xs">Access Inventory</Link>
                    </motion.div>
                ) : (
                    <div className="space-y-10">
                        {orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order.orderId || order.id}
                                className="glass-card rounded-[3.5rem] border border-[#00E5FF]/10 hover:border-[#00E5FF]/40 transition-all duration-500 overflow-hidden group bg-[#071A2F]/60 shadow-2xl"
                            >
                                <div className="p-10 lg:p-12 relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/5 blur-[100px] pointer-events-none group-hover:bg-[#00E5FF]/10 transition-colors" />
                                    <div className="flex flex-col md:flex-row gap-12 justify-between relative z-10">
                                        {/* Order Info */}
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-6 mb-8">
                                                <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border ${statusMap[order.status]?.bg || 'bg-[#0B2A4A]'} ${statusMap[order.status]?.text || 'text-[#BFEFFF]'} border-[#00E5FF]/20 backdrop-blur-3xl shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                                                    <span className="scale-110">{statusMap[order.status]?.icon}</span>
                                                    {order.status}
                                                </span>
                                                <span className="text-[#BFEFFF]/20 text-[10px] font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                                            </div>

                                            <h3 className="text-3xl lg:text-4xl font-black text-[#BFEFFF] italic mb-6 tracking-tighter uppercase leading-none">
                                                Protocol <span className="text-[#00E5FF]">#{order.orderId || order.id}</span>
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                                {order.items && order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4 bg-[#0B2A4A]/30 p-4 rounded-2xl border border-[#00E5FF]/5">
                                                        <div className="w-10 h-10 rounded-xl bg-[#071A2F] border border-[#00E5FF]/10 flex items-center justify-center overflow-hidden">
                                                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Box className="w-5 h-5 text-[#00E5FF]/40" />}
                                                        </div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#BFEFFF]/60">
                                                            {item.name} <span className="text-[#00E5FF] ml-2">x{item.quantity}</span>
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-[#BFEFFF]/20 uppercase tracking-[0.4em] mb-1">Final Settlement</span>
                                                    <span className="text-4xl font-black text-[#00E5FF] italic glow-text tracking-tighter">₹{order.total}</span>
                                                </div>
                                                <div className="h-10 w-px bg-[#00E5FF]/10 mx-2"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-[#BFEFFF]/20 uppercase tracking-[0.4em] mb-1">Unit Count</span>
                                                    <span className="text-xl font-black text-[#BFEFFF]">{order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0} Species</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row md:flex-col gap-5 justify-center md:items-end md:pl-12 border-t md:border-t-0 md:border-l border-[#00E5FF]/10 pt-10 md:pt-0">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="flex-1 md:flex-none px-10 h-16 rounded-2xl bg-[#0B2A4A]/60 border border-[#00E5FF]/10 text-[#BFEFFF] font-black text-[10px] uppercase tracking-widest hover:border-[#00E5FF] transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
                                            >
                                                <Eye className="w-5 h-5" /> Analytics
                                            </button>
                                            <Link
                                                to="/track-order"
                                                state={{ orderId: order.orderId || order.id }}
                                                className="flex-1 md:flex-none px-10 h-16 btn-premium flex items-center justify-center gap-4 text-[10px] shadow-[0_15px_40px_rgba(0,229,255,0.2)]"
                                            >
                                                <Truck className="w-5 h-5" /> Live Tracking
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
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 lg:p-10">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-[#071A2F]/90 backdrop-blur-2xl" />
                        <motion.div
                            initial={{ scale: 0.95, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 50, opacity: 0 }}
                            className="relative bg-[#071A2F] w-full max-w-4xl rounded-[4rem] border border-[#00E5FF]/20 shadow-[0_50px_150px_rgba(0,0,0,0.9)] overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-10 lg:p-16 overflow-y-auto scrollbar-hide">
                                <div className="flex justify-between items-start mb-16">
                                    <div>
                                        <span className="text-[#00E5FF] text-[9px] font-black uppercase tracking-[0.5em] mb-4 block">Manifest Analysis</span>
                                        <h2 className="text-4xl lg:text-6xl font-black italic text-[#BFEFFF] uppercase tracking-tighter leading-none">Protocol <span className="text-[#00E5FF]">Details</span></h2>
                                        <p className="text-[#00E5FF]/40 font-black mt-4 tracking-widest text-xs">#{selectedOrder.orderId || selectedOrder.id}</p>
                                    </div>
                                    <button onClick={() => setSelectedOrder(null)} className="p-5 bg-[#0B2A4A] border border-[#00E5FF]/20 rounded-3xl hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all transform hover:rotate-90">
                                        <XCircle className="w-10 h-10" />
                                    </button>
                                </div>

                                <div className="space-y-12">
                                    <div className="bg-[#0B2A4A]/20 rounded-[3rem] p-10 border border-[#00E5FF]/10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 blur-[60px]" />
                                        <h4 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><ShoppingBag className="w-4 h-4" /> Species Breakdown</h4>
                                        <div className="space-y-6">
                                            {selectedOrder.items.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center group/item">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-[#071A2F] flex items-center justify-center overflow-hidden border border-[#00E5FF]/10 group-hover/item:border-[#00E5FF]/40 transition-colors">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Package className="w-8 h-8 text-[#00E5FF]/20" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-lg text-[#BFEFFF] uppercase tracking-tight italic">{item.name}</p>
                                                            <p className="text-[10px] font-black text-[#00E5FF]/50 uppercase tracking-widest">Protocol Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-black text-2xl text-[#BFEFFF] italic tracking-tighter">₹{(item.offerPrice || item.price) * item.quantity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-[#00E5FF]/40 uppercase tracking-[0.4em] ml-6">Logistics Coordinates</h4>
                                            <div className="bg-[#0B2A4A]/40 p-10 rounded-[3rem] border border-[#00E5FF]/10 h-full">
                                                <p className="font-black text-3xl text-[#BFEFFF] mb-6 italic uppercase tracking-tighter">{selectedOrder.customerName}</p>
                                                <div className="space-y-4 text-[11px] font-black text-[#BFEFFF]/40 uppercase tracking-widest">
                                                    <p className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#00E5FF]" /> {selectedOrder.place}</p>
                                                    <p className="flex items-center gap-2"><div className="w-1 h-1 bg-[#00E5FF] rounded-full"></div> {selectedOrder.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-[#00E5FF]/40 uppercase tracking-[0.4em] ml-6">Financial Manifest</h4>
                                            <div className="bg-[#0B2A4A]/80 p-10 rounded-[3rem] border border-[#00E5FF]/20 space-y-6 shadow-2xl relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-transparent" />
                                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[#BFEFFF]/40 relative z-10">
                                                    <span>Gross Total</span>
                                                    <span>₹{selectedOrder.total + (selectedOrder.discount || 0)}</span>
                                                </div>
                                                {selectedOrder.discount > 0 && (
                                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-green-400 relative z-10">
                                                        <span>Protocol Savings</span>
                                                        <span>-₹{selectedOrder.discount}</span>
                                                    </div>
                                                )}
                                                <div className="pt-6 border-t border-[#00E5FF]/10 flex justify-between items-end relative z-10">
                                                    <span className="font-black text-[#BFEFFF] uppercase tracking-[0.2em] text-[10px]">Net Settlement</span>
                                                    <span className="font-black text-[#00E5FF] text-5xl italic glow-text tracking-tighter leading-none">₹{selectedOrder.total}</span>
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
