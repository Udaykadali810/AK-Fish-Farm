import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            const historyIds = JSON.parse(localStorage.getItem('akf_user_orders') || '[]');
            if (historyIds.length === 0) {
                setLoading(false);
                return;
            }

            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            try {
                const orderData = await Promise.all(
                    historyIds.map(async (id) => {
                        const res = await fetch(`${baseUrl}/orders/track/${id}`);
                        if (res.ok) {
                            const data = await res.json();
                            return data ? { ...data, id } : null;
                        }
                        return null;
                    })
                );
                setOrders(orderData.filter(o => o !== null));
            } catch (err) {
                console.error("Failed to fetch order history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <h1 className="text-4xl lg:text-5xl font-black text-white italic mb-12 uppercase tracking-tighter">
                My <span className="text-primary italic">Orders</span>
            </h1>

            {orders.length > 0 ? (
                <>
                    {/* Desktop View Table */}
                    <div className="hidden lg:block glass-card rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl bg-white/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Order Name</th>
                                        <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Price</th>
                                        <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-8">
                                                <p className="text-white font-bold text-sm italic group-hover:text-primary transition-colors">
                                                    {order.id} – {order.customerName}
                                                </p>
                                            </td>
                                            <td className="p-8 text-primary font-black italic text-lg">₹{order.total}</td>
                                            <td className="p-8 text-center">
                                                <button
                                                    onClick={() => navigate('/track-order', { state: { orderId: order.id } })}
                                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95 inline-flex items-center gap-2"
                                                >
                                                    Track Order <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile View Cards */}
                    <div className="lg:hidden space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="glass-card p-8 rounded-3xl border border-white/10 bg-white/5 text-left">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-primary font-black italic text-xl block mb-1">#{order.id}</span>
                                        <p className="text-white/60 font-bold text-xs uppercase tracking-widest">{order.customerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-400 text-[10px] font-black uppercase block mb-1">Price</span>
                                        <span className="text-white font-black italic">₹{order.total}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/track-order', { state: { orderId: order.id } })}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Track Live <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="glass-card py-24 rounded-[3rem] border border-white/10 bg-white/5">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white italic mb-4 uppercase">No Trace Found</h2>
                    <p className="text-gray-400 mb-10 max-w-xs mx-auto text-sm font-medium">You haven't placed any orders yet. Visit the shop to start your aquatic legend.</p>
                    <Link to="/shop" className="px-10 py-5 bg-primary text-dark rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all inline-block shadow-xl shadow-primary/20">
                        Explore Collection
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
