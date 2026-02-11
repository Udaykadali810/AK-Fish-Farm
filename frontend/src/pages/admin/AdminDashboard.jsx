import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, CreditCard, Tag, ShoppingBag,
    Lock, LogOut, LayoutDashboard, ChevronRight,
    Search, Trash2, Eye, Edit3, Save, X, Plus, Power, Menu, Bot, Phone, User, MapPin, Fish, Download, Calendar
} from 'lucide-react';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newOrderAlert, setNewOrderAlert] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lastDownloadDate, setLastDownloadDate] = useState(localStorage.getItem('lastDownloadDate') ? new Date(localStorage.getItem('lastDownloadDate')) : null);
    const lastOrderId = React.useRef(null);
    const lastInquiryId = React.useRef(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/admin');
            return;
        }
        fetchData(true); // Initial load

        // Polling for new orders every 10 seconds
        const pollInterval = setInterval(() => fetchData(false), 10000);
        return () => clearInterval(pollInterval);
    }, [token]);

    const fetchData = async (firstLoad = false) => {
        if (firstLoad) setLoading(true);
        try {
            const [ordersRes, offersRes, productsRes, inquiriesRes] = await Promise.all([
                apiFetch('/api/admin/orders'),
                apiFetch('/api/admin/offers'),
                apiFetch('/api/admin/products'),
                apiFetch('/api/inquiries')
            ]);

            // Notification Logic
            if (ordersRes.length > 0) {
                const latest = ordersRes.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                if (lastOrderId.current && latest.id !== lastOrderId.current) {
                    setNewOrderAlert(latest.id);
                    setTimeout(() => setNewOrderAlert(null), 5000);
                }
                lastOrderId.current = latest.id;
            }

            setOrders(ordersRes);
            setOffers(offersRes);
            setProducts(productsRes);
            setInquiries(inquiriesRes);
        } catch (err) {
            console.error(err);
        } finally {
            if (firstLoad) setLoading(false);
        }
    };

    const apiFetch = async (url, options = {}) => {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.status === 401) {
            handleLogout();
            throw new Error('Unauthorized');
        }
        return res.json();
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const handleUpdateOrderStatus = async (id, data) => {
        try {
            const body = typeof data === 'string' ? { status: data } : data;
            await apiFetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body)
            });
            fetchData();
        } catch (err) { alert('Update failed'); }
    };

    const handleDownloadBackup = () => {
        const wb = XLSX.utils.book_new();

        // 1. Orders Sheet
        const ordersData = orders.map(o => ({
            OrderID: o.id,
            Customer: o.customerName,
            Place: o.place,
            Phone: o.phone,
            Total: o.total,
            Status: o.status || 'Pending',
            Date: o.createdAt || o.date,
            Coupon: o.appliedCoupon || 'None'
        }));
        const ordersWS = XLSX.utils.json_to_sheet(ordersData);
        XLSX.utils.book_append_sheet(wb, ordersWS, "Orders");

        // 2. AI Leads/Inquiries Sheet
        const inquiriesData = inquiries.map(i => ({
            Name: i.name,
            Phone: i.contactNumber,
            City: i.city,
            FishEnquiry: i.fishEnquiry,
            Date: i.createdAt
        }));
        const inquiriesWS = XLSX.utils.json_to_sheet(inquiriesData);
        XLSX.utils.book_append_sheet(wb, inquiriesWS, "AI Leads");

        // 3. Products Sheet
        const productsData = products.map(p => ({
            ID: p.id,
            Name: p.name,
            Price: p.price,
            Category: p.category,
            Active: p.active
        }));
        const productsWS = XLSX.utils.json_to_sheet(productsData);
        XLSX.utils.book_append_sheet(wb, productsWS, "Products");

        // Save File
        const fileName = `AK_Fish_Farms_Full_Backup_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

        const now = new Date();
        localStorage.setItem('lastDownloadDate', now.toISOString());
        setLastDownloadDate(now);
    };

    const isBackupDue = () => {
        if (!lastDownloadDate) return true;
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        return (new Date() - lastDownloadDate) > thirtyDaysInMs;
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Erase this record permanently?')) return;
        try {
            await apiFetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) { alert('Delete failed'); }
    };

    const handleSyncProducts = async () => {
        // In a real app, this would fetch from the products data file
        // For now, we'll mock it if empty
        if (products.length === 0) {
            const initialProducts = [
                { id: '1', name: 'Red Cap Oranda', price: 450, active: true },
                { id: '2', name: 'Flowerhorn S', price: 1200, active: true },
            ];
            await apiFetch('/api/admin/products/sync', {
                method: 'POST',
                body: JSON.stringify({ products: initialProducts })
            });
            fetchData();
        }
    };

    const menuItems = [
        { id: 'orders', label: 'Orders', icon: <Package className="w-5 h-5" /> },
        { id: 'inquiries', label: 'AI Leads', icon: <Bot className="w-5 h-5" /> },
        { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
        { id: 'track', label: 'Track Control', icon: <MapPin className="w-5 h-5" /> },
        { id: 'offers', label: 'Offers', icon: <Tag className="w-5 h-5" /> },
        { id: 'products', label: 'Products', icon: <ShoppingBag className="w-5 h-5" /> },
        { id: 'password', label: 'Security', icon: <Lock className="w-5 h-5" /> },
    ];

    if (loading && orders.length === 0) return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
    );

    return (
        <div className="bg-bg-main min-h-screen flex flex-col lg:flex-row relative">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white italic font-black shadow-lg">AK</div>
                    <h2 className="text-lg font-black italic text-dark dark:text-white">Admin <span className="text-primary">Hub</span></h2>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-dark dark:text-white">
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Sidebar Toggle Overlay for Mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-gray-800 p-8 flex flex-col z-[70] transition-transform duration-300 transform lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                <div className="hidden lg:flex items-center gap-4 mb-16 px-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white italic font-black shadow-lg">AK</div>
                    <div>
                        <h2 className="text-xl font-black italic text-dark dark:text-white leading-tight">Admin <span className="text-primary">Hub</span></h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">v2.0 Stable</p>
                    </div>
                </div>

                <nav className="flex-grow space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-xl translate-x-2' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                        >
                            <div className="flex items-center gap-4">
                                {item.icon}
                                {item.label}
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'rotate-90' : ''}`} />
                        </button>
                    ))}
                </nav>

                <div className="space-y-4 pt-12 mt-auto">
                    <button
                        onClick={handleDownloadBackup}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${isBackupDue() ? 'border-primary/50 bg-primary/5 text-primary animate-pulse' : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Download className="w-4 h-4" />
                            {isBackupDue() ? 'Backup Due (Excel)' : 'Download Backup'}
                        </div>
                        {isBackupDue() && <Calendar className="w-3 h-3" />}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                        <LogOut className="w-5 h-5" /> Logout Session
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 lg:p-12 h-screen overflow-y-auto custom-scrollbar relative">
                <AnimatePresence>
                    {newOrderAlert && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: -20, x: '-50%' }}
                            className="fixed top-8 left-1/2 z-[100] bg-green-500 text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 border border-green-400/50"
                        >
                            <Package className="w-5 h-5 animate-bounce" />
                            New order received: <span className="underline italic">#{newOrderAlert}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-dark dark:text-white italic mb-2 capitalize">{activeTab} <span className="text-primary mt-1">Management</span></h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Overview of business unit {activeTab}</p>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'orders' && <OrdersSection orders={orders} onUpdate={handleUpdateOrderStatus} onDelete={handleDeleteOrder} />}
                        {activeTab === 'inquiries' && <InquiriesSection inquiries={inquiries} onRefresh={fetchData} apiFetch={apiFetch} />}
                        {activeTab === 'payments' && <PaymentsSection orders={orders} />}
                        {activeTab === 'track' && <TrackSection orders={orders} onUpdate={handleUpdateOrderStatus} />}
                        {activeTab === 'offers' && <OffersSection offers={offers} onRefresh={fetchData} apiFetch={apiFetch} />}
                        {activeTab === 'products' && <ProductsSection products={products} onRefresh={fetchData} apiFetch={apiFetch} onSync={handleSyncProducts} />}
                        {activeTab === 'password' && <PasswordSection apiFetch={apiFetch} />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

// --- Sub-sections ---

const OrdersSection = ({ orders, onUpdate, onDelete }) => {
    const [search, setSearch] = useState('');

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        order.phone?.includes(search)
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <input
                    type="text"
                    placeholder="Search by Name, Phone, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Order ID</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Name</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Place</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Phone</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Species</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Total</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Management</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Date / Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                        {filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date)).map(order => (
                            <tr key={order.id} className="hover:bg-gray-50/30 transition-all font-bold align-top text-[10px]">
                                <td className="p-6 italic font-black text-primary">#{order.id}</td>
                                <td className="p-6 whitespace-nowrap">{order.customerName}</td>
                                <td className="p-6 text-gray-400">{order.place}</td>
                                <td className="p-6 whitespace-nowrap">{order.phone}</td>
                                <td className="p-6">
                                    <div className="flex flex-col gap-1">
                                        {order.items.map((item, i) => (
                                            <span key={i} className="whitespace-nowrap">• {item.name} (x{item.quantity})</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-6 font-black text-dark dark:text-white">₹{order.total}</td>
                                <td className="p-6 space-y-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => onUpdate(order.id, { status: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-slate-800 border-none rounded-lg text-[9px] font-black p-2"
                                    >
                                        <option value="Processing">Order Placed</option>
                                        <option value="Packing">Packing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Add Internal Note..."
                                        defaultValue={order.deliveryNotes || ''}
                                        onBlur={(e) => onUpdate(order.id, { deliveryNotes: e.target.value })}
                                        className="w-full bg-transparent border-b border-gray-100 dark:border-slate-800 text-[9px] p-1 font-medium italic focus:border-primary outline-none"
                                    />
                                </td>
                                <td className="p-6 text-right space-y-2">
                                    <div className="text-[9px] text-gray-400 whitespace-nowrap">
                                        {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <button onClick={() => onDelete(order.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PaymentsSection = ({ orders }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                <tr>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {orders.map(order => (
                    <tr key={order.id} className="font-bold">
                        <td className="p-8 italic">#{order.id}</td>
                        <td className="p-8 text-dark dark:text-white">₹{order.total}</td>
                        <td className="p-8">
                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {order.status === 'Delivered' ? 'PAID' : 'PENDING'}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const TrackSection = ({ orders, onUpdate }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-lg border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                        <h4 className="text-xl font-black italic">#{order.id}</h4>
                    </div>
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl"><MapPin className="w-5 h-5" /></div>
                </div>
                <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-500">Current Phase: <span className="text-primary uppercase ml-2">{order.status}</span></p>
                    <div className="grid grid-cols-2 gap-4">
                        {['Processing', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered'].map(status => (
                            <button
                                key={status}
                                onClick={() => onUpdate(order.id, { status })}
                                className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${order.status === status ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-gray-50 dark:bg-slate-800 border-transparent text-gray-400 hover:border-primary/30'}`}
                            >
                                {status === 'Processing' ? 'Order Placed' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const OffersSection = ({ offers, onRefresh, apiFetch }) => {
    const [newOffer, setNewOffer] = useState({ title: '', code: '', discount: '' });

    const handleAdd = async () => {
        if (!newOffer.title || !newOffer.discount) return;
        await apiFetch('/api/admin/offers', { method: 'POST', body: JSON.stringify(newOffer) });
        setNewOffer({ title: '', code: '', discount: '' });
        onRefresh();
    };

    const handleDelete = async (id) => {
        await apiFetch(`/api/admin/offers/${id}`, { method: 'DELETE' });
        onRefresh();
    };

    return (
        <div className="space-y-12">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Offer Title</label>
                    <input type="text" value={newOffer.title} onChange={e => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold text-sm" placeholder="Flat 10% Off" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Code (Opt)</label>
                    <input type="text" value={newOffer.code} onChange={e => setNewOffer({ ...newOffer, code: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold text-sm" placeholder="GUPPY10" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Discount Value</label>
                    <input type="text" value={newOffer.discount} onChange={e => setNewOffer({ ...newOffer, discount: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border-none font-bold text-sm" placeholder="10%" />
                </div>
                <button onClick={handleAdd} className="p-4 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> Add Offer</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.map(offer => (
                    <div key={offer.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-lg border border-gray-100 dark:border-gray-800 relative group">
                        <button onClick={() => handleDelete(offer.id)} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-red-500 hover:scale-110 transition-all"><X className="w-4 h-4" /></button>
                        <Tag className="text-primary w-8 h-8 mb-6" />
                        <h4 className="text-2xl font-black italic">{offer.title}</h4>
                        <p className="text-primary font-black mt-2">{offer.discount}</p>
                        {offer.code && <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 p-2 inline-block rounded-lg">Code: {offer.code}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProductsSection = ({ products, onRefresh, apiFetch, onSync }) => {
    const handleUpdate = async (id, data) => {
        await apiFetch(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        onRefresh();
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-black italic">Species Control</h3>
                <button onClick={onSync} className="text-[10px] font-black text-primary uppercase bg-primary/5 px-4 py-2 rounded-xl">Sync Registry</button>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                    <tr>
                        <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Species</th>
                        <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                        <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibility</th>
                        <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {products.map(product => (
                        <tr key={product.id} className="font-bold">
                            <td className="p-8">
                                <input
                                    type="text"
                                    defaultValue={product.name}
                                    onBlur={(e) => handleUpdate(product.id, { name: e.target.value })}
                                    className="bg-transparent border-none p-0 font-black italic text-dark dark:text-white"
                                />
                            </td>
                            <td className="p-8">
                                <div className="flex items-center gap-1">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        defaultValue={product.price}
                                        onBlur={(e) => handleUpdate(product.id, { price: Number(e.target.value) })}
                                        className="bg-transparent border-none p-0 w-24 font-black"
                                    />
                                </div>
                            </td>
                            <td className="p-8">
                                <button
                                    onClick={() => handleUpdate(product.id, { active: !product.active })}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${product.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                >
                                    {product.active ? 'ON' : 'OFF'}
                                </button>
                            </td>
                            <td className="p-8 text-right">
                                <div className="p-3 text-primary inline-flex bg-primary/5 rounded-xl"><Edit3 className="w-4 h-4" /></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PasswordSection = ({ apiFetch }) => {
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await apiFetch('/api/admin/change-password', {
                method: 'POST',
                body: JSON.stringify({ newPassword: password })
            });
            setSuccess(true);
            setPassword('');
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) { alert('Update failed'); }
    };

    return (
        <div className="max-w-md mx-auto mt-20 text-center">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-4xl border border-gray-100 dark:border-gray-800">
                <Lock className="w-16 h-16 text-primary mx-auto mb-8" />
                <h3 className="text-3xl font-black text-dark dark:text-white italic mb-4">Rotate Key</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-12">Update your administrative access password</p>

                <form onSubmit={handleUpdate} className="space-y-8">
                    <input
                        required
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="New Secure Password"
                        className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none font-bold text-center"
                    />
                    <button
                        type="submit"
                        className="w-full py-5 bg-dark dark:bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all"
                    >
                        Update Key
                    </button>
                    {success && <p className="text-green-500 font-black text-xs uppercase animate-bounce mt-4">Security Credentials Synced!</p>}
                </form>
            </div>
        </div>
    );
};

const InquiriesSection = ({ inquiries, onRefresh, apiFetch }) => {
    const handleStatusUpdate = async (id, status) => {
        await apiFetch(`/api/inquiries/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
        onRefresh();
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                    <tr>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Lead Name</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Contact</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">City</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Fish Inquiry</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                        <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {inquiries.map(inquiry => (
                        <tr key={inquiry.id} className="hover:bg-gray-50/30 transition-all font-bold align-top text-[10px]">
                            <td className="p-6 whitespace-nowrap flex items-center gap-2">
                                <User className="w-3 h-3 text-primary" /> {inquiry.name}
                            </td>
                            <td className="p-6 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-green-500" /> {inquiry.contactNumber}
                                </div>
                            </td>
                            <td className="p-6 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-orange-500" /> {inquiry.city}
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-start gap-2 max-w-xs">
                                    <Fish className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                                    <span className="italic">{inquiry.fishEnquiry}</span>
                                </div>
                            </td>
                            <td className="p-6">
                                <select
                                    value={inquiry.status}
                                    onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                                    className={`w-full border-none rounded-lg text-[9px] font-black p-2 ${inquiry.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                        inquiry.status === 'Responded' ? 'bg-blue-100 text-blue-600' :
                                            'bg-green-100 text-green-600'
                                        }`}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Responded">Responded</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </td>
                            <td className="p-6 text-right text-gray-400 whitespace-nowrap">
                                {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </td>
                        </tr>
                    ))}
                    {inquiries.length === 0 && (
                        <tr>
                            <td colSpan="6" className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                No inquiries captured yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
