import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Phone, Save, Edit2, LogOut, Package, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout, updateUserProfile } = useAuth();
    const [editing, setEditing] = useState(false);

    // ... (lines 10-153 omitted or assumed unchanged, I should only target the button click and destructuring) 

    // Actually I can't skip lines in replacement content easily if I am replacing a block.
    // Let's replace the top destructuring and the save button separately using multi_replace_file_content.
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.address?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        zip: user?.address?.zip || ''
    });

    const handleSave = async () => {
        // Construct the update object
        const updates = {
            name: formData.name,
            phoneNumber: formData.phone, // mapping phone to phoneNumber
            address: {
                street: formData.street,
                city: formData.city,
                zip: formData.zip,
                phone: formData.phone
            }
        };
        updateUserProfile(updates);
        setEditing(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-main p-8">
                <div className="bg-white dark:bg-slate-900 p-16 rounded-[4rem] text-center shadow-3xl">
                    <User className="w-20 h-20 text-gray-200 mx-auto mb-8" />
                    <h2 className="text-3xl font-black italic mb-6">Access Required</h2>
                    <p className="text-gray-500 mb-10">Please login to view your aquatic profile.</p>
                    <Link to="/login" className="px-12 py-5 bg-primary text-white rounded-[2rem] font-black italic shadow-xl">Login Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#071A2F] min-h-screen pb-32 pt-32" >
            <div className="max-w-6xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Left Panel: Profile Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-[#0B2A4A]/80 backdrop-blur-3xl rounded-[4rem] p-12 border border-[#00E5FF]/20 shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden text-center group">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#00E5FF]/10 to-transparent" />
                            <div className="relative mt-12 mb-10">
                                <div className="w-40 h-40 rounded-[3rem] bg-[#071A2F] p-3 shadow-2xl mx-auto border-4 border-[#00E5FF]/20 overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                    <div className="w-full h-full bg-gradient-to-br from-[#00C2D1] to-[#071A2F] flex items-center justify-center text-[#BFEFFF] font-black text-6xl italic">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-1/2 translate-x-16 p-3 bg-[#00E5FF] rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.4)] text-[#071A2F]">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                            </div>

                            <h2 className="text-4xl font-black text-[#BFEFFF] italic mb-3 uppercase tracking-tighter">{user?.name}</h2>
                            <p className="text-[10px] font-black text-[#00E5FF]/40 uppercase tracking-[0.4em] mb-12">{user?.email || user?.phone}</p>

                            <div className="space-y-5">
                                <Link to="/my-orders" className="w-full p-7 rounded-[2.5rem] bg-[#071A2F]/60 border border-[#00E5FF]/10 hover:border-[#00E5FF]/40 hover:bg-[#071A2F] transition-all flex items-center justify-between group/link shadow-lg">
                                    <div className="flex items-center gap-5">
                                        <Package className="text-[#00E5FF] w-7 h-7" />
                                        <span className="font-black text-xs text-[#BFEFFF] uppercase tracking-widest">Order History</span>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-[#00E5FF]/30 group-hover/link:translate-x-2 group-hover/link:text-[#00E5FF] transition-all" />
                                </Link>
                                <button onClick={logout} className="w-full p-7 rounded-[2.5rem] border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-5 font-black text-xs uppercase tracking-widest shadow-lg">
                                    <LogOut className="w-7 h-7" />
                                    <span>Terminate Session</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#0B2A4A] to-[#071A2F] text-[#BFEFFF] p-12 rounded-[4rem] shadow-2xl relative overflow-hidden border border-[#00C2D1]/10 group">
                            <h4 className="text-2xl font-black mb-6 italic uppercase tracking-tighter">Support <span className="text-[#00E5FF]">Node</span></h4>
                            <p className="text-[#BFEFFF]/40 font-medium mb-12 text-sm leading-relaxed uppercase tracking-widest">Our biological experts are active and ready to handle your technical inquiries.</p>
                            <a href="https://wa.me/919492045766" className="w-full py-6 btn-premium flex items-center justify-center gap-4 text-xs font-black">
                                <Phone className="w-5 h-5" /> Coordinate via WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Right Panel: Settings / Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0B2A4A]/80 backdrop-blur-3xl rounded-[4rem] p-12 lg:p-16 border border-[#00E5FF]/20 shadow-[0_30px_100px_rgba(0,0,0,0.5)] h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 blur-[120px] rounded-full pointer-events-none" />

                            <div className="flex justify-between items-center mb-16 relative z-10">
                                <h3 className="text-4xl font-black text-[#BFEFFF] italic uppercase tracking-tighter">Profile <span className="text-[#00E5FF] animate-pulse">Parameters</span></h3>
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-xl ${editing ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-[#00E5FF] text-[#071A2F] hover:scale-105 active:scale-95'}`}
                                >
                                    {editing ? 'Abort Changes' : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
                                </button>
                            </div>

                            <form className="space-y-16 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-5">
                                        <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-4 block">Identity Label</label>
                                        <div className="relative group">
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-7 rounded-[2rem] bg-[#071A2F]/60 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 font-bold text-[#BFEFFF] disabled:opacity-40 transition-all outline-none shadow-inner"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <User className="absolute right-7 top-1/2 -translate-y-1/2 text-[#00E5FF]/20 w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="space-y-5">
                                        <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-4 block">Secure Comms Line</label>
                                        <div className="relative group">
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-7 rounded-[2rem] bg-[#071A2F]/60 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 font-bold text-[#BFEFFF] disabled:opacity-40 transition-all outline-none shadow-inner"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                            <Phone className="absolute right-7 top-1/2 -translate-y-1/2 text-[#00E5FF]/20 w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex items-center gap-6">
                                        <h4 className="text-xs font-black text-[#00E5FF] uppercase tracking-[0.5em] whitespace-nowrap italic">Logistics Destination</h4>
                                        <div className="h-px w-full bg-gradient-to-r from-[#00E5FF]/20 to-transparent" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="md:col-span-2 space-y-5">
                                            <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-4 block">Street Protocol</label>
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-7 rounded-[2rem] bg-[#071A2F]/60 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 font-bold text-[#BFEFFF] disabled:opacity-40 transition-all outline-none shadow-inner"
                                                value={formData.street}
                                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-5">
                                            <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-4 block">Aquatic Hub (City)</label>
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-7 rounded-[2rem] bg-[#071A2F]/60 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 font-bold text-[#BFEFFF] disabled:opacity-40 transition-all outline-none shadow-inner"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-5">
                                            <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-4 block">Sector Code (ZIP)</label>
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-7 rounded-[2rem] bg-[#071A2F]/60 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 font-bold text-[#BFEFFF] disabled:opacity-40 transition-all outline-none shadow-inner"
                                                value={formData.zip}
                                                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {editing && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        type="button"
                                        onClick={handleSave}
                                        className="w-full py-8 btn-premium flex items-center justify-center gap-4 text-xs font-black shadow-[0_20px_50px_rgba(0,229,255,0.3)] mt-12"
                                    >
                                        <Save className="w-6 h-6" /> Authenticate Changes
                                    </motion.button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Profile;
