import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, CreditCard, Tag, ShoppingBag,
    Lock, LogOut, LayoutDashboard, ChevronRight,
    Search, Trash2, Eye, Edit3, Save, X, Plus, Power, Menu, Bot, Phone, User, MapPin, Fish, Download, Calendar, CheckCircle2, XCircle, Zap
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { products as localProducts } from '../../data/products';

const SkeletonLoader = () => (
    <div className="animate-pulse space-y-8 p-12">
        <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-[3rem]"></div>
            <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-[3rem]"></div>
            <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-[3rem]"></div>
        </div>
        <div className="h-96 bg-gray-200 dark:bg-slate-800 rounded-[3rem]"></div>
    </div>
);

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
            navigate('/admin/login');
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
            const results = await Promise.allSettled([
                apiFetch('/api/admin/orders?limit=20'),
                apiFetch('/api/admin/offers'),
                apiFetch('/api/admin/products'),
                apiFetch('/api/inquiries?limit=20')
            ]);

            const ordersRes = results[0].status === 'fulfilled' ? results[0].value : [];
            const offersRes = results[1].status === 'fulfilled' ? results[1].value : [];
            const productsRes = results[2].status === 'fulfilled' ? results[2].value : [];
            const inquiriesRes = results[3].status === 'fulfilled' ? results[3].value : [];

            if (results.some(r => r.status === 'rejected')) {
                console.error("Some data failed to load:", results.filter(r => r.status === 'rejected'));
            }

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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${baseUrl}${url}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            clearTimeout(timeoutId);

            if (res.status === 401) {
                handleLogout();
                throw new Error('Unauthorized');
            }
            if (!res.ok) throw new Error(`API Error: ${res.status}`);

            return res.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
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
        // Sync with the master local inventory data
        const initialProducts = localProducts.map(p => ({
            id: p.id.toString(),
            name: p.name,
            price: p.price,
            active: true
        }));

        try {
            await apiFetch('/api/admin/products/sync', {
                method: 'POST',
                body: JSON.stringify({ products: initialProducts })
            });
            fetchData();
            alert("Database synchronized with local catalog!");
        } catch (err) {
            alert("Sync failed. Check backend connection.");
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
        <div className="min-h-screen bg-bg-main">
            <SkeletonLoader />
        </div>
    );

    return (
        <div className="bg-bg-main min-h-screen flex flex-col lg:flex-row relative">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-6 bg-dark/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-aqua rounded-xl flex items-center justify-center text-dark italic font-black shadow-[0_0_20px_rgba(14,165,233,0.3)]">AK</div>
                    <h2 className="text-lg font-black italic text-white uppercase tracking-tighter">Admin <span className="text-aqua">Hub</span></h2>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/5 rounded-xl text-white hover:bg-aqua hover:text-dark transition-all">
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
            <aside className={`fixed inset-y-0 left-0 w-80 bg-dark/40 backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col z-[70] transition-transform duration-300 transform lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-aqua/10' : '-translate-x-full'}`}>
                <div className="hidden lg:flex items-center gap-4 mb-16 px-4">
                    <div className="w-12 h-12 bg-aqua rounded-2xl flex items-center justify-center text-dark italic font-black shadow-[0_0_30px_rgba(14,165,233,0.4)]">AK</div>
                    <div>
                        <h2 className="text-xl font-black italic text-white leading-tight uppercase tracking-tighter">Admin <span className="text-aqua">Hub</span></h2>
                        <p className="text-[10px] text-aqua/40 font-bold uppercase tracking-[0.2em]">v2.0 Stable</p>
                    </div>
                </div>

                <nav className="flex-grow space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === item.id ? 'bg-aqua text-dark shadow-[0_0_20px_rgba(14,165,233,0.4)] translate-x-2' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
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
                        className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${isBackupDue() ? 'border-aqua/50 bg-aqua/5 text-aqua animate-pulse' : 'border-white/10 text-white/20 hover:bg-white/5 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Download className="w-4 h-4" />
                            {isBackupDue() ? 'Backup Due (Excel)' : 'Download Backup'}
                        </div>
                        {isBackupDue() && <Calendar className="w-3 h-3" />}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 text-red-400/60 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
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

                <header className="mb-8 lg:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white italic mb-2 uppercase tracking-tighter shadow-2xl">{activeTab} <span className="text-aqua italic glow-text">Management</span></h1>
                        <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Overview of business unit {activeTab}</p>
                    </div>

                    {/* Mobile Quick Actions Bar */}
                    <div className="lg:hidden flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 scrollbar-none">
                        <button
                            onClick={handleDownloadBackup}
                            className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${isBackupDue() ? 'border-aqua/50 bg-aqua/10 text-aqua animate-pulse' : 'border-[#00E5FF]/20 bg-[#0B2A4A]/40 text-[#BFEFFF]'}`}
                        >
                            <Download className="w-4 h-4" /> Excel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-shrink-0 p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Mobile Tab Quick Switcher (Horizontal Scroll) */}
                <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-8 scrollbar-none mb-4 -mx-2 px-2">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${activeTab === item.id ? 'bg-aqua text-dark border-aqua shadow-[0_0_20px_rgba(14,165,233,0.4)]' : 'bg-[#0B2A4A]/20 text-[#BFEFFF]/40 border-white/5'}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>

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
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white shadow-sm focus:border-aqua/50 outline-none transition-all placeholder-white/20"
                />
                <Search className="absolute left-4 top-4 text-aqua w-5 h-5" />
            </div>

            <div className="glass-card rounded-[3rem] border border-white/5 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
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
                    <tbody className="divide-y divide-white/5">
                        {filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date)).map(order => (
                            <tr key={order.id} className="hover:bg-white/5 transition-all font-bold align-top text-[10px]">
                                <td className="p-6 italic font-black text-aqua">#{order.id}</td>
                                <td className="p-6 whitespace-nowrap text-white">{order.customerName}</td>
                                <td className="p-6 text-white/40">{order.place}</td>
                                <td className="p-6 whitespace-nowrap text-white">{order.phone}</td>
                                <td className="p-6">
                                    <div className="flex flex-col gap-1 text-white/60">
                                        {order.items.map((item, i) => (
                                            <span key={i} className="whitespace-nowrap">• {item.name} (x{item.quantity})</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-6 font-black text-white italic">₹{order.total}</td>
                                <td className="p-6 space-y-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => onUpdate(order.id, { status: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg text-[9px] font-black p-2 text-white outline-none focus:border-aqua"
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
                                        className="w-full bg-transparent border-b border-white/10 text-[9px] p-1 font-medium italic focus:border-aqua outline-none text-white/60"
                                    />
                                </td>
                                <td className="p-6 text-right space-y-2">
                                    <div className="text-[9px] text-white/20 whitespace-nowrap font-black uppercase tracking-widest">
                                        {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <button onClick={() => onDelete(order.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
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
    <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
                <tr>
                    <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Order ID</th>
                    <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Amount</th>
                    <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Payment Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {orders.map(order => (
                    <tr key={order.id} className="font-bold hover:bg-white/5 transition-all">
                        <td className="p-8 italic text-aqua font-black">#{order.id}</td>
                        <td className="p-8 text-white italic">₹{order.total}</td>
                        <td className="p-8">
                            <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
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
            <div key={order.id} className="glass-card p-8 rounded-[3rem] border border-white/5 group">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Order ID</p>
                        <h4 className="text-xl font-black italic text-aqua uppercase tracking-tighter">#{order.id}</h4>
                    </div>
                    <div className="p-4 bg-aqua/10 text-aqua rounded-2xl group-hover:scale-110 transition-transform"><MapPin className="w-5 h-5" /></div>
                </div>
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Status Phase: <span className="text-aqua italic ml-2">{order.status}</span></p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
                        {['Processing', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered'].map(status => (
                            <button
                                key={status}
                                onClick={() => onUpdate(order.id, { status })}
                                className={`p-4 rounded-2xl text-[8px] font-black uppercase tracking-widest border transition-all ${order.status === status ? 'bg-aqua text-dark border-aqua shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'bg-white/5 border-white/5 text-white/40 hover:border-aqua/50 hover:text-white'}`}
                            >
                                {status === 'Processing' ? 'Confirmed' : status}
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
            <div className="glass-card p-10 rounded-[3rem] border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Offer Title</label>
                    <input type="text" value={newOffer.title} onChange={e => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm text-white outline-none focus:border-aqua transition-all" placeholder="Flat 10% Off" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Code (Opt)</label>
                    <input type="text" value={newOffer.code} onChange={e => setNewOffer({ ...newOffer, code: e.target.value })} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm text-white outline-none focus:border-aqua transition-all" placeholder="GUPPY10" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Discount Value</label>
                    <input type="text" value={newOffer.discount} onChange={e => setNewOffer({ ...newOffer, discount: e.target.value })} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm text-white outline-none focus:border-aqua transition-all" placeholder="10%" />
                </div>
                <button onClick={handleAdd} className="p-5 bg-aqua text-dark rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-[1.02] active:scale-95 transition-all"><Plus className="w-4 h-4" /> Deploy Offer</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.map(offer => (
                    <div key={offer.id} className="glass-card p-8 rounded-[3rem] border border-white/5 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-aqua/5 to-transparent pointer-events-none"></div>
                        <button onClick={() => handleDelete(offer.id)} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-red-500 hover:scale-125 transition-all z-10 p-2 bg-red-500/10 rounded-xl"><X className="w-4 h-4" /></button>
                        <Tag className="text-aqua w-8 h-8 mb-6" />
                        <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-tight">{offer.title}</h4>
                        <p className="text-aqua font-black mt-2 text-xl italic">{offer.discount}</p>
                        {offer.code && <p className="mt-8 text-[9px] font-black text-white/40 uppercase tracking-[0.3em] bg-white/5 p-3 rounded-xl border border-white/5 inline-block">Code Unlock: {offer.code}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProductsSection = ({ products, onRefresh, apiFetch, onSync }) => {
    const [newProduct, setNewProduct] = useState({ name: '', price: '', active: true });

    const handleAdd = async () => {
        if (!newProduct.name || !newProduct.name.trim()) return alert("Product Name is required");
        if (!newProduct.price) return alert("Price is required");

        try {
            await apiFetch('/api/admin/products', {
                method: 'POST',
                body: JSON.stringify({
                    ...newProduct,
                    price: Number(newProduct.price)
                })
            });
            setNewProduct({ name: '', price: '', active: true });
            onRefresh();
        } catch (err) {
            alert("Failed to add product");
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await apiFetch(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
            onRefresh();
        } catch (err) { }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            onRefresh();
        } catch (err) { alert("Failed to delete"); }
    };

    return (
        <div className="space-y-12">
            {/* Add New Product Form */}
            <div className="glass-card p-10 rounded-[3rem] border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Fish / Product Name</label>
                    <input
                        type="text"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm text-white outline-none focus:border-aqua transition-all"
                        placeholder="e.g. Red Cap Oranda Goldfish"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Price (₹)</label>
                    <input
                        type="number"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm text-white outline-none focus:border-aqua transition-all"
                        placeholder="450"
                    />
                </div>
                <button onClick={handleAdd} className="p-5 bg-aqua text-dark rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                    <Plus className="w-4 h-4" /> Add to Stock
                </button>
            </div>

            {/* Products Table */}
            <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <h3 className="font-black italic text-white uppercase tracking-tighter">Current Inventory</h3>
                    <div className="flex flex-wrap items-center gap-6">
                        <button
                            onClick={onSync}
                            className="flex items-center gap-2 px-6 py-3 bg-aqua/10 text-aqua rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-aqua hover:text-dark transition-all border border-aqua/20"
                        >
                            <Zap className="w-4 h-4" /> Sync Catalog
                        </button>
                        <div className="flex gap-4">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div> Active
                            </span>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div> Out
                            </span>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Species Name</th>
                                <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Price (₹)</th>
                                <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Status</th>
                                <th className="p-8 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map(product => (
                                <tr key={product.id} className="font-bold hover:bg-white/5 transition-all">
                                    <td className="p-8">
                                        <input
                                            type="text"
                                            defaultValue={product.name}
                                            onBlur={(e) => handleUpdate(product.id, { name: e.target.value })}
                                            className="bg-transparent border-b border-transparent focus:border-aqua border-dashed outline-none p-1 font-black italic text-white w-full transition-all"
                                        />
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-1">
                                            <span className="text-white/20">₹</span>
                                            <input
                                                type="number"
                                                defaultValue={product.price}
                                                onBlur={(e) => handleUpdate(product.id, { price: Number(e.target.value) })}
                                                className="bg-transparent border-b border-transparent focus:border-aqua border-dashed outline-none p-1 w-24 font-black text-white italic transition-all"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <button
                                            onClick={() => handleUpdate(product.id, { active: !product.active })}
                                            className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${product.active ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${product.active ? 'bg-green-400' : 'bg-red-500'}`}></div>
                                            {product.active ? 'In Stock' : 'Out of Stock'}
                                        </button>
                                    </td>
                                    <td className="p-8 text-right">
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-3 bg-red-400/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-400/20"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        Inventory is empty. Add your first fish above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
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
            <div className="glass-card p-12 rounded-[4rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-aqua/10 to-transparent pointer-events-none"></div>
                <div className="inline-flex items-center justify-center p-8 bg-aqua rounded-3xl text-dark shadow-[0_0_30px_rgba(14,165,233,0.4)] mb-12 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <Lock className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-white italic mb-4 uppercase tracking-tighter leading-tight">Rotate <span className="text-aqua">Key</span></h3>
                <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[9px] mb-12">Security Protocol Update Required</p>

                <form onSubmit={handleUpdate} className="space-y-8">
                    <input
                        required
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="NEW SECURE PASS"
                        className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 font-bold text-center text-white outline-none focus:border-aqua transition-all placeholder-white/10"
                    />
                    <button
                        type="submit"
                        className="w-full py-6 bg-aqua text-dark rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Sync Credentials
                    </button>
                    {success && <p className="text-green-400 font-black text-[10px] uppercase tracking-widest animate-pulse mt-6">Protocol Updated!</p>}
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
        <div className="glass-card rounded-[3rem] border border-white/5 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                    <tr>
                        <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] whitespace-nowrap">Lead Name</th>
                        <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] whitespace-nowrap">Contact</th>
                        <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] whitespace-nowrap">City</th>
                        <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] whitespace-nowrap">Fish Inquiry</th>
                        <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] whitespace-nowrap">Status</th>
                        <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] text-right whitespace-nowrap">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {inquiries.map(inquiry => (
                        <tr key={inquiry.id} className="hover:bg-white/5 transition-all font-bold align-top text-[10px]">
                            <td className="p-6 whitespace-nowrap flex items-center gap-3 text-white">
                                <User className="w-3 h-3 text-aqua" /> {inquiry.name}
                            </td>
                            <td className="p-6 whitespace-nowrap text-white/60 font-black tracking-widest uppercase">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-3 h-3 text-green-400" /> {inquiry.contactNumber}
                                </div>
                            </td>
                            <td className="p-6 whitespace-nowrap text-white italic">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-3 h-3 text-aqua" /> {inquiry.city}
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-start gap-4 max-w-xs text-white/60">
                                    <Fish className="w-3 h-3 text-aqua mt-1 flex-shrink-0" />
                                    <span className="italic leading-relaxed">{inquiry.fishEnquiry}</span>
                                </div>
                            </td>
                            <td className="p-6">
                                <select
                                    value={inquiry.status}
                                    onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                                    className={`w-full bg-white/5 border border-white/10 rounded-lg text-[8px] font-black p-2 outline-none focus:border-aqua transition-all ${inquiry.status === 'Pending' ? 'text-orange-400' :
                                        inquiry.status === 'Responded' ? 'text-aqua' :
                                            'text-green-400'
                                        }`}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Responded">Responded</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </td>
                            <td className="p-6 text-right text-white/20 whitespace-nowrap font-black uppercase tracking-widest">
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
