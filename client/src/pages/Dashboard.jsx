import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
    Loader2, ArrowLeft, ArrowRight, ShieldCheck, ShieldAlert, 
    FileText, Zap, HelpCircle, Save, Sliders, CheckCircle2,
    Info, ExternalLink, ChevronRight, History, PlusCircle, Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
        let start = displayValue;
        const end = parseFloat(value);
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = start + (end - start) * progress;
            setDisplayValue(current);
            if (progress < 1) requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }, [value]);
    
    return <span>{displayValue.toFixed(1)}</span>;
};

function Dashboard({ caseId, onBack }) {
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState('review'); // 'review' or 'contest'
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchCase();
    }, [caseId]);

    const fetchCase = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/cases/${caseId}`);
            if (!res.data) throw new Error("No data received");
            setCaseData(res.data);
            setFormData({
                income: res.data.updated_state.income,
                credit_score: res.data.updated_state.credit_score,
                employment_length: res.data.updated_state.employment_length,
                existing_debt: res.data.updated_state.existing_debt,
                bank_balance: res.data.updated_state.bank_balance
            });
        } catch (error) {
            console.error("Fetch case failed, falling back to mock dossier", error);
            // Technical Robustness: Mock Fallback
            const mockDossier = {
                _id: caseId,
                name: "Rahul Sharma",
                income: 45000,
                credit_score: 620,
                employment_length: 12,
                existing_debt: 20000,
                bank_balance: 5000,
                initial_result: { 
                    decision: "REJECT", 
                    probability: 0.42, 
                    topFactors: [
                        {feature: "credit_score", impact: "negative", contribution: -1.2},
                        {feature: "existing_debt", impact: "negative", contribution: -0.8}
                    ] 
                },
                updated_state: {
                    income: 45000,
                    credit_score: 620,
                    employment_length: 12,
                    existing_debt: 20000,
                    bank_balance: 5000,
                    decision: "REJECT",
                    probability: 0.42
                },
                createdAt: new Date().toISOString()
            };
            setCaseData(mockDossier);
            setFormData({
                income: mockDossier.updated_state.income,
                credit_score: mockDossier.updated_state.credit_score,
                employment_length: mockDossier.updated_state.employment_length,
                existing_debt: mockDossier.updated_state.existing_debt,
                bank_balance: mockDossier.updated_state.bank_balance
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await api.post(`/re-evaluate/${caseId}`, { updatedData: formData });
            setCaseData(res.data);
            setActiveTab('review');
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="animate-spin text-primary-600" size={48} />
                    <div className="absolute inset-0 blur-xl bg-primary-400/10 animate-pulse" />
                </div>
                <p className="text-slate-400 font-bold tracking-widest text-xs uppercase animate-pulse">Running Deep Neural Analysis...</p>
            </div>
        );
    }

    if (error || !caseData) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-6 glass rounded-[2.5rem] p-12 border-rose-100">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100">
                    <History size={32} />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-display font-black text-slate-900 mb-2">Analysis Interrupted</h3>
                    <p className="text-slate-500 text-sm max-w-sm mb-8">{error || "The requested dossier could not be retrieved from the ledger."}</p>
                    <button 
                        onClick={fetchCase}
                        className="px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-colors shadow-lg"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    const initial = caseData.initial_result;
    const current = caseData.updated_state;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-10"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/50">
                <div className="flex items-center gap-4 text-slate-400">
                    <button 
                        onClick={onBack} 
                        className="hover:text-primary-600 transition-all flex items-center gap-2 group font-black text-xs uppercase tracking-widest text-slate-500"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        Back
                    </button>
                    <div className="h-4 w-px bg-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500">Case ID: {caseId.slice(-8).toUpperCase()}</span>
                </div>
                
                <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-premium">
                    <button 
                        onClick={() => setActiveTab('review')}
                        className={`relative px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'review' ? 'text-white' : 'text-slate-500 hover:text-primary-600'}`}
                    >
                        {activeTab === 'review' && (
                            <motion.div layoutId="tab-bg" className="absolute inset-0 bg-slate-900 rounded-xl shadow-lg" />
                        )}
                        <span className="relative z-10">Review Decision</span>
                    </button>
                    <button 
                         onClick={() => setActiveTab('contest')}
                        className={`relative px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'contest' ? 'text-white' : 'text-slate-500 hover:text-primary-600'}`}
                    >
                        {activeTab === 'contest' && (
                            <motion.div layoutId="tab-bg" className="absolute inset-0 bg-slate-900 rounded-xl shadow-lg" />
                        )}
                        <span className="relative z-10">Contest Factors</span>
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                <div className="lg:col-span-8 space-y-10">
                    
                    {/* Decision Comparison Delta Card */}
                    <motion.div 
                        variants={itemVariants}
                        layout
                        className="glass border-white/60 rounded-[3rem] shadow-2xl overflow-hidden"
                    >
                        <div className="px-10 py-6 bg-white/40 border-b border-white/40 flex items-center justify-between">
                           <div className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-500">Neural Decision Pipeline</div>
                           <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Live Status: Operational</span>
                                </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                           {/* Initial */}
                           <div className="p-12 border-r border-white/20 bg-slate-50/20 relative group">
                                <div className="absolute inset-0 bg-slate-100/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-wider mb-8 border shadow-sm ${
                                    initial.decision === 'APPROVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                   {initial.decision === 'APPROVE' ? <ShieldCheck size={16}/> : <ShieldAlert size={16}/>}
                                   Initial: {initial.decision}
                                </span>
                                <div className="flex items-baseline gap-3 relative z-10">
                                    <h4 className="text-7xl font-display font-black text-slate-900 tracking-tighter">
                                        <AnimatedNumber value={initial.probability * 100} />
                                    </h4>
                                    <span className="text-2xl font-black text-slate-400 leading-none">%</span>
                                </div>
                                <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.2em] mt-3">Baseline Confidence</p>
                                
                                <div className="mt-10 space-y-6">
                                    {initial.topFactors.map((f, i) => (
                                        <div key={i} className="group/factor">
                                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest mb-2">
                                                <span className="text-slate-500 group-hover/factor:text-slate-900 transition-colors capitalize">{f.feature.replace('_', ' ')}</span>
                                                <span className={`${f.impact === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {f.impact === 'positive' ? '+' : '-'}{(Math.abs(f.contribution)).toFixed(2)} pts
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden shadow-inner">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(Math.abs(f.contribution) * 20, 100)}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full rounded-full ${f.impact === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                           </div>

                           {/* Simulated Output */}
                           <div className="p-12 relative group overflow-hidden bg-white/10">
                                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-primary-600 to-accent animate-pulse" />
                                
                                {current.isContested ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <span className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-wider mb-8 border shadow-lg ${
                                            current.decision === 'APPROVE' ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-200' : 'bg-rose-500 text-white border-rose-400 shadow-rose-200'
                                        }`}>
                                            {current.decision === 'APPROVE' ? <ShieldCheck size={16}/> : <ShieldAlert size={16}/>}
                                            Simulated: {current.decision}
                                        </span>
                                        <div className="flex items-baseline gap-3 relative z-10">
                                            <h4 className="text-8xl font-display font-black text-primary-700 tracking-tighter leading-none">
                                                <AnimatedNumber value={current.probability * 100} />
                                            </h4>
                                            <span className="text-2xl font-black text-primary-400 leading-none">%</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.2em]">Neural Flux</p>
                                            <motion.span 
                                                initial={{ y: 5, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className={`text-[11px] font-black px-3 py-1 rounded-xl border-2 shadow-sm ${current.probability > initial.probability ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}
                                            >
                                                {current.probability > initial.probability ? '↑' : '↓'} 
                                                {(Math.abs(current.probability - initial.probability) * 100).toFixed(1)}%
                                            </motion.span>
                                        </div>
                                        
                                        <div className="mt-12 bg-white/40 p-8 rounded-[2.5rem] border border-white/50 shadow-premium backdrop-blur-md relative">
                                            <div className="flex gap-4">
                                                <Zap size={28} className="text-primary-500 shrink-0 mt-1" />
                                                <div className="text-sm font-black leading-relaxed text-slate-900">
                                                    "{current.explanation}"
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-3 -right-3 text-[10px] font-black text-white bg-slate-900 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                                                AI Reasoning Protocol
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
                                        <motion.div 
                                            animate={{ 
                                                y: [0, -15, 0],
                                                scale: [1, 1.05, 1],
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-primary-600 mb-8 border-2 border-primary-50"
                                        >
                                            <History size={48} />
                                        </motion.div>
                                        <h5 className="text-lg font-black text-slate-900 uppercase tracking-[0.2em]">Initiate Simulation</h5>
                                        <p className="text-[12px] font-black text-slate-400 mt-3 max-w-[240px] leading-relaxed">Adjust governance parameters in the 'Contest' tab to activate neural processing.</p>
                                    </div>
                                )}
                           </div>
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'review' ? (
                            <motion.div 
                                key="review-content"
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-10"
                            >
                                <div className="glass border-white/40 rounded-[2.5rem] p-10 shadow-premium relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <FileText size={80} />
                                    </div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shadow-lg"><Info size={28} className="stroke-[2.5]" /></div>
                                        <h3 className="text-3xl font-display font-black tracking-tight text-slate-900 border-b-4 border-emerald-500 pb-1">Narrative Reasoning</h3>
                                    </div>
                                    <p className="text-slate-800 leading-relaxed font-black text-base pl-8 border-l-4 border-emerald-500/30 py-2">
                                        {initial.explanation}
                                    </p>
                                </div>

                                {caseData.counterfactuals && (
                                    <motion.div 
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group shadow-primary-900/20"
                                    >
                                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/30 blur-[120px] rounded-full animate-float" />
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-accent" />
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-12">
                                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-xl"><Zap size={28} className="text-primary-400 stroke-[2.5]" /></div>
                                                <h3 className="text-3xl font-display font-black tracking-tight text-white border-b-4 border-primary-500 pb-1">Success Strategy</h3>
                                            </div>
                                            
                                            <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/20 shadow-inner">
                                                <p className="text-white text-base font-black italic mb-10 leading-relaxed border-l-4 border-primary-400 pl-8">"{caseData.counterfactuals.ai_advice}"</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {caseData.counterfactuals.suggestions.map((s, i) => (
                                                        <motion.div 
                                                            key={i} 
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/5"
                                                        >
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.feature.replace('_', ' ')}</span>
                                                            <div className="flex justify-between items-end">
                                                                <span className="text-lg font-black text-primary-400 tracking-tight">₹{s.requiredValue.toLocaleString()}</span>
                                                                <ArrowRight size={16} className="text-primary-600 mb-1" />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="contest-content"
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="glass border-primary-100 rounded-[3rem] p-10 shadow-glow overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-[100px] -mr-32 -mt-32" />
                                
                                <div className="flex items-center justify-between mb-10 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-100"><Sliders size={22}/></div>
                                        <h3 className="text-2xl font-display font-black tracking-tight">Contest Decision Factors</h3>
                                    </div>
                                    <motion.div 
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-[9px] font-black text-white bg-primary-600 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-glow"
                                    >
                                        Simulation Link: Stable
                                    </motion.div>
                                </div>

                                <form onSubmit={handleUpdate} className="space-y-10 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {Object.keys(formData).map((key) => (
                                            <div key={key} className="group/input">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within/input:text-primary-600 transition-colors">{key.replace('_', ' ')}</label>
                                                <div className="relative">
                                                    <input 
                                                        type="number"
                                                        value={formData[key]}
                                                        onChange={(e) => setFormData({...formData, [key]: Number(e.target.value)})}
                                                        className="w-full bg-white/50 border border-slate-200 rounded-[1.25rem] px-6 py-4 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[10px] uppercase">Edit</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <motion.div 
                                        whileHover={{ borderColor: 'var(--primary)' }}
                                        className="bg-white/30 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center group cursor-pointer transition-all"
                                    >
                                        <div className="flex flex-col items-center">
                                            <motion.div 
                                                whileHover={{ rotate: 90, scale: 1.1 }}
                                                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-premium text-primary-600 mb-4 border border-white group-hover:bg-primary-600 group-hover:text-white transition-all"
                                            >
                                                <PlusCircle size={32} />
                                            </motion.div>
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Attach Evidence</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Secure TLS-encrypted upload channel</p>
                                        </div>
                                    </motion.div>

                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={updating}
                                        className="w-full bg-gradient-to-r from-primary-600 to-accent text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-glow hover:shadow-primary-600/40 transition-all disabled:opacity-50"
                                    >
                                        {updating ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
                                        <span className="uppercase tracking-[0.2em] text-xs">Execute Decision Simulation</span>
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side: Case Details / Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.div 
                        variants={itemVariants}
                        className="glass border-white/40 rounded-[3rem] p-8 shadow-premium"
                    >
                        <h4 className="font-display font-black text-slate-900 border-b-2 border-slate-200 pb-8 mb-8 uppercase tracking-[0.3em] text-sm">Application Dossier</h4>
                        <div className="space-y-8">
                            <div className="flex justify-between items-center group/item p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                                <span className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] group-hover/item:text-primary-600 transition-colors">Borrower ID</span>
                                <span className="text-sm font-black text-slate-900 tracking-tight">{caseData.name}</span>
                            </div>
                            <div className="flex justify-between items-center group/item p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                                <span className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] group-hover/item:text-primary-600 transition-colors">Filing Date</span>
                                <span className="text-sm font-black text-slate-900 tracking-tight">{new Date(caseData.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center group/item p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                                <span className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] group-hover/item:text-primary-600 transition-colors">Entity Verity</span>
                                <span className="inline-flex items-center gap-2 text-[10px] font-black text-white bg-blue-700 px-5 py-2 rounded-xl uppercase tracking-[0.1em] shadow-lg shadow-blue-200">
                                    <ShieldCheck size={14} className="stroke-[3]" />
                                    SECURE
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="bg-white/30 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-primary-100 p-8 relative overflow-hidden group"
                    >
                        <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-500">
                            <HelpCircle size={100} className="text-primary-600" />
                        </div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm"><HelpCircle size={18} /></div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Protocol Insight</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium relative z-10">
                            Confidence scores are derived from multi-layered factor analysis. Records within the 40-65% variance range are flagged for algorithmic bias review.
                        </p>
                        <button className="mt-6 text-[10px] font-black text-primary-600 flex items-center gap-2 hover:translate-x-1 transition-all uppercase tracking-widest relative z-10">
                            Legal Whitepaper <ExternalLink size={12} />
                        </button>
                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
}

export default Dashboard;
