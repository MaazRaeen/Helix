import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
    Loader2, ArrowLeft, ArrowRight, ShieldCheck, ShieldAlert, 
    FileText, Zap, HelpCircle, Save, Sliders, CheckCircle2,
    Info, ExternalLink, ChevronRight, History, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Dashboard({ caseId, onBack }) {
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState('review'); // 'review' or 'contest'
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchCase();
    }, [caseId]);

    const fetchCase = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/cases/${caseId}`);
            setCaseData(res.data);
            setFormData({
                income: res.data.updated_state.income,
                credit_score: res.data.updated_state.credit_score,
                employment_length: res.data.updated_state.employment_length,
                existing_debt: res.data.updated_state.existing_debt,
                bank_balance: res.data.updated_state.bank_balance
            });
        } catch (error) {
            console.error("Fetch case failed", error);
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
            <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary-500" size={40} />
                <p className="text-corporate-muted font-medium">Analyzing Decision Pipeline...</p>
            </div>
        );
    }

    const initial = caseData.initial_result;
    const current = caseData.updated_state;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-corporate-muted mb-2">
                    <button onClick={onBack} className="hover:text-primary-600 transition-colors flex items-center gap-1 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Explorer
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="font-medium text-slate-500">Case ID: {caseId.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('review')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'review' ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-corporate-muted border border-slate-200 hover:border-primary-500'}`}
                    >
                        Review Decision
                    </button>
                    <button 
                         onClick={() => setActiveTab('contest')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'contest' ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-corporate-muted border border-slate-200 hover:border-primary-500'}`}
                    >
                        Contest Factors
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Summary & Decision */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Decision Comparison Delta Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-premium overflow-hidden">
                        <div className="p-1 bg-slate-50 border-b border-slate-100 flex items-center">
                           <div className="flex-1 text-center py-2 text-[10px] uppercase tracking-tighter font-bold text-slate-400">Initial Decision</div>
                           <div className="w-10 flex justify-center"><ChevronRight size={14} className="text-slate-300" /></div>
                           <div className="flex-1 text-center py-2 text-[10px] uppercase tracking-tighter font-bold text-primary-500">Updated Result</div>
                        </div>

                        <div className="grid grid-cols-2">
                           {/* Initial */}
                           <div className="p-8 border-r border-slate-100 bg-slate-50/30">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${
                                    initial.decision === 'APPROVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                   {initial.decision === 'APPROVE' ? <ShieldCheck size={12}/> : <ShieldAlert size={12}/>}
                                   {initial.decision}
                                </span>
                                <h4 className="text-3xl font-display font-bold text-slate-900">{(initial.probability * 100).toFixed(1)}%</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Probability Score</p>
                                
                                <div className="mt-6 space-y-3">
                                    {initial.topFactors.map((f, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 capitalize">{f.feature.replace('_', ' ')}</span>
                                            <span className={`font-bold ${f.impact === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {f.impact === 'positive' ? '+' : '-'}{(Math.abs(f.contribution)).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                           </div>

                           {/* Updated */}
                           <div className="p-8 bg-white relative">
                                {current.isContested ? (
                                    <>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${
                                            current.decision === 'APPROVE' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'bg-rose-100 text-rose-700 shadow-sm'
                                        }`}>
                                            {current.decision === 'APPROVE' ? <ShieldCheck size={12}/> : <ShieldAlert size={12}/>}
                                            {current.decision}
                                        </span>
                                        <h4 className="text-4xl font-display font-bold text-slate-900">{(current.probability * 100).toFixed(1)}%</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Updated Score</p>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${current.probability > initial.probability ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {current.probability > initial.probability ? '+' : ''}{( (current.probability - initial.probability) * 100 ).toFixed(1)}%
                                            </span>
                                        </div>
                                        
                                        <div className="mt-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                            <div className="flex gap-3">
                                                <Zap size={20} className="text-blue-500 shrink-0" />
                                                <div className="text-xs leading-relaxed text-slate-700 italic">
                                                    "{current.explanation}"
                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-end">
                                               <span className="text-[10px] font-bold text-blue-500 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-tighter">AI Gemini Insight</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3 border border-slate-100">
                                            <History size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-slate-400">Contest a factor to see simulation outcome</p>
                                    </div>
                                )}
                           </div>
                        </div>
                    </div>

                    {/* Reasoning Section */}
                    {activeTab === 'review' ? (
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Info size={20}/></div>
                                    <h3 className="text-xl font-display font-bold">Initial Narrative</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed border-l-4 border-slate-100 pl-6 py-2">
                                    {initial.explanation}
                                </p>
                            </div>

                            {caseData.counterfactuals && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
                                >
                                    {/* Abstract background glow */}
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-600/20 blur-[100px]" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Zap size={20} className="text-primary-400" />
                                            <h3 className="text-xl font-display font-bold">Approval Strategy (AI Guided)</h3>
                                        </div>
                                        
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                            <p className="text-slate-300 text-sm italic mb-4">"{caseData.counterfactuals.ai_advice}"</p>
                                            
                                            <div className="space-y-4 pt-4 border-t border-white/10">
                                                {caseData.counterfactuals.suggestions.map((s, i) => (
                                                    <div key={i} className="flex items-center justify-between">
                                                        <span className="text-xs text-slate-400 capitalize">{s.feature.replace('_', ' ')}</span>
                                                        <span className="text-sm font-bold text-primary-400">Target: ₹{s.requiredValue.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl border border-primary-100 p-8 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><Sliders size={20}/></div>
                                    <h3 className="text-xl font-display font-bold">Contest Decision Factors</h3>
                                </div>
                                <div className="text-[10px] font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase">Evidence Mode Active</div>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.keys(formData).map((key) => (
                                        <div key={key}>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{key.replace('_', ' ')}</label>
                                            <input 
                                                type="number"
                                                value={formData[key]}
                                                onChange={(e) => setFormData({...formData, [key]: Number(e.target.value)})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400 mb-2">
                                            <PlusCircle size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-600">Upload Counter-Evidence</p>
                                        <p className="text-xs text-slate-400 mt-1">Salary slips, debt clearance certificates (PDF, JPG)</p>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={updating}
                                    className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {updating ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                                    Run Decision Simulation
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>

                {/* Right Side: Case Details / Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="font-display font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Application Details</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-medium">Borrower</span>
                                <span className="text-xs font-bold text-slate-900">{caseData.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-medium">Applied Date</span>
                                <span className="text-xs font-bold text-slate-900">{new Date(caseData.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-medium">Asset Status</span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Verified</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 border-dashed">
                        <div className="flex items-center gap-2 mb-4">
                            <HelpCircle size={18} className="text-slate-400" />
                            <h4 className="text-sm font-bold text-slate-700">Explaining Confidence</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            The confidence score represents the model's certainty. Decisions between 40-60% are considered ambiguous and should prioritize the applicant's counter-evidence.
                        </p>
                        <button className="mt-4 text-[10px] font-bold text-primary-600 flex items-center gap-1 hover:underline">
                            View Compliance Documentation <ExternalLink size={10} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
