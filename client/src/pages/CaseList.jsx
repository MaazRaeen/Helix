import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Loader2, ArrowRight, CheckCircle2, XCircle, AlertCircle, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

function CaseList({ onSelect }) {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await api.get('/cases');
                setCases(res.data);
            } catch (error) {
                console.error("Fetch cases failed, loading local mock data", error);
                // Fallback to local mock data for hackathon demo stability
                const localMock = [
                    {
                        _id: "650000000000000000000001",
                        name: "Rahul Sharma (Rejected -> Approved)",
                        income: 45000,
                        credit_score: 620,
                        employment_length: 12,
                        existing_debt: 20000,
                        bank_balance: 5000,
                        initial_result: { decision: "REJECT", probability: 0.42, topFactors: [{feature: "credit_score", impact: "negative", contribution: -1.2}] },
                        createdAt: new Date()
                    },
                    {
                        _id: "650000000000000000000002",
                        name: "Priya Patel (Rejected -> Remains Rejected)",
                        income: 30000,
                        credit_score: 550,
                        employment_length: 6,
                        existing_debt: 40000,
                        bank_balance: 2000,
                        initial_result: { decision: "REJECT", probability: 0.28, topFactors: [{feature: "existing_debt", impact: "negative", contribution: -2.1}] },
                        createdAt: new Date()
                    },
                    {
                        _id: "650000000000000000000003",
                        name: "Amit Das (Borderline Case)",
                        income: 55000,
                        credit_score: 640,
                        employment_length: 24,
                        existing_debt: 15000,
                        bank_balance: 8000,
                        initial_result: { decision: "REJECT", probability: 0.58, topFactors: [{feature: "bank_balance", impact: "positive", contribution: 0.8}] },
                        createdAt: new Date()
                    }
                ];
                setCases(localMock);
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="animate-spin text-primary-600" size={48} />
                    <div className="absolute inset-0 blur-xl bg-primary-400/20 animate-pulse" />
                </div>
                <p className="text-slate-400 font-bold tracking-widest text-xs uppercase animate-pulse">Initializing Neural Link...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
            >
                {cases.map((item, index) => (
                    <motion.div 
                        variants={itemVariants}
                        key={item._id}
                        onClick={() => onSelect(item._id)}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="glass rounded-[2rem] p-8 shadow-premium hover:shadow-glow hover:border-primary-400 group cursor-pointer relative overflow-hidden transition-all border-white/40"
                    >
                        {/* Decorative Gradient Glow */}
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary-600/5 blur-2xl rounded-full group-hover:bg-primary-600/10 transition-colors" />
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                item.initial_result.decision === 'APPROVE' 
                                ? 'bg-emerald-50 text-emerald-500 shadow-emerald-100 group-hover:bg-emerald-500 group-hover:text-white' 
                                : 'bg-rose-50 text-rose-500 shadow-rose-100 group-hover:bg-rose-500 group-hover:text-white'
                            }`}>
                                {item.initial_result.decision === 'APPROVE' ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                            </div>
                            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                                item.initial_result.decision === 'APPROVE' 
                                ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' 
                                : 'bg-rose-50/50 text-rose-600 border-rose-100'
                            }`}>
                                {item.initial_result.decision}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <Fingerprint size={12} className="text-slate-300" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UID: {item._id.slice(-8)}</p>
                            </div>
                            
                            <div className="mt-10 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Confidence</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-display font-black text-slate-900">
                                            {(item.initial_result.probability * 100).toFixed(0)}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">%</span>
                                    </div>
                                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.initial_result.probability * 100}%` }}
                                            transition={{ delay: 0.5, duration: 1 }}
                                            className={`h-full rounded-full ${item.initial_result.probability > 0.5 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                                        />
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Income</p>
                                    <p className="text-lg font-black text-slate-900 tracking-tight">₹{item.income.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg inline-block">High Tier</p>
                                </div>
                            </div>

                            {item.initial_result.probability >= 0.55 && item.initial_result.probability <= 0.65 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-6 flex items-center gap-2 text-amber-600 bg-amber-50/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-amber-100 font-bold text-[11px] italic"
                                >
                                    <AlertCircle size={16} />
                                    Review Recommended
                                </motion.div>
                            )}

                            <div className="mt-8 pt-8 border-t border-slate-100/50 flex items-center justify-between text-primary-600 font-black text-xs uppercase tracking-widest">
                                <span className="flex items-center gap-2">
                                    Analyze Impact
                                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse" />
                                </span>
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-600 to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export default CaseList;
