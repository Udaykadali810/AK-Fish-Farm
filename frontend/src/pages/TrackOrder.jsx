import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, Copy, Check, Box, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';

const TrackOrder = () => {
    const location = useLocation();
    const [orderIdInput, setOrderIdInput] = useState(location.state?.orderId || '');
    const [trackingResult, setTrackingResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const pollInterval = useRef(null);

    const handleTrack = async (id = orderIdInput) => {
        if (!id) return;
        if (!trackingResult) setLoading(true);

        try {
            const res = await fetch(`http://localhost:5000/api/admin/orders/track/${id.trim()}`);
            const data = await res.json();
            if (res.ok) {
                setTrackingResult(data);
            } else {
                setTrackingResult({ error: data.message || 'Order not found.' });
            }
        } catch (err) {
            setTrackingResult({ error: 'Connection failed.' });
        } finally {
            setLoading(false);
        }
    };

    // Polling logic for real-time updates
    useEffect(() => {
        if (orderIdInput) {
            handleTrack();
            pollInterval.current = setInterval(() => handleTrack(), 5000);
        }
        return () => clearInterval(pollInterval.current);
    }, [orderIdInput]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(orderIdInput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statusStages = [
        { id: 'Processing', label: 'Order Placed', icon: Clock },
        { id: 'Packing', label: 'Packing', icon: Box },
        { id: 'Shipped', label: 'Shipped', icon: Package },
        { id: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
        { id: 'Delivered', label: 'Delivered', icon: CheckCircle2 }
    ];

    const currentStatus = trackingResult?.status || 'Processing';
    const activeIndex = statusStages.findIndex(s => s.id === currentStatus);

    // Animation Components
    const AnimationZone = ({ status }) => {
        switch (status) {
            case 'Processing':
                return (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-48 h-48 flex items-center justify-center"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl"
                        />
                        <CheckCircle2 className="w-32 h-32 text-green-500 relative z-10" />
                    </motion.div>
                );
            case 'Packing':
                return (
                    <motion.div
                        animate={{ rotateY: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="w-48 h-48 flex items-center justify-center"
                    >
                        <Box className="w-32 h-32 text-primary" />
                    </motion.div>
                );
            case 'Shipped':
                return (
                    <div className="w-full max-w-md h-48 relative overflow-hidden flex items-center">
                        <motion.div
                            animate={{ x: [-100, 500] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        >
                            <Truck className="w-24 h-24 text-primary" />
                        </motion.div>
                    </div>
                );
            case 'Out for Delivery':
                return (
                    <div className="w-48 h-48 flex items-center justify-center relative">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                        >
                            <Truck className="w-32 h-32 text-primary" />
                            <div className="flex gap-2 mt-[-10px] ml-[-20px]">
                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-4 h-1 bg-primary rounded-full" />
                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-4 h-1 bg-primary rounded-full" />
                            </div>
                        </motion.div>
                    </div>
                );
            case 'Delivered':
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative w-48 h-48 flex items-center justify-center"
                    >
                        <motion.div
                            animate={{ y: [-100, 0], opacity: [0, 1] }}
                            className="absolute top-0 text-3xl"
                        >
                            🎉✨🎊
                        </motion.div>
                        <div className="bg-green-500 text-dark p-6 rounded-full shadow-2xl shadow-green-500/40">
                            <CheckCircle2 className="w-20 h-20" />
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-24 min-h-screen">
            {/* Header Sec */}
            <div className="text-center mb-16">
                <h1 className="text-5xl lg:text-8xl font-black text-white italic mb-6 tracking-tighter uppercase">
                    Track <span className="text-primary italic">Live</span>
                </h1>
                <div className="max-w-2xl mx-auto relative group">
                    <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className="relative">
                        <input
                            type="text"
                            value={orderIdInput}
                            onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
                            placeholder="ENTER ORDER ID (AKF-XXXXX)"
                            className="w-full py-7 px-12 rounded-[2.5rem] bg-white/5 border border-white/10 text-white font-black italic text-2xl focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/10 transition-all placeholder:text-white/10 uppercase tracking-widest"
                        />
                        <button type="submit" className="absolute right-4 top-4 bottom-4 px-10 bg-primary text-dark rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                            <Search className="w-5 h-5" /> Track
                        </button>
                    </form>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {trackingResult && !trackingResult.error ? (
                    <motion.div
                        key={trackingResult.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        {/* 3D Visualizer Card */}
                        <div className="glass-card p-12 lg:p-20 rounded-[4rem] border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden flex flex-col items-center">
                            <div className="absolute top-10 left-10">
                                <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.5em] block mb-2">Live Animation</span>
                                <div className="h-1 w-20 bg-primary rounded-full" />
                            </div>

                            <div className="mb-10 text-center">
                                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest inline-block mb-8 ${currentStatus === 'Delivered' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-primary/20 text-primary border-primary/30 animate-pulse'}`}>
                                    {statusStages[activeIndex]?.label || currentStatus}
                                </span>
                                <div className="h-64 flex items-center justify-center">
                                    <AnimationZone status={currentStatus} />
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="w-full max-w-4xl relative pt-12 mt-12">
                                <div className="absolute top-[4.2rem] left-0 right-0 h-1.5 bg-white/5 rounded-full" />
                                <div
                                    className="absolute top-[4.2rem] left-0 h-1.5 bg-primary rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(0,180,216,0.6)]"
                                    style={{ width: `${(activeIndex / (statusStages.length - 1)) * 100}%` }}
                                />

                                <div className="grid grid-cols-5 gap-4 relative z-10">
                                    {statusStages.map((stage, idx) => {
                                        const Icon = stage.icon;
                                        const isPast = idx < activeIndex;
                                        const isActive = idx === activeIndex;
                                        return (
                                            <div key={idx} className="flex flex-col items-center group">
                                                <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center border-2 transition-all duration-700 ${isActive ? 'bg-primary text-dark border-primary scale-110 shadow-2xl shadow-primary/40' : isPast ? 'bg-primary/20 text-primary border-primary/40' : 'bg-dark/40 text-white/10 border-white/5'}`}>
                                                    <Icon className={`w-6 h-6 lg:w-8 lg:h-8 ${isActive ? 'animate-bounce' : ''}`} />
                                                </div>
                                                <span className={`mt-6 text-[8px] lg:text-[10px] font-black uppercase tracking-tighter text-center ${isActive ? 'text-white' : 'text-white/20'}`}>
                                                    {stage.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Detailed Info Card */}
                            <div className="lg:col-span-2 glass-card p-12 rounded-[3.5rem] border border-white/10 bg-white/5">
                                <div className="flex justify-between items-start mb-12 border-b border-white/5 pb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Tracking Identity</p>
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-4xl lg:text-6xl font-black text-white italic">{orderIdInput}</h2>
                                            <button onClick={copyToClipboard} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-text-main" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Amount</p>
                                        <h2 className="text-4xl font-black text-primary italic">₹{trackingResult.total}</h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Customer Details</label>
                                            <p className="text-xl font-black text-white italic flex items-center gap-3"><ShoppingBag className="w-5 h-5 text-primary" /> {trackingResult.customerName}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Delivery Location</label>
                                            <p className="text-xl font-black text-white italic flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /> {trackingResult.place}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Items Ordered</label>
                                        <div className="space-y-3">
                                            {trackingResult.items?.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center text-sm font-bold bg-white/5 p-4 rounded-2xl border border-white/5">
                                                    <span className="text-white italic">{item.name} <span className="text-xs text-primary ml-2">x{item.quantity}</span></span>
                                                    <span className="text-gray-400">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {trackingResult.deliveryNotes && (
                                    <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] relative overflow-hidden group">
                                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform"><Truck className="w-32 h-32 text-primary" /></div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                                            <AlertCircle className="w-4 h-4" /> Message from AK Support Team
                                        </p>
                                        <p className="text-white font-bold italic lg:text-xl relative z-10 leading-relaxed">"{trackingResult.deliveryNotes}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Action/Status Summary */}
                            <div className="glass-card p-12 rounded-[3.5rem] border border-white/10 bg-primary/5 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest block mb-1">Status Summary</span>
                                    <h3 className="text-3xl font-black text-white italic mb-10 leading-tight">Your order is currently in <span className="text-primary underline ">{currentStatus}</span> phase.</h3>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                            <p className="text-xs text-gray-400 font-bold leading-relaxed">Our team is working diligently to ensure your aquatic pets arrive safely and in perfect condition.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                            <p className="text-xs text-gray-400 font-bold leading-relaxed">Status updates are pushed in real-time. Keep this page open for live tracking.</p>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/my-orders" className="w-full py-5 glass-card rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 mt-12 border border-white/10">
                                    <ArrowRight className="w-4 h-4 rotate-180" /> My All Orders
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ) : trackingResult?.error ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-20 rounded-[4rem] border border-red-500/20 text-center max-w-2xl mx-auto shadow-2xl">
                        <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-8" />
                        <h2 className="text-4xl font-black text-white italic mb-4">No Trace Found</h2>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed mb-10">We couldn't locate any order with ID <span className="text-white font-black">{orderIdInput}</span>. Please double-check your tracking key.</p>
                        <button onClick={() => setTrackingResult(null)} className="px-12 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-black uppercase text-xs tracking-widest hover:bg-white/10">Retry Search</button>
                    </motion.div>
                ) : (
                    <div className="text-center py-40">
                        <Package className="w-32 h-32 text-white/5 mx-auto mb-10 animate-pulse" />
                        <h2 className="text-2xl font-black text-gray-600 italic uppercase">Awaiting Your Tracking ID</h2>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrackOrder;
