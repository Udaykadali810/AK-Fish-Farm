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
        <div className="bg-bg-main min-h-screen pb-24" >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Panel: Profile Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden text-center">
                            <div className="absolute top-0 left-0 w-full h-32 aquatic-gradient" />
                            <div className="relative mt-12 mb-8">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl mx-auto border-4 border-white dark:border-slate-900 overflow-hidden">
                                    <div className="w-full h-full aquatic-gradient flex items-center justify-center text-white font-black text-5xl italic">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-primary border border-gray-100 dark:border-gray-700">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-dark dark:text-white italic mb-2">{user.name}</h2>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10">{user.email}</p>

                            <div className="space-y-4">
                                <Link to="/my-orders" className="w-full p-6 rounded-3xl bg-gray-50 dark:bg-slate-800 hover:bg-primary/5 dark:hover:bg-primary/20 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <Package className="text-primary w-6 h-6" />
                                        <span className="font-bold text-sm">My Orders</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button onClick={logout} className="w-full p-6 rounded-3xl text-red-500 hover:bg-red-50 transition-all flex items-center gap-4 font-bold text-sm">
                                    <LogOut className="w-6 h-6" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-dark text-white p-10 rounded-[3.5rem] shadow-xl relative overflow-hidden">
                            <h4 className="text-xl font-black mb-4 italic">Need Help?</h4>
                            <p className="text-blue-100/60 font-medium mb-10 text-sm leading-relaxed">Our experts are available to assist with your order or provide tailored fish care advice.</p>
                            <a href="https://wa.me/919492045766" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm">
                                Chat With Us
                            </a>
                        </div>
                    </div>

                    {/* Right Panel: Settings / Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-12 lg:p-16 shadow-2xl border border-gray-100 dark:border-gray-800 h-full">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-3xl font-black text-dark dark:text-white italic">Saved <span className="text-primary italic">Details</span></h3>
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className={`px-8 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${editing ? 'bg-red-50 text-red-500' : 'bg-primary text-white'}`}
                                >
                                    {editing ? 'Cancel Editing' : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
                                </button>
                            </div>

                            <form className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Full Account Name</label>
                                        <div className="relative group">
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white disabled:opacity-60 transition-all"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <User className="absolute right-5 top-5 text-gray-300 w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Primary Phone</label>
                                        <div className="relative group">
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white disabled:opacity-60 transition-all"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                            <Phone className="absolute right-5 top-5 text-gray-300 w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h4 className="text-sm font-black text-dark dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-4">Default Shipping Address</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="md:col-span-2 space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Street Address</label>
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white disabled:opacity-60 transition-all"
                                                value={formData.street}
                                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">City / Colony</label>
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white disabled:opacity-60 transition-all"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">ZIP / PIN Code</label>
                                            <input
                                                disabled={!editing}
                                                type="text"
                                                className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white disabled:opacity-60 transition-all"
                                                value={formData.zip}
                                                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {editing && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        type="button"
                                        onClick={handleSave}
                                        className="w-full py-6 bg-secondary text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Save className="w-6 h-6" /> Save Profile Changes
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
