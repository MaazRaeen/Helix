import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Loader2, ArrowRight, CheckCircle2, XCircle, AlertCircle, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

function CaseList() {
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await api.get('/cases');
                setCases(res.data);
            } catch (error) {
                console.error("Fetch cases failed, loading local mock data", error);
                const localMock = [
                    {
                        _id: "650000000000000000000001",
                        name: "Rahul Sharma (Rejected -> Approved)",
                        income: 45000,
                        credit_score: 620,
                        initial_result: { decision: "REJECT", probability: 0.42 },
                        updated_state: { decision: "Approved" },
                        createdAt: new Date()
                    },
                    {
                        _id: "650000000000000000000002",
                        name: "Priya Patel (Rejected -> Remains Rejected)",
                        income: 30000,
                        credit_score: 550,
                        initial_result: { decision: "REJECT", probability: 0.28 },
                        updated_state: { decision: "REJECT" },
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <Loader2 className="animate-spin text-primary-600" size={48} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Scanning Decision Ledger...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-600">
                        <Fingerprint size={20} strokeWidth={3} />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Compliance Database</span>
                    </div>
                    <h1 className="text-5xl font-display font-black text-slate-900 tracking-tight">Executive Explorer</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Sub-surface scanning of historical neural decisions</p>
                </div>
                <div className="flex gap-4">
                     <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 hidden lg:block">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Ledger Nodes</p>
                        <p className="text-lg font-black text-slate-900">14 Active</p>
                     </div>
                </div>
            </div>

            {/* Grid */}
            {cases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cases.map((c, idx) => (
                        <motion.div
                            key={c._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate(`/case/${c._id}`)}
                            className="bg-white rounded-[2.5rem] p-10 shadow-card border border-slate-50 hover:border-primary-accent/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Fingerprint size={80} />
                            </div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance ID</p>
                                        <p className="text-[12px] font-black text-slate-900">HLX-{c._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${c.updated_state?.decision === 'Approved' || c.initial_result?.decision === 'APPROVE' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                        {(c.updated_state?.decision === 'Approved' || c.initial_result?.decision === 'APPROVE') ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-display font-black text-slate-900 mb-2 tracking-tight line-clamp-2">
                                    {c.name || 'Anonymous Submission'}
                                </h3>
                                
                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Valuation</span>
                                        <span className="text-sm font-black text-slate-900">₹{c.income?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary-600 font-extrabold text-[12px] uppercase">
                                        Details
                                        <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <AlertCircle size={48} className="text-slate-300 mb-6" />
                    <h3 className="text-xl font-display font-black text-slate-900 mb-2 uppercase tracking-wide">Ledger Empty</h3>
                    <p className="text-slate-500 font-medium">No governance records found in the neural history.</p>
                </div>
            )}
        </div>
    );
}

export default CaseList;
