import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, Droplets, ChevronLeft, ChevronRight, Share2, Plus, Minus, MessageCircle } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const found = products.find(p => p.id === parseInt(id));
        if (found) {
            setProduct(found);
            window.scrollTo(0, 0);
        } else {
            navigate('/shop');
        }
    }, [id, navigate]);

    if (!product) return null;

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <div className="bg-bg-main min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-12">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-dark dark:text-white">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gradient-to-br from-white to-blue-50 flex items-center justify-center border border-white/20 shadow-2xl">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-48 h-48 bg-gradient-to-tr from-primary to-accent rounded-[3rem] flex items-center justify-center shadow-xl transform rotate-6">
                                    <span className="text-8xl font-black text-white italic">AK</span>
                                </div>
                                <span className="mt-8 text-lg font-black text-dark/30 uppercase tracking-[0.4em]">Fish Farms</span>
                            </motion.div>

                            {product.offerPrice && (
                                <div className="absolute top-8 left-8 bg-black text-white px-5 py-2 rounded-full font-black text-xs tracking-widest uppercase z-10">
                                    - {Math.round((1 - product.offerPrice / product.price) * 100)}% OFF
                                </div>
                            )}
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/30 text-secondary rounded-full w-fit text-[10px] font-black uppercase tracking-widest mb-6">
                            <Droplets className="w-3 h-3" /> {product.category}
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-dark dark:text-white mb-6 italic">{product.name}</h1>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex text-yellow-500 items-center">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-500" />)}
                                <span className="ml-2 font-black text-dark dark:text-white text-sm">5.0 (24 reviews)</span>
                            </div>
                        </div>

                        <div className="flex items-end gap-4 mb-10">
                            {product.offerPrice ? (
                                <>
                                    <span className="text-4xl sm:text-5xl font-black text-primary italic">₹{product.offerPrice}</span>
                                    <span className="text-lg sm:text-xl text-gray-400 line-through mb-1">₹{product.price}</span>
                                </>
                            ) : (
                                <span className="text-4xl sm:text-5xl font-black text-dark dark:text-white italic">₹{product.price}</span>
                            )}
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed mb-10">
                            {product.description}
                        </p>

                        <div className="bg-gray-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 mb-10">
                            <div className="flex flex-col sm:flex-row gap-4 text-center">
                                <a
                                    href={`https://wa.me/919492045766?text=I'm interested in buying ${product.name}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-grow py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                                >
                                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" /> Inquiry on WhatsApp
                                </a>
                                <button className="px-8 py-5 bg-white dark:bg-slate-900 text-dark dark:text-white rounded-2xl font-black transition-all hover:bg-gray-100 flex items-center justify-center gap-2 border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Features list */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: <ShieldCheck className="w-5 h-5" />, label: "Live Arrival" },
                                { icon: <Truck className="w-5 h-5" />, label: "Fast Safe" },
                                { icon: <Droplets className="w-5 h-5" />, label: "Eco Pack" }
                            ].map((f, i) => (
                                <div key={i} className="flex flex-col items-center p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <div className="text-primary mb-2">{f.icon}</div>
                                    <span className="text-[10px] font-black uppercase text-gray-500">{f.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section */}
                <section className="mt-24">
                    <div className="flex gap-12 border-b border-gray-100 dark:border-gray-800 mb-12 overflow-x-auto pb-px">
                        {['description', 'care-guide', 'shipping'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-[10px] sm:text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-dark'}`}
                            >
                                {tab.replace('-', ' ')}
                                {activeTab === tab && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl font-medium leading-[2]">
                        <AnimatePresence mode='wait'>
                            {activeTab === 'description' && (
                                <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">{product.description}</p>
                                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">Our {product.name} are sourced from professional breeders and undergo a strict 14 days quarantine period. This ensures they are free from common parasites and ready to adapt to your aquarium environment smoothly.</p>
                                </motion.div>
                            )}
                            {activeTab === 'care-guide' && (
                                <motion.div key="care" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800">
                                        <h4 className="text-2xl font-black text-dark dark:text-white mb-6 italic">Aquarium Expert's Tips</h4>
                                        <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg">
                                            <p className="flex items-center gap-3"><Droplets className="w-5 h-5 text-primary" /> {product.careInstructions || 'Standard tropical care: 24-28°C, pH 7.0'}</p>
                                            <p className="flex items-center gap-3"><Star className="w-5 h-5 text-primary" /> Minimum Tank Size: 15 Gallons recommended</p>
                                            <p className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-primary" /> Diet: High protein flakes/pellets and live bloodworms</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-32">
                        <h2 className="text-4xl font-black text-dark dark:text-white italic mb-12">Related <span className="text-primary italic">Favorites</span></h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
