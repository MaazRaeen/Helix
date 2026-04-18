import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { History, ShieldCheck, Search, Filter, ArrowRight, ExternalLink, Download } from 'lucide-react';

const LedgerPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState([]);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await axios.get('http://localhost:5070/api/cases');
                setCases(response.data);
            } catch (error) {
                console.error("Ledger fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    const getStatusColor = (decision) => {
        return decision === 'Approved' ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="animate-spin h-12 w-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Decrypting Ledger History...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary-600">
                        <History size={20} className="stroke-[3]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Historical Audit Trail</span>
                    </div>
                    <h1 className="text-5xl font-display font-black text-slate-900 tracking-tight">Decision Ledger</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Secure Record of Neural Authorizations</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            placeholder="Search by Compliance ID..." 
                            className="bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:ring-2 ring-primary-500/10 min-w-[300px]"
                        />
                    </div>
                    <button className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                        <Filter size={20} className="text-slate-600" />
                    </button>
                    <button className="btn-primary px-8 py-4 flex items-center gap-2">
                        <Download size={18} />
                        Export Audit CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                            <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Compliance ID</th>
                            <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Dossier Label</th>
                            <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Neural Result</th>
                            <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Confidence</th>
                            <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {cases.map((item, idx) => {
                            const decision = item.updated_state?.decision || item.initial_result?.decision;
                            const complianceId = `HLX-${item._id.slice(-8).toUpperCase()}`;
                            return (
                                <motion.tr 
                                    key={item._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                    onClick={() => navigate(`/decision/${item._id}`)}
                                >
                                    <td className="px-10 py-8">
                                        <p className="text-sm font-black text-slate-900 leading-none mb-1">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <code className="bg-slate-100 px-3 py-1 rounded-lg text-[11px] font-black text-slate-600">
                                            {complianceId}
                                        </code>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="text-sm font-black text-slate-900">{item.name || 'Anonymous Submission'}</p>
                                        <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest mt-1">Prime Entity</p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(decision)}`}>
                                            {decision}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-2">
                                            <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-slate-900 rounded-full" 
                                                    style={{ width: `${item.updated_state?.probability * 100 || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 italic">
                                                {(item.updated_state?.probability * 100).toFixed(1)}% Signal
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/decision/${item._id}`);
                                            }}
                                            className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary-600 hover:border-primary-600 transition-all shadow-sm"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {cases.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">Ledger is Empty</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">No governance records have been committed to the neural chain yet.</p>
                    </div>
                )}
            </div>
            
            <div className="flex justify-center flex-col items-center gap-4">
                 <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Helix Neural Integrity: SECURE (99.99%)</span>
                 </div>
                 <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">Decentralized Consensus Protocol active v2.1.0-audit-alpha</p>
            </div>
        </div>
    );
};

export default LedgerPage;
