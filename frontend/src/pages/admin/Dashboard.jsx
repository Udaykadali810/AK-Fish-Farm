import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Tag, Users, ArrowUpRight, ArrowDownRight, Droplets } from 'lucide-react';
import { products } from '../../data/products';

const Dashboard = () => {
    const [ordersCount, setOrdersCount] = useState(0);

    useEffect(() => {
        const akf = JSON.parse(localStorage.getItem('akf_orders') || '[]');
        const ak = JSON.parse(localStorage.getItem('ak_orders') || '[]');
        const allOrders = [...akf, ...ak];
        const uniqueOrders = allOrders.filter((order, index, self) =>
            index === self.findIndex((t) => t.id === order.id)
        );
        setOrdersCount(uniqueOrders.length);
    }, []);

    const stats = [
        { label: 'Total Sales', value: '₹45,892', icon: <ShoppingBag />, color: 'bg-blue-500', trend: '+12.5%', isUp: true, link: '/admin/orders' },
        { label: 'Total Orders', value: ordersCount || '154', icon: <Package />, color: 'bg-green-500', trend: '+8.2%', isUp: true, link: '/admin/orders' },
        { label: 'Total Products', value: products.length, icon: <Droplets />, color: 'bg-orange-500', trend: '0', isUp: true, link: '/admin/products' },
        { label: 'Active Users', value: '1.2k', icon: <Users />, color: 'bg-purple-500', trend: '-2.1%', isUp: false, link: '/admin' },
    ];

    return (
        <div className="bg-bg-main min-h-screen p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-dark dark:text-white italic mb-2">Aquatic <span className="text-primary mt-1">Console</span></h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Overview of your fish farm performance</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/admin/orders" className="px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest border border-gray-100 dark:border-gray-800 hover:border-primary/40 transition-all flex items-center gap-2">
                            Orders <Package className="w-4 h-4 text-primary" />
                        </Link>
                        <Link to="/admin/products" className="px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest border border-gray-100 dark:border-gray-800 hover:border-primary/40 transition-all flex items-center gap-2">
                            Inventory <Droplets className="w-4 h-4 text-orange-400" />
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {stats.map((stat, i) => (
                        <Link to={stat.link} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 group hover:border-primary/40 transition-all cursor-pointer h-full"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg`}>
                                        {React.cloneElement(stat.icon, { className: 'w-6 h-6' })}
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-black ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                        {stat.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                        {stat.trend}
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-dark dark:text-white italic">{stat.value}</h3>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Recent Orders Mockup */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-gray-800">
                        <h3 className="text-2xl font-black text-dark dark:text-white mb-8 italic">Recent Acquisitions</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl aquatic-gradient flex items-center justify-center text-white font-black text-xs">#{3480 + i}</div>
                                        <div>
                                            <p className="font-bold text-sm">Customer {i}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Ordered 2 hours ago</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-primary italic">₹{1200 + i * 200}</p>
                                </div>
                            ))}
                        </div>
                        <Link to="/admin/orders" className="block w-full mt-8 py-4 text-center text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/5 rounded-2xl transition-all">View All Orders</Link>
                    </div>

                    {/* Top Products Mockup */}
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-gray-800">
                        <h3 className="text-2xl font-black text-dark dark:text-white mb-8 italic">Popular Species</h3>
                        <div className="space-y-6">
                            {products.slice(0, 4).map((p, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm font-medium">
                                        <span className="text-gray-400 font-black italic">0{i + 1}</span>
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                            <img src={p.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <span className="font-bold">{p.name}</span>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1 rounded-full">In Stock</p>
                                </div>
                            ))}
                        </div>
                        <Link to="/admin/products" className="block w-full mt-8 py-4 text-center text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/5 rounded-2xl transition-all">Inventory Health</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

