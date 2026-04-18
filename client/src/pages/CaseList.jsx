import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Loader2, ArrowRight, CheckCircle2, XCircle, AlertCircle, Fingerprint, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function CaseList() {
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

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

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await api.delete(`/cases/${deleteTarget.id}`);
            setCases(prev => prev.filter(c => c._id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete case. Please try again.");
            setDeleteTarget(null);
        }
    };

    const isApproved = (c) => {
        const d = c.updated_state?.decision || c.initial_result?.decision || '';
        return d.toLowerCase().startsWith('approve');
    };

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
                        <p className="text-lg font-black text-slate-900">{cases.length} Active</p>
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
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-card border border-slate-50 hover:border-primary-accent/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Fingerprint size={80} />
                            </div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="space-y-2" onClick={() => navigate(`/case/${c._id}`)}>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance ID</p>
                                        <p className="text-[12px] font-black text-slate-900">HLX-{c._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteTarget({ id: c._id, name: c.name || 'Anonymous' });
                                            }}
                                            className="p-3 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete this case"
                                        >
                                            <Trash2 size={16} strokeWidth={2.5} />
                                        </button>
                                        {/* Status Icon */}
                                        <div className={`p-4 rounded-2xl ${isApproved(c) ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                            {isApproved(c) ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                        </div>
                                    </div>
                                </div>

                                <h3 
                                    className="text-2xl font-display font-black text-slate-900 mb-2 tracking-tight line-clamp-2"
                                    onClick={() => navigate(`/case/${c._id}`)}
                                >
                                    {c.name || 'Anonymous Submission'}
                                </h3>
                                
                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between" onClick={() => navigate(`/case/${c._id}`)}>
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        onClick={() => setDeleteTarget(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[2rem] p-10 shadow-2xl max-w-md w-full mx-4 border border-slate-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                                    <Trash2 size={28} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-black text-slate-900">Delete Record</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permanent Action</p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-2">
                                Are you sure you want to permanently delete the following record?
                            </p>
                            <div className="bg-slate-50 rounded-xl px-5 py-4 border border-slate-100 mb-8">
                                <p className="text-sm font-black text-slate-900">{deleteTarget.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">ID: {deleteTarget.id}</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="flex-1 py-4 px-6 rounded-xl bg-slate-50 text-slate-600 font-black text-sm border border-slate-100 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-4 px-6 rounded-xl bg-rose-500 text-white font-black text-sm hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                                >
                                    Delete Permanently
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default CaseList;
