import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ShieldCheck, Search, Filter, ExternalLink, Download, Pencil, X, Zap, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const LedgerPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState([]);
    const [editCase, setEditCase] = useState(null);       // case being edited
    const [editForm, setEditForm] = useState({});           // form data for editing
    const [submitting, setSubmitting] = useState(false);    // re-evaluation in progress
    const [editResult, setEditResult] = useState(null);     // result after re-evaluation
    const [oldResult, setOldResult] = useState(null);       // previous result for comparison
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCases();
    }, []);

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

    const getStatusColor = (decision) => {
        const isApproved = decision?.toLowerCase().startsWith('approve');
        return isApproved ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' : 'text-rose-500 bg-rose-50 border border-rose-200';
    };

    const isApprovedDecision = (d) => d?.toLowerCase().startsWith('approve');

    const openEditPanel = (item) => {
        const state = item.updated_state || {};
        const decision = state.decision || item.initial_result?.decision;
        const probability = state.probability || item.initial_result?.probability || 0;
        setOldResult({ decision, probability });
        setEditForm({
            name: item.name || '',
            income: (state.income || item.income || '').toString(),
            coapplicant_income: (state.coapplicant_income || item.coapplicant_income || 0).toString(),
            credit_score: (state.credit_score || item.credit_score || '').toString(),
            loan_amount: (state.loan_amount || item.loan_amount || '').toString(),
            loan_term: (state.loan_term || item.loan_term || 360).toString(),
            gender: state.gender || item.gender || 'Male',
            married: state.married || item.married || 'No',
            dependents: state.dependents || item.dependents || '0',
            education: state.education || item.education || 'Graduate',
            self_employed: state.self_employed || item.self_employed || 'No',
            property_area: state.property_area || item.property_area || 'Semiurban',
        });
        setEditResult(null);
        setEditCase(item);
    };

    const handleReEvaluate = async () => {
        if (!editCase) return;
        setSubmitting(true);
        setEditResult(null);

        try {
            const updatedData = {
                name: editForm.name,
                income: parseFloat(editForm.income),
                coapplicant_income: parseFloat(editForm.coapplicant_income),
                credit_score: parseFloat(editForm.credit_score),
                loan_amount: parseFloat(editForm.loan_amount),
                loan_term: parseFloat(editForm.loan_term),
                gender: editForm.gender,
                married: editForm.married,
                dependents: editForm.dependents,
                education: editForm.education,
                self_employed: editForm.self_employed,
                property_area: editForm.property_area,
            };

            const res = await axios.post(`http://localhost:5070/api/re-evaluate/${editCase._id}`, { updatedData });
            setEditResult(res.data);

            // Refresh the cases list to show updated data
            await fetchCases();
        } catch (error) {
            console.error("Re-evaluation failed:", error);
            alert("Re-evaluation failed. Please check the server.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCases = cases.filter(c => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const id = `HLX-${c._id.slice(-8).toUpperCase()}`.toLowerCase();
        const name = (c.name || '').toLowerCase();
        return id.includes(term) || name.includes(term);
    });

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Name or ID..." 
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
                        {filteredCases.map((item, idx) => {
                            const decision = item.updated_state?.decision || item.initial_result?.decision;
                            const probability = item.updated_state?.probability || item.initial_result?.probability || 0;
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
                                                    className={`h-full rounded-full ${isApprovedDecision(decision) ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${probability * 100}%` }}
                                                />
                                            </div>
                                            <span className={`text-[10px] font-black italic ${isApprovedDecision(decision) ? 'text-emerald-500' : 'text-rose-400'}`}>
                                                {(probability * 100).toFixed(1)}% Signal
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditPanel(item);
                                                }}
                                                className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 transition-all shadow-sm"
                                                title="Edit & Re-evaluate"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/decision/${item._id}`);
                                                }}
                                                className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary-600 hover:border-primary-600 transition-all shadow-sm"
                                                title="View Decision Details"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
                
                {filteredCases.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">No Records Found</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            {searchTerm ? 'No cases match your search criteria.' : 'No governance records have been committed to the neural chain yet.'}
                        </p>
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

            {/* =============== EDIT SLIDE-OVER PANEL =============== */}
            <AnimatePresence>
                {editCase && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                            onClick={() => { setEditCase(null); setEditResult(null); }}
                        />
                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 z-50 h-full w-full max-w-[560px] bg-white shadow-2xl border-l border-slate-100 overflow-y-auto"
                        >
                            {/* Panel Header */}
                            <div className="sticky top-0 bg-white z-10 px-8 pt-8 pb-6 border-b border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">Re-Evaluate Case</p>
                                        <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">{editForm.name || 'Edit Application'}</h2>
                                        <code className="text-[10px] font-bold text-slate-400 mt-1 block">HLX-{editCase._id.slice(-8).toUpperCase()}</code>
                                    </div>
                                    <button 
                                        onClick={() => { setEditCase(null); setEditResult(null); }}
                                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-slate-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="px-8 py-6 space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Full Name</label>
                                    <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                                        className="input-base" />
                                </div>

                                {/* Row: Income + Co-applicant */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Monthly Income (₹)</label>
                                        <input type="number" value={editForm.income} onChange={e => setEditForm({...editForm, income: e.target.value})}
                                            className="input-base" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Co-applicant Income</label>
                                        <input type="number" value={editForm.coapplicant_income} onChange={e => setEditForm({...editForm, coapplicant_income: e.target.value})}
                                            className="input-base" />
                                    </div>
                                </div>

                                {/* Row: Credit Score + Loan Amount */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Credit History</label>
                                        <select value={editForm.credit_score} onChange={e => setEditForm({...editForm, credit_score: e.target.value})}
                                            className="input-base">
                                            <option value="1">✅ Has Credit History (Good)</option>
                                            <option value="0">❌ No Credit History (Bad)</option>
                                        </select>
                                        <p className="text-[9px] text-amber-600 font-bold mt-1">⚡ Strongest factor in the model</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Loan Amount (₹)</label>
                                        <input type="number" value={editForm.loan_amount} onChange={e => setEditForm({...editForm, loan_amount: e.target.value})}
                                            className="input-base" />
                                    </div>
                                </div>

                                {/* Row: Gender + Married */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Gender</label>
                                        <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}
                                            className="input-base">
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Married</label>
                                        <select value={editForm.married} onChange={e => setEditForm({...editForm, married: e.target.value})}
                                            className="input-base">
                                            <option>Yes</option>
                                            <option>No</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Row: Dependents + Education */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Dependents</label>
                                        <select value={editForm.dependents} onChange={e => setEditForm({...editForm, dependents: e.target.value})}
                                            className="input-base">
                                            <option>0</option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Education</label>
                                        <select value={editForm.education} onChange={e => setEditForm({...editForm, education: e.target.value})}
                                            className="input-base">
                                            <option>Graduate</option>
                                            <option>Not Graduate</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Row: Self Employed + Property Area */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Self Employed</label>
                                        <select value={editForm.self_employed} onChange={e => setEditForm({...editForm, self_employed: e.target.value})}
                                            className="input-base">
                                            <option>No</option>
                                            <option>Yes</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Property Area</label>
                                        <select value={editForm.property_area} onChange={e => setEditForm({...editForm, property_area: e.target.value})}
                                            className="input-base">
                                            <option>Urban</option>
                                            <option>Semiurban</option>
                                            <option>Rural</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Loan Term */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Loan Term (Months)</label>
                                    <select value={editForm.loan_term} onChange={e => setEditForm({...editForm, loan_term: e.target.value})}
                                        className="input-base">
                                        <option value="360">360 Months (30 Years)</option>
                                        <option value="240">240 Months (20 Years)</option>
                                        <option value="180">180 Months (15 Years)</option>
                                        <option value="120">120 Months (10 Years)</option>
                                        <option value="60">60 Months (5 Years)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Result Card — Before vs After comparison */}
                            <AnimatePresence>
                                {editResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mx-8 mb-6 space-y-4"
                                    >
                                        {/* Before → After Comparison */}
                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Comparison</p>
                                            <div className="flex items-center gap-4">
                                                {/* OLD */}
                                                <div className={`flex-1 text-center p-4 rounded-xl border ${
                                                    isApprovedDecision(oldResult?.decision) ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                                                }`}>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Before</p>
                                                    <p className={`text-lg font-black ${isApprovedDecision(oldResult?.decision) ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {(oldResult?.probability * 100).toFixed(1)}%
                                                    </p>
                                                    <p className={`text-[10px] font-black ${isApprovedDecision(oldResult?.decision) ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {oldResult?.decision}
                                                    </p>
                                                </div>

                                                {/* Arrow */}
                                                {(() => {
                                                    const oldP = (oldResult?.probability || 0) * 100;
                                                    const newP = (editResult.updated_state?.probability || 0) * 100;
                                                    const delta = newP - oldP;
                                                    return (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-2xl">→</span>
                                                            <span className={`text-[11px] font-black ${
                                                                delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-500' : 'text-slate-400'
                                                            }`}>
                                                                {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    );
                                                })()}

                                                {/* NEW */}
                                                <div className={`flex-1 text-center p-4 rounded-xl border-2 ${
                                                    isApprovedDecision(editResult.updated_state?.decision) ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
                                                }`}>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">After</p>
                                                    <p className={`text-lg font-black ${isApprovedDecision(editResult.updated_state?.decision) ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {(editResult.updated_state?.probability * 100).toFixed(1)}%
                                                    </p>
                                                    <p className={`text-[10px] font-black ${isApprovedDecision(editResult.updated_state?.decision) ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {editResult.updated_state?.decision}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* New Result Card */}
                                        <div className={`rounded-2xl p-6 border-2 ${
                                            isApprovedDecision(editResult.updated_state?.decision) 
                                                ? 'bg-emerald-50 border-emerald-200' 
                                                : 'bg-rose-50 border-rose-200'
                                        }`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    {isApprovedDecision(editResult.updated_state?.decision) 
                                                        ? <CheckCircle2 size={28} className="text-emerald-500" />
                                                        : <XCircle size={28} className="text-rose-500" />
                                                    }
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Updated Verdict</p>
                                                        <p className={`text-xl font-black ${
                                                            isApprovedDecision(editResult.updated_state?.decision) ? 'text-emerald-600' : 'text-rose-600'
                                                        }`}>
                                                            {editResult.updated_state?.decision}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confidence</p>
                                                    <p className={`text-3xl font-black ${
                                                        isApprovedDecision(editResult.updated_state?.decision) ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}>
                                                        {(editResult.updated_state?.probability * 100).toFixed(1)}%
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Top Factors */}
                                            {editResult.initial_result?.topFactors && (
                                                <div className="mt-4 pt-4 border-t border-slate-200/50 space-y-2">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Key Factors</p>
                                                    {editResult.initial_result.topFactors.slice(0, 3).map((f, i) => (
                                                        <div key={i} className="flex items-center justify-between">
                                                            <span className="text-[11px] font-black text-slate-700">{f.feature}</span>
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                                                f.impact === 'positive' 
                                                                    ? 'text-emerald-600 bg-emerald-100' 
                                                                    : 'text-rose-500 bg-rose-100'
                                                            }`}>
                                                                {f.impact === 'positive' ? '↑' : '↓'} {Math.abs(f.contribution * 100).toFixed(0)}%
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-8 py-6 flex gap-3">
                                <button
                                    onClick={() => { setEditCase(null); setEditResult(null); }}
                                    className="flex-1 py-4 px-6 rounded-xl bg-slate-50 text-slate-600 font-black text-sm border border-slate-100 hover:bg-slate-100 transition-colors"
                                >
                                    {editResult ? 'Close' : 'Cancel'}
                                </button>
                                <button
                                    onClick={handleReEvaluate}
                                    disabled={submitting}
                                    className="flex-1 py-4 px-6 rounded-xl bg-amber-500 text-white font-black text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={18} />
                                            {editResult ? 'Re-Evaluate Again' : 'Re-Evaluate'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LedgerPage;
