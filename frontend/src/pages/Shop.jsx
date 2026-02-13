import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ui/ProductCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState(5000);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('Newest');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const cat = queryParams.get('category');
        if (cat) {
            // Map shorthand aliases for better UX and routing compatibility
            const aliasMap = {
                'guppy': 'Fancy Guppy Collection',
                'premium': 'AK Premium Collection',
                'special': 'AK Special Fish Collection'
            };
            const mappedCat = aliasMap[cat.toLowerCase()] || cat;
            setCategory(mappedCat);
        }
    }, [location.search]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || p.category === category;
        const matchesPrice = p.price <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
        if (sortBy === 'Price: Low to High') return a.price - b.price;
        if (sortBy === 'Price: High to Low') return b.price - a.price;
        if (sortBy === 'Rating') return b.rating - a.rating;
        return b.id - a.id;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const filters = (
        <div className="space-y-12">
            <div>
                <h4 className="text-[10px] font-black text-aqua uppercase tracking-[0.3em] mb-6 block border-b border-white/10 pb-4 glow-text">Search Species</h4>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type to search..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-aqua/50 text-white font-medium transition-all focus:outline-none placeholder-white/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aqua/40 w-4 h-4" />
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-black text-aqua uppercase tracking-[0.3em] mb-6 block border-b border-white/10 pb-4 glow-text">Category</h4>
                <div className="space-y-3">
                    {['All', ...categories.map(c => c.name)].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`block w-full text-left px-5 py-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${category === cat ? 'bg-aqua text-dark shadow-xl shadow-aqua/20 glow-border' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-black text-aqua uppercase tracking-[0.3em] mb-6 block border-b border-white/10 pb-4 glow-text">Budget Limit: ₹{priceRange}</h4>
                <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-aqua h-1 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-black text-white/20 mt-4 tracking-widest">
                    <span>₹100</span>
                    <span>₹5000</span>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="hidden lg:block w-72 flex-shrink-0">
                            <div className="h-96 bg-white/5 rounded-[3rem] border border-white/5 animate-pulse"></div>
                        </div>
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white/5 rounded-[2.5rem] p-4 border border-white/5 animate-pulse h-96">
                                    <div className="h-48 bg-white/5 rounded-[1.5rem] mb-4 w-full"></div>
                                    <div className="h-6 bg-white/5 rounded-full w-3/4 mb-2"></div>
                                    <div className="h-4 bg-white/5 rounded-full w-1/2 mb-4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 lg:mb-32">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="text-aqua text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Store Catalog</span>
                        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white italic mb-4 uppercase leading-[0.9] tracking-tighter">The <span className="text-aqua italic glow-text">Catalog</span></h1>
                        <p className="text-white/40 font-medium tracking-wide max-w-lg">Discover {filteredProducts.length} high-vibrancy aquatic species cultivated with professional precision.</p>
                    </motion.div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-3 px-8 py-4 glass-card rounded-2xl border border-white/10 font-black text-xs uppercase tracking-widest hover:bg-aqua hover:text-dark transition-all"
                        >
                            <SlidersHorizontal className="w-4 h-4" /> Filters
                        </button>

                        <div className="flex items-center gap-3 glass-card px-6 py-4 rounded-2xl border border-white/10 flex-grow">
                            <ArrowUpDown className="w-4 h-4 text-aqua" />
                            <select
                                className="bg-transparent text-white/70 font-black uppercase text-xs tracking-widest focus:outline-none cursor-pointer w-full"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option className="bg-dark">Newest</option>
                                <option className="bg-dark">Price: Low to High</option>
                                <option className="bg-dark">Price: High to Low</option>
                                <option className="bg-dark">Rating</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="glass-card p-10 rounded-[3rem] border border-white/5 sticky top-32">
                            {filters}
                        </div>
                    </div>

                    {/* Mobile Filters Drawer */}
                    <AnimatePresence>
                        {showFilters && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-[200]"
                                    onClick={() => setShowFilters(false)}
                                />
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    className="fixed right-0 top-0 h-full w-80 glass-morphism z-[210] p-10 overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center mb-12">
                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Filters</h3>
                                        <button onClick={() => setShowFilters(false)} className="p-3 glass-card rounded-xl">
                                            <X className="w-6 h-6 text-white" />
                                        </button>
                                    </div>
                                    {filters}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-12">
                            <AnimatePresence mode="popLayout">
                                {currentProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-6 mt-20">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-5 glass-card rounded-3xl border border-white/10 text-white disabled:opacity-20 hover:bg-aqua hover:text-dark transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div className="text-white font-black italic text-xl tracking-widest glow-text">
                                    {currentPage} <span className="text-white/20">/</span> {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-5 glass-card rounded-3xl border border-white/10 text-white disabled:opacity-20 hover:bg-aqua hover:text-dark transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
