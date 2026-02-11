import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, MapPin, Phone, Fish, Bot } from 'lucide-react';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0); // 0: Start, 1: Name, 2: Phone, 3: City, 4: Fish, 5: Done
    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        city: '',
        fishEnquiry: ''
    });
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! 🐠 I am your AK Fish Assistant. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newUserMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, newUserMessage]);
        const val = inputValue;
        setInputValue('');

        let nextBotMessage = '';

        if (step === 0) {
            setFormData(prev => ({ ...prev, fishEnquiry: val }));
            nextBotMessage = "Great! To help you better, may I know your name?";
            setStep(1);
        } else if (step === 1) {
            setFormData(prev => ({ ...prev, name: val }));
            nextBotMessage = `Nice to meet you, ${val}! What is your contact number?`;
            setStep(2);
        } else if (step === 2) {
            setFormData(prev => ({ ...prev, contactNumber: val }));
            nextBotMessage = "Got it. Which city are you from?";
            setStep(3);
        } else if (step === 3) {
            const finalData = { ...formData, city: val };
            setFormData(finalData);
            nextBotMessage = "Thank you! I have recorded your inquiry. Our team will contact you shortly. 🌊";
            setStep(4);

            // Submit to Backend
            try {
                await fetch('/api/inquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData)
                });
            } catch (error) {
                console.error("Failed to submit inquiry:", error);
            }
        } else {
            nextBotMessage = "Feel free to ask anything else about our fish collection!";
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot', content: nextBotMessage }]);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="mb-4 w-[350px] md:w-[400px] h-[500px] glass-morphism rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-primary/20"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-accent p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm uppercase">AK Fish Assistant</h3>
                                    <span className="text-white/70 text-[10px] uppercase font-bold">Online & Active</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar bg-white/5">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'bot'
                                            ? 'bg-white/10 text-white rounded-tl-none border border-white/10'
                                            : 'bg-primary text-dark font-bold rounded-tr-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 border-t border-white/10">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-grow bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="p-2.5 bg-primary text-dark rounded-xl hover:bg-accent transition-all disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center group relative overflow-hidden"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    className="z-10"
                >
                    {isOpen ? <X className="w-8 h-8 text-dark" /> : <MessageCircle className="w-8 h-8 text-dark" />}
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-tr from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Pulse Effect */}
                <div className="absolute -inset-2 bg-primary/20 rounded-full animate-pulse -z-10" />
            </motion.button>
        </div>
    );
};

export default AIAssistant;
