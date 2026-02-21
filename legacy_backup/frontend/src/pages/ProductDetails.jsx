import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, Droplets, ChevronLeft, ChevronRight, Share2, Plus, Minus, MessageCircle, Check } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };


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
        <div className="bg-[#071A2F] min-h-screen pb-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-3 text-[10px] font-black text-[#BFEFFF]/20 uppercase tracking-[0.4em] mb-16">
                    <Link to="/" className="hover:text-[#00E5FF] transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/shop" className="hover:text-[#00E5FF] transition-colors">Inventory</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#00E5FF]">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="relative aspect-[16/14] rounded-[4rem] overflow-hidden bg-[#0B2A4A]/20 border border-[#00E5FF]/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex items-center justify-center">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-48 h-48 bg-gradient-to-tr from-[#00C2D1] to-[#071A2F] rounded-[3rem] flex items-center justify-center shadow-2xl transform rotate-6 border border-[#00E5FF]/20">
                                        <span className="text-8xl font-black text-[#BFEFFF] italic">AK</span>
                                    </div>
                                    <span className="mt-8 text-lg font-black text-[#BFEFFF]/20 uppercase tracking-[0.4em]">Fish Farms</span>
                                </motion.div>
                            )}

                            {product.offerPrice && (
                                <div className="absolute top-8 left-8 bg-[#00E5FF] text-[#071A2F] px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase z-10 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                                    - {Math.round((1 - product.offerPrice / product.price) * 100)}% Protocol Save
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F]/60 to-transparent" />
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-full w-fit text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-[#00E5FF]/20">
                            <Droplets className="w-4 h-4" /> {product.category}
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-[#BFEFFF] mb-8 italic uppercase tracking-tighter leading-none">{product.name}</h1>

                        <div className="flex items-center gap-6 mb-10">
                            <div className="flex text-[#00E5FF] items-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-[#00E5FF]" />)}
                                <span className="ml-3 font-black text-[#BFEFFF]/40 text-xs uppercase tracking-widest">5.0 Genetics Rating</span>
                            </div>
                        </div>

                        <div className="flex items-end gap-6 mb-12">
                            {product.offerPrice ? (
                                <>
                                    <span className="text-5xl lg:text-7xl font-black text-[#00E5FF] italic glow-text tracking-tighter">₹{product.offerPrice}</span>
                                    <span className="text-2xl text-[#BFEFFF]/20 line-through mb-2 font-black italic">₹{product.price}</span>
                                </>
                            ) : (
                                <span className="text-5xl lg:text-7xl font-black text-[#BFEFFF] italic tracking-tighter">₹{product.price}</span>
                            )}
                        </div>

                        <p className="text-[#BFEFFF]/60 text-lg font-medium leading-relaxed mb-12 uppercase text-xs tracking-widest">
                            {product.description}
                        </p>

                        {/* Quantity and Buttons */}
                        <div className="flex flex-col gap-10 mb-16">
                            <div className="flex items-center gap-8">
                                <span className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em]">Inventory Qty</span>
                                <div className="flex items-center bg-[#0B2A4A]/40 rounded-2xl border border-[#00E5FF]/10 p-2 shadow-inner">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-[#00E5FF] transition-all text-[#BFEFFF] hover:text-[#071A2F]"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-16 text-center font-black text-2xl text-[#BFEFFF] italic">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-[#00E5FF] transition-all text-[#BFEFFF] hover:text-[#071A2F]"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-grow h-20 bg-[#0B2A4A]/60 border border-[#00E5FF]/20 text-[#BFEFFF] rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:border-[#00E5FF] transition-all active:scale-95 flex items-center justify-center gap-4"
                                >
                                    <ShoppingCart className="w-6 h-6" /> {added ? 'Synchronized' : 'Add to Tank'}
                                </button>
                                <button
                                    onClick={() => {
                                        addToCart({ ...product, quantity });
                                        navigate('/checkout');
                                    }}
                                    className="flex-grow h-20 btn-premium flex items-center justify-center gap-4 text-xs font-black"
                                >
                                    Buy Now <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex items-center gap-6 pt-10 border-t border-[#00E5FF]/10">
                                <a
                                    href={`https://wa.me/919492045766?text=I'm interested in buying ${product.name} from AK Fish Farms`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-4 text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.3em] hover:translate-x-2 transition-transform opacity-60 hover:opacity-100"
                                >
                                    <MessageCircle className="w-5 h-5" /> Technical Coordination via WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Features list */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { icon: <ShieldCheck className="w-6 h-6" />, label: "Live Arrival" },
                                { icon: <Truck className="w-6 h-6" />, label: "Safe Logistics" },
                                { icon: <Droplets className="w-6 h-6" />, label: "Eco Protocol" }
                            ].map((f, i) => (
                                <div key={i} className="flex flex-col items-center p-6 rounded-[2rem] bg-[#0B2A4A]/20 border border-[#00E5FF]/5">
                                    <div className="text-[#00C2D1] mb-3">{f.icon}</div>
                                    <span className="text-[9px] font-black uppercase text-[#BFEFFF]/30 tracking-widest">{f.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section */}
                <section className="mt-40">
                    <div className="flex gap-16 border-b border-[#00E5FF]/10 mb-16 overflow-x-auto pb-px scrollbar-hide">
                        {['description', 'biology-guide', 'logistics'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-6 text-[11px] font-black uppercase tracking-[0.4em] whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]'}`}
                            >
                                {tab.replace('-', ' ')}
                                {activeTab === tab && (
                                    <motion.div layoutId="activeTabDetails" className="absolute bottom-0 left-0 right-0 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.6)]" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl">
                        <AnimatePresence mode='wait'>
                            {activeTab === 'description' && (
                                <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <p className="text-xl text-[#BFEFFF]/60 leading-relaxed font-medium mb-8 uppercase text-xs tracking-widest">{product.description}</p>
                                    <p className="text-xl text-[#BFEFFF]/60 leading-relaxed font-medium uppercase text-xs tracking-widest">Our {product.name} are sourced from elite breeders and undergo an rigorous biological quarantine at AK Fish Farms. This ensures maximum health and seamless adaptation to your aquatic ecosystem.</p>
                                </motion.div>
                            )}
                            {activeTab === 'biology-guide' && (
                                <motion.div key="care" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <div className="bg-[#0B2A4A]/40 p-12 lg:p-16 rounded-[4rem] border border-[#00E5FF]/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/5 blur-[80px] group-hover:bg-[#00E5FF]/10 transition-colors" />
                                        <h4 className="text-3xl font-black text-[#BFEFFF] mb-10 italic uppercase tracking-tighter">Species <span className="text-[#00E5FF]">Parameters</span></h4>
                                        <div className="space-y-8 text-[#BFEFFF]/60 font-black text-xs uppercase tracking-widest">
                                            <p className="flex items-center gap-5 bg-[#071A2F]/40 p-6 rounded-2xl border border-[#00E5FF]/5"><Droplets className="w-6 h-6 text-[#00E5FF]" /> Thermal Range: 24-28°C | Optimal pH 7.0 </p>
                                            <p className="flex items-center gap-5 bg-[#071A2F]/40 p-6 rounded-2xl border border-[#00E5FF]/5"><Star className="w-6 h-6 text-[#00E5FF]" /> Minimum Volume: 15 Gallons recommended </p>
                                            <p className="flex items-center gap-5 bg-[#071A2F]/40 p-6 rounded-2xl border border-[#00E5FF]/5"><ShieldCheck className="w-6 h-6 text-[#00E5FF]" /> Nutrition: AK Premium High Protein Diet </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-40">
                        <div className="flex items-end justify-between mb-16 px-2">
                            <h2 className="text-4xl lg:text-6xl font-black text-[#BFEFFF] italic uppercase tracking-tighter">Similar <span className="text-[#00E5FF] italic">Species</span></h2>
                            <Link to="/shop" className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.4em] hover:translate-x-2 transition-transform">Browse All</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
