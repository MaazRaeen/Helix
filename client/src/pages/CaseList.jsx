import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Loader2, ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
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

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary-500" size={40} />
                <p className="text-corporate-muted font-medium">Loading Case Repository...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-corporate-text">Case Explorer</h1>
                    <p className="text-corporate-muted mt-1">Select an automated decision to review or contest.</p>
                </div>
                <div className="text-sm font-medium text-corporate-muted bg-white px-4 py-2 rounded-full border border-slate-200">
                   Total: {cases.length} Recent Applications
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cases.map((item, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={item._id}
                        onClick={() => onSelect(item._id)}
                        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-premium hover:border-primary-500/50 cursor-pointer transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                {item.initial_result.decision === 'APPROVE' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                                item.initial_result.decision === 'APPROVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                                {item.initial_result.decision}
                            </div>
                        </div>

                        <h3 className="font-display font-bold text-lg text-corporate-text group-hover:text-primary-600 transition-colors">{item.name}</h3>
                        <p className="text-xs text-corporate-muted mt-1">Application ID: {item._id.slice(-8).toUpperCase()}</p>
                        
                        <div className="mt-6 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-corporate-muted font-bold">Confidence</p>
                                <p className="text-xl font-display font-bold text-corporate-text">
                                    {(item.initial_result.probability * 100).toFixed(0)}%
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-corporate-muted font-bold">Income</p>
                                <p className="text-sm font-semibold text-corporate-text">₹{item.income.toLocaleString()}</p>
                            </div>
                        </div>

                        {item.initial_result.probability >= 0.55 && item.initial_result.probability <= 0.65 && (
                            <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 italic text-xs">
                                <AlertCircle size={14} />
                                Human review recommended
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-primary-600 font-bold text-sm">
                            View Analysis
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default CaseList;
