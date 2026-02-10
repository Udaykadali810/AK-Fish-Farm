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
    const initialSearch = queryParams.get('search') || '';

    const [filteredProducts, setFilteredProducts] = useState(products);
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);
    const [priceRange, setPriceRange] = useState(3000);
    const [sortBy, setSortBy] = useState('Newest');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        let result = products;

        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (category !== 'All') {
            result = result.filter(p => p.category === category);
        }

        result = result.filter(p => (p.offerPrice || p.price) <= priceRange);

        if (sortBy === 'Price: Low to High') {
            result = [...result].sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
        } else if (sortBy === 'Price: High to Low') {
            result = [...result].sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
        } else if (sortBy === 'Rating') {
            result = [...result].sort((a, b) => b.rating - a.rating);
        }

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [search, category, priceRange, sortBy]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const filters = (
        <div className="space-y-12">
            <div>
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 block border-b border-primary/10 pb-4">Search Species</h4>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type to search..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 text-white font-medium transition-all focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-4 top-4.5 text-primary/40 w-4 h-4" />
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 block border-b border-primary/10 pb-4">Category</h4>
                <div className="space-y-3">
                    {['All', ...categories.map(c => c.name)].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`block w-full text-left px-5 py-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${category === cat ? 'bg-primary text-dark shadow-xl shadow-primary/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 block border-b border-primary/10 pb-4">Budget Limit: ₹{priceRange}</h4>
                <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-primary bg-white/5 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-black text-gray-500 mt-4 tracking-widest">
                    <span>₹100</span>
                    <span>₹5000</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-bg-main min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-5xl lg:text-8xl font-black text-white italic mb-4 uppercase">The <span className="text-primary italic">Catalog</span></h1>
                        <p className="text-gray-400 font-medium tracking-wide">Showing {filteredProducts.length} premium aquatic species available for your selection.</p>
                    </motion.div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-3 px-8 py-4 glass-card rounded-2xl border border-white/10 font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-dark transition-all"
                        >
                            <SlidersHorizontal className="w-4 h-4" /> Filters
                        </button>

                        <div className="flex items-center gap-3 glass-card px-6 py-4 rounded-2xl border border-white/10 flex-grow">
                            <ArrowUpDown className="w-4 h-4 text-primary" />
                            <select
                                className="bg-transparent text-white font-black uppercase text-xs tracking-widest focus:outline-none cursor-pointer w-full"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option>Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Rating</option>
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
                                    className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-[60]"
                                    onClick={() => setShowFilters(false)}
                                />
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    className="fixed right-0 top-0 h-full w-80 glass-morphism z-[70] p-10 overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center mb-12">
                                        <h3 className="text-2xl font-black text-white italic uppercase">Filters</h3>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                            <AnimatePresence mode="popLayout">
                                {currentProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Empty State */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-40 glass-card rounded-[4rem] border border-white/5">
                                <Sparkles className="w-16 h-16 text-primary mx-auto mb-8 opacity-20" />
                                <h3 className="text-3xl font-black text-white italic mb-4">No Species Found</h3>
                                <p className="text-gray-400 max-w-sm mx-auto">Try adjusting your filters or search terms.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-6 mt-20">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-5 glass-card rounded-2xl border border-white/10 text-white disabled:opacity-20 hover:bg-primary hover:text-dark transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <div className="text-white font-black italic text-xl tracking-widest">
                                    {currentPage} <span className="text-white/20">/</span> {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-5 glass-card rounded-2xl border border-white/10 text-white disabled:opacity-20 hover:bg-primary hover:text-dark transition-all"
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
