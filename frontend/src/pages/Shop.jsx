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
                'guppy': 'AK Guppy Collection',
                'premium': 'AK Premium Collection',
                'special': 'AK Special Collection'
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
                <h4 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.3em] mb-6 block border-b border-[#00E5FF]/10 pb-4 glow-text">Search Species</h4>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type to search..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#071A2F]/50 border border-[#00E5FF]/20 focus:border-[#00E5FF] text-[#BFEFFF] font-medium transition-all focus:outline-none placeholder-[#BFEFFF]/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00E5FF]/40 w-4 h-4" />
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.3em] mb-6 block border-b border-[#00E5FF]/10 pb-4 glow-text">Budget Limit: ₹{priceRange}</h4>
                <input
                    type="range"
                    min="10"
                    max="5000"
                    step="10"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#00E5FF] h-1 bg-[#BFEFFF]/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-black text-[#BFEFFF]/20 mt-4 tracking-widest">
                    <span>₹10</span>
                    <span>₹5000</span>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-40 flex justify-center items-center">
                <div className="flex flex-col items-center gap-8">
                    <div className="w-20 h-20 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(0,229,255,0.2)]"></div>
                    <span className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Inventory...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 pt-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 sm:py-32">
                {/* Header */}
                <div className="flex flex-col justify-between items-start gap-12 mb-20 lg:mb-32">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">Store Catalog</span>
                        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-[#BFEFFF] italic mb-6 uppercase leading-[0.8] tracking-tighter">The <span className="text-[#00E5FF] italic glow-text">Catalog</span></h1>
                        <p className="text-[#BFEFFF]/40 font-medium tracking-wide max-w-lg text-xs uppercase tracking-[0.2em] leading-relaxed">Discover {filteredProducts.length} high-vibrancy aquatic species cultivated with professional precision.</p>
                    </motion.div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-5 w-full border-b border-[#00E5FF]/10 pb-12">
                        {['All', ...categories.map(c => c.name)].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setCategory(cat);
                                    setCurrentPage(1);
                                }}
                                className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 relative ${category === cat ? 'text-[#071A2F] bg-[#00E5FF] shadow-[0_0_40px_rgba(0,229,255,0.4)]' : 'text-[#BFEFFF]/30 hover:text-[#00E5FF] bg-[#0B2A4A]/40 border border-[#00E5FF]/10'}`}
                            >
                                {cat.replace(' Collection', '')}
                                {category === cat && (
                                    <motion.div
                                        layoutId="activeTabSlot"
                                        className="absolute inset-0 bg-[#00E5FF] rounded-2xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 w-full justify-between">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-4 px-10 h-16 glass-card rounded-2xl border border-[#00E5FF]/10 font-black text-xs uppercase tracking-widest hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all"
                        >
                            <SlidersHorizontal className="w-5 h-5" /> Filters
                        </button>

                        <div className="flex items-center gap-4 glass-card px-10 h-16 rounded-2xl border border-[#00E5FF]/10 w-full max-w-xs ml-auto">
                            <ArrowUpDown className="w-5 h-5 text-[#00E5FF]" />
                            <select
                                className="bg-transparent text-[#BFEFFF]/70 font-black uppercase text-xs tracking-widest focus:outline-none cursor-pointer w-full"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option className="bg-[#071A2F]">Newest</option>
                                <option className="bg-[#071A2F]">Price: Low to High</option>
                                <option className="bg-[#071A2F]">Price: High to Low</option>
                                <option className="bg-[#071A2F]">Rating</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <div className="glass-card p-12 rounded-[4rem] border border-[#00E5FF]/10 sticky top-40 bg-gradient-to-br from-[#0B2A4A]/40 to-transparent">
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
                                    className="fixed inset-0 bg-[#071A2F]/80 backdrop-blur-md z-[200]"
                                    onClick={() => setShowFilters(false)}
                                />
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    className="fixed right-0 top-0 h-full w-80 bg-[#071A2F] border-l border-[#00E5FF]/20 z-[210] p-12 overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center mb-16">
                                        <h3 className="text-3xl font-black text-[#BFEFFF] italic uppercase tracking-tighter">Filters</h3>
                                        <button onClick={() => setShowFilters(false)} className="p-4 bg-[#BFEFFF]/5 rounded-2xl hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    {filters}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        <div className="mb-16 flex items-center gap-6">
                            <h2 className="text-4xl font-black italic uppercase text-[#BFEFFF]">
                                {category === 'All' ? 'Complete' : category.replace(' Collection', '')} <span className="text-[#00E5FF]">{category === 'All' ? 'Inventory' : 'Protocol'}</span>
                            </h2>
                            <div className="h-0.5 flex-grow bg-gradient-to-r from-[#00E5FF]/20 to-transparent rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                            <AnimatePresence mode="popLayout">
                                {currentProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-8 mt-32">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="w-20 h-20 glass-card rounded-3xl border border-[#00E5FF]/10 text-[#00E5FF] disabled:opacity-10 hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all flex items-center justify-center shadow-xl"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <div className="text-[#BFEFFF] font-black italic text-2xl tracking-[0.3em] glow-text">
                                    {currentPage} <span className="text-[#BFEFFF]/20">/</span> {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-20 h-20 glass-card rounded-3xl border border-[#00E5FF]/10 text-[#00E5FF] disabled:opacity-10 hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all flex items-center justify-center shadow-xl"
                                >
                                    <ChevronRight className="w-8 h-8" />
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
