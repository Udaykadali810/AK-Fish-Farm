import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Eye, Filter, XCircle, Clock, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

const ManageOrders = () => {
    const [search, setSearch] = useState('');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Fetch orders from localStorage
    useEffect(() => {
        const fetchOrders = () => {
            const akf = JSON.parse(localStorage.getItem('akf_orders') || '[]');
            const ak = JSON.parse(localStorage.getItem('ak_orders') || '[]');

            // Merge and remove duplicates by ID
            const allOrders = [...akf, ...ak];
            const uniqueOrders = allOrders.filter((order, index, self) =>
                index === self.findIndex((t) => t.id === order.id)
            );

            // Sort by date (newest first)
            uniqueOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

            setOrders(uniqueOrders);
        };

        fetchOrders();
    }, []);

    // Filter logic
    useEffect(() => {
        let result = orders;

        if (statusFilter !== 'All') {
            result = result.filter(o => o.status === statusFilter);
        }

        if (search) {
            const query = search.toLowerCase();
            result = result.filter(o =>
                o.id.toLowerCase().includes(query) ||
                (o.customer && o.customer.toLowerCase().includes(query)) ||
                (o.address && o.address.name && o.address.name.toLowerCase().includes(query))
            );
        }

        setFilteredOrders(result);
    }, [search, statusFilter, orders]);

    const statusStyles = {
        'Ordered': 'bg-blue-50 text-blue-500 border-blue-100',
        'Shipped': 'bg-orange-50 text-orange-500 border-orange-100',
        'Delivered': 'bg-green-50 text-green-500 border-green-100',
        'Cancelled': 'bg-red-50 text-red-500 border-red-100',
        'Processing': 'bg-purple-50 text-purple-500 border-purple-100',
        'Out for Delivery': 'bg-indigo-50 text-indigo-500 border-indigo-100',
    };

    const handleStatusChange = (id, newStatus) => {
        const updatedOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
        setOrders(updatedOrders);

        // Persist to both keys for safety
        localStorage.setItem('akf_orders', JSON.stringify(updatedOrders));
        localStorage.setItem('ak_orders', JSON.stringify(updatedOrders));
    };

    const deleteOrder = (id) => {
        if (window.confirm('Are you sure you want to delete this order records?')) {
            const updatedOrders = orders.filter(o => o.id !== id);
            setOrders(updatedOrders);
            localStorage.setItem('akf_orders', JSON.stringify(updatedOrders));
            localStorage.setItem('ak_orders', JSON.stringify(updatedOrders));
        }
    };

    return (
        <div className="bg-bg-main min-h-screen p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16">
                    <h1 className="text-4xl font-black text-dark dark:text-white italic mb-2 flex items-center gap-4">
                        <Package className="text-secondary w-10 h-10" /> Order <span className="text-secondary mt-1">Manifest</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Managing live fish shipments</p>
                </header>

                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-6 relative">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search manifest by ID or name..."
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none font-bold"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Search className="absolute left-5 top-4.5 text-secondary w-5 h-5" />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                className={`px-8 py-4 ${statusFilter !== 'All' ? 'bg-secondary text-white' : 'bg-gray-50 dark:bg-slate-800'} rounded-2xl flex items-center gap-3 font-bold text-sm transition-all`}
                            >
                                <Filter className="w-5 h-5" /> {statusFilter === 'All' ? 'Filter Status' : statusFilter}
                            </button>

                            <AnimatePresence>
                                {showFilterMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
                                    >
                                        {['All', 'Ordered', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setStatusFilter(status);
                                                    setShowFilterMenu(false);
                                                }}
                                                className="w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 font-bold text-xs uppercase tracking-widest"
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase font-black tracking-widest text-gray-400">
                                    <th className="px-10 py-8">Order ID</th>
                                    <th className="px-10 py-8">Acquisitor</th>
                                    <th className="px-10 py-8">Date</th>
                                    <th className="px-10 py-8">Financials</th>
                                    <th className="px-10 py-8">Current State</th>
                                    <th className="px-10 py-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-800 font-medium">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-10 py-20 text-center text-gray-400 font-bold">
                                            No orders found in the manifest.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/30 dark:hover:bg-white/5 transition-all">
                                            <td className="px-10 py-6 font-black italic text-dark dark:text-white text-lg leading-tight">#{order.id}</td>
                                            <td className="px-10 py-6 font-bold">{order.address?.name || order.customer || 'Guest User'}</td>
                                            <td className="px-10 py-6 text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="px-10 py-6 font-black text-primary italic">₹{order.total}</td>
                                            <td className="px-10 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[order.status] || 'bg-gray-50 text-gray-500'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className="bg-transparent border-gray-200 dark:border-gray-700 rounded-lg text-[10px] font-black uppercase tracking-widest p-2 focus:ring-0 cursor-pointer"
                                                    >
                                                        <option>Ordered</option>
                                                        <option>Processing</option>
                                                        <option>Shipped</option>
                                                        <option>Out for Delivery</option>
                                                        <option>Delivered</option>
                                                        <option>Cancelled</option>
                                                    </select>
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="p-3 bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-primary rounded-xl transition-all"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-dark/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3.5rem] shadow-4xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                                <h2 className="text-3xl font-black italic text-dark dark:text-white">Order <span className="text-secondary">#{selectedOrder.id}</span></h2>
                                <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm">
                                    <XCircle className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-10 space-y-12">
                                {/* Status Header */}
                                <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${statusStyles[selectedOrder.status]}`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                                            <p className="text-lg font-black text-dark dark:text-white uppercase">{selectedOrder.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Date</p>
                                        <p className="text-lg font-black italic">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-secondary pl-4">Shipment Contents</h4>
                                    <div className="space-y-4">
                                        {selectedOrder.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-dark dark:text-white">{item.name}</p>
                                                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Quantity: {item.quantity} × ₹{item.offerPrice || item.price}</p>
                                                    </div>
                                                </div>
                                                <p className="font-black text-dark dark:text-white italic">₹{(item.offerPrice || item.price) * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="p-8 bg-blue-50/30 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100/50 dark:border-blue-800/20">
                                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Delivery Vector</h4>
                                        <div className="text-sm font-bold text-gray-600 dark:text-gray-400 space-y-2">
                                            <p className="font-black text-dark dark:text-white text-lg leading-tight mb-2">{selectedOrder.address?.name || selectedOrder.customer || 'N/A'}</p>
                                            {selectedOrder.address ? (
                                                <>
                                                    <p>{selectedOrder.address.street}</p>
                                                    <p>{selectedOrder.address.city}, {selectedOrder.address.zip}</p>
                                                    <p className="text-secondary font-black mt-2">{selectedOrder.address.phone}</p>
                                                </>
                                            ) : (
                                                <p className="italic">No address provided</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-8 bg-gray-50/50 dark:bg-white/5 rounded-[2.5rem] flex flex-col justify-center text-right">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Financial Payload</h4>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Valuation</p>
                                            <p className="text-4xl font-black text-primary italic">₹{selectedOrder.total}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteOrder(selectedOrder.id)}
                                    className="w-full py-4 text-[10px] font-black text-red-500 uppercase tracking-[0.3em] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-800"
                                >
                                    Purge Order Records
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageOrders;

