import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, SlidersHorizontal, Package, ArrowRight, Eye, Image as ImageIcon } from 'lucide-react';
import { products as initialProducts } from '../../data/products';

const ManageProducts = () => {
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = (id) => {
        if (window.confirm('Erase this species from inventory?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div className="bg-bg-main min-h-screen p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div>
                        <h1 className="text-4xl font-black text-dark dark:text-white italic mb-2 flex items-center gap-4">
                            <Package className="text-primary w-10 h-10" /> Stock <span className="text-primary mt-1">Registry</span>
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Managing {products.length} aquatic listings</p>
                    </div>
                    <button
                        onClick={() => { setEditingProduct(null); setShowModal(true); }}
                        className="px-10 py-5 bg-dark dark:bg-primary text-white rounded-[2rem] font-black text-xl shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                    >
                        <Plus className="w-6 h-6" /> Add New Species
                    </button>
                </div>

                {/* Controls */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800 mb-12 flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search biological database..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-5 top-4.5 text-primary w-5 h-5" />
                    </div>
                    <select className="px-6 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-primary/40 appearance-none min-w-[200px]">
                        <option>All Tank Types</option>
                        <option>Freshwater</option>
                        <option>Saltwater</option>
                        <option>Planted</option>
                    </select>
                </div>

                {/* Table/List */}
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Species Specimen</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Taxonomy</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Health</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                                {filtered.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/30 dark:hover:bg-white/5 transition-all group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-110 transition-transform">
                                                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-dark dark:text-white italic text-lg leading-tight">{product.name}</p>
                                                    <p className="text-[10px] font-black text-primary uppercase mt-1">ID: #{product.id}092</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="px-4 py-1.5 bg-accent/30 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="font-black text-lg text-dark dark:text-white italic">₹{product.offerPrice || product.price}</p>
                                            <p className="text-[10px] text-gray-400 line-through">₹{product.price + 200}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                                                <span className="text-sm font-bold text-gray-500">Available</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <button className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;
