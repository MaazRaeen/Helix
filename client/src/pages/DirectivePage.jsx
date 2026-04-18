import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Cpu, ArrowRight, Info } from 'lucide-react';

const DirectivePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: 'Executive Directive',
        income: '45000',
        creditScore: '720',
        employment: 'Governance Lead',
        loanAmount: '500000',
        debts: '2000',
        priority: 'Medium',
        framework: 'Compliance v4.1'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const payload = {
                name: formData.name,
                income: parseFloat(formData.income),
                credit_score: parseFloat(formData.creditScore),
                employment_length: 60, 
                existing_debt: parseFloat(formData.debts),
                bank_balance: 50000, 
                loan_amount: parseFloat(formData.loanAmount)
            };

            const response = await axios.post('http://localhost:5070/api/predict', payload);
            navigate(`/decision/${response.data._id}`);
        } catch (error) {
            console.error("Directive transmission failed:", error);
            alert("Neural uplink failed. Ensure Governance Server is active.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-10">
                <div className="flex items-center gap-3 bg-slate-900 text-white w-fit px-4 py-1.5 rounded-full mb-2">
                    <ShieldCheck size={16} className="text-primary-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Executive Authorization Protocol</span>
                </div>
                <h1 className="text-5xl font-display font-black text-slate-900 tracking-tight">New Governance Directive</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Primary Framework: Helix Alpha-7 • Latency: 14ms</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-8 bg-white rounded-[3rem] shadow-card p-12 border border-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-accent/5 blur-[120px] -mr-48 -mt-48" />
                    
                    <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Directive Label</label>
                                <input 
                                    className="input-base font-black text-slate-900" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Governance Priority</label>
                                <select 
                                    className="input-base"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                >
                                    <option>Standard</option>
                                    <option>Medium</option>
                                    <option>High (Audit Required)</option>
                                    <option>Immediate Execution</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Audit Parameter: Income (₹)</label>
                                <input 
                                    type="number" 
                                    className="input-base" 
                                    value={formData.income}
                                    onChange={(e) => setFormData({...formData, income: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stability Factor: Credit</label>
                                <input 
                                    type="number" 
                                    className="input-base" 
                                    value={formData.creditScore}
                                    onChange={(e) => setFormData({...formData, creditScore: e.target.value})}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Capital Requested (₹)</label>
                                <input 
                                    type="number" 
                                    className="input-base" 
                                    value={formData.loanAmount}
                                    onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Systematic Debt Load (₹)</label>
                                <input 
                                    type="number" 
                                    className="input-base" 
                                    value={formData.debts}
                                    onChange={(e) => setFormData({...formData, debts: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-100 flex justify-end gap-6">
                            <button 
                                type="button" 
                                onClick={() => navigate('/explorer')}
                                className="btn-outline px-10 py-5 text-sm"
                            >
                                Revert changes
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary px-12 py-5 text-sm flex items-center gap-3 shadow-glow"
                            >
                                {loading ? 'Transmitting...' : 'Execute Directive'}
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                            <Globe size={100} />
                        </div>
                        <h3 className="text-[12px] font-black text-primary-400 uppercase tracking-[0.3em] mb-6">Neural Context</h3>
                        <p className="text-lg font-black leading-snug mb-8 relative z-10">
                            Directives bypass the standard applicant queue and are processed via the Governance High-Speed Mesh.
                        </p>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                <span className="text-[10px] uppercase font-black tracking-widest">Global SHAP Verification</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                <span className="text-[10px] uppercase font-black tracking-widest">Compliant with ISO-42001</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-card">
                        <div className="w-12 h-12 bg-primary-accent/10 text-primary-accent rounded-2xl flex items-center justify-center mb-6">
                            <Cpu size={24} />
                        </div>
                        <h4 className="text-sm font-black mb-3 text-slate-900 uppercase tracking-tight">Processing Matrix</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                            Your executive credentials are automatically attached to this directive for non-repudiation on the decentralised ledger.
                        </p>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <Info size={16} className="text-primary-accent" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Audit Grade: Prime</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectivePage;
