import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, User } from 'lucide-react';
import axios from 'axios';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Greetings. I am the Helix Oracle. How can I assist you with the Governance Engine today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMsg = { role: 'user', content: message };
        setMessages(prev => [...prev, userMsg]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5070/api/chat', {
                message: userMsg.content,
                history: messages
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I am experiencing a neural link interruption. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[380px] h-[550px] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white flex flex-col overflow-hidden mb-6"
                    >
                        {/* Header */}
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest">Helix Oracle</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Sync Active</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
                        >
                            {messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-600'}`}>
                                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-[13px] leading-relaxed font-medium shadow-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-primary-600 text-white rounded-tr-none' 
                                            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                                        <Loader2 className="animate-spin text-slate-400" size={16} />
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Synthesizing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-6 pt-0">
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder="Query the Oracle..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium focus:ring-2 ring-primary-500/10 outline-none transition-all"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button 
                                    type="submit"
                                    disabled={!message.trim() || isLoading}
                                    className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white rounded-xl hover:bg-primary-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-slate-900 text-white' : 'bg-primary-600 text-white shadow-primary-600/40'}`}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
