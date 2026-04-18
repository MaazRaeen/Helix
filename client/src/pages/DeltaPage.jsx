import React from 'react';
import DeltaChart from '../components/DeltaChart';
import { ArrowLeft, ArrowRight, ShieldCheck, Download, PlusCircle, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const DeltaPage = ({ onNew }) => {
  const dummyDelta = {
    originalDecision: "Rejected",
    originalConfidence: 38,
    newDecision: "Approved",
    newConfidence: 71,
    decisionChanged: true,
    featureChanges: [
      { feature: 'Monthly Income',  before: '₹28,000', after: '₹46,200', shapBefore: -0.24, shapAfter: +0.28, direction: 'helped' },
      { feature: 'Credit Score',    before: '580',      after: '580',     shapBefore: -0.31, shapAfter: -0.31, direction: 'neutral' },
      { feature: 'Employment',      before: 'Employed', after: 'Employed', shapBefore: +0.18, shapAfter: +0.18, direction: 'neutral' },
      { feature: 'Debt Ratio',      before: '28.6%',    after: '17.4%',   shapBefore: +0.09, shapAfter: +0.22, direction: 'helped' },
      { feature: 'Loan Multiplier', before: '7.1x',     after: '4.3x',    shapBefore: -0.05, shapAfter: -0.01, direction: 'helped' },
    ],
    narrative: "Your Monthly Income increased from ₹28,000 → ₹46,200, crossing the ₹40,000 threshold (SHAP delta: +0.52). Credit Score remained unchanged at 580 (below 650 threshold), but the income correction was sufficient to raise your overall score above the approval threshold. Decision: Rejected ✗ → Approved ✓. Confidence improved from 38% → 71%."
  };

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HERO BANNER */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-approved-bg to-emerald-50 border-2 border-approved/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-approved/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-approved/5 blur-[100px] -mr-32 -mt-32" />
        
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Decision Delta</span>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Verified transformation</span>
            </div>
            <div className="bg-emerald-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
               Gemini 3 Flash Powered
            </div>
          </div>
          <h1 className="text-5xl font-display font-black text-emerald-900 tracking-tight leading-none">Appeal Successful!</h1>
          <p className="text-emerald-700 text-lg font-black opacity-80 max-w-xl leading-relaxed">
            The contestation layer has successfully forced a re-evaluation. Verified evidence has reversed the historical authority.
          </p>
        
        <div className="w-28 h-28 bg-approved rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-approved/40 shrink-0 relative group">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/20 rounded-[2.5rem]"
          />
          <CheckCircle2 size={56} strokeWidth={3} className="relative z-10" />
        </div>
      </motion.div>

      {/* DECISION COMPARISON BOXES */}
      <section className="space-y-8">
        <h2 className="label text-slate-400 tracking-[0.4em]">Decision Transformation Matrix</h2>
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-10">
          
          <div className="flex-1 bg-white border-2 border-slate-100 rounded-[3rem] p-10 text-center shadow-card relative">
            <span className="label mb-6 block opacity-50">Historical Baseline</span>
            <p className="text-3xl font-black text-slate-400 mb-1 tracking-tighter uppercase mb-6 line-through opacity-40">REJECTED ✗</p>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-sm font-black text-slate-500 uppercase tracking-widest">{dummyDelta.originalConfidence}% Confidence</p>
            </div>
            <span className="text-[9px] font-black text-slate-300 mt-6 block uppercase tracking-widest tracking-[0.3em]">APP-2847-ORIGINAL</span>
          </div>

          <div className="flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-primary-accent text-white rounded-full flex items-center justify-center shadow-xl shadow-primary-accent/20 ring-8 ring-primary-accent/5">
                 <ArrowRight size={32} strokeWidth={3} />
               </div>
               <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Simulation Link</span>
             </div>
          </div>

          <div className="flex-1 bg-white border-4 border-approved rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden ring-[12px] ring-approved/5">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
               <ShieldCheck size={120} />
            </div>
            <span className="label text-approved mb-6 block">Current Optimized State</span>
            <p className="text-4xl font-black text-approved mb-1 tracking-tighter uppercase mb-6">APPROVED ✓</p>
            <div className="p-6 bg-approved/5 rounded-2xl border border-approved/10">
               <p className="text-sm font-black text-approved uppercase tracking-widest">{dummyDelta.newConfidence}% Confidence</p>
            </div>
            <span className="text-[9px] font-black text-approved/40 mt-6 block uppercase tracking-widest tracking-[0.3em]">APL-0391-RESOLVED</span>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col sm:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-primary-accent/20 to-transparent pointer-events-none" />
           <div className="flex flex-col gap-2 relative z-10 text-center sm:text-left">
             <p className="text-xl font-black tracking-tight">Net Signal Transformation</p>
             <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-md">Verification of income evidence provided a massive delta in the neural approval weights.</p>
           </div>
           <div className="text-6xl font-black text-approved tracking-tighter relative z-10 group-hover:scale-110 transition-transform">
             +33<span className="text-3xl">%</span>
           </div>
        </div>
      </section>

      {/* NARRATIVE SECTION */}
      <section className="space-y-8">
        <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 shadow-card border-l-8 border-l-approved relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4">
              <span className="text-[9px] font-black text-approved/20 uppercase tracking-[0.3em]">AI Reasoning via Gemini 3 Flash Preview</span>
           </div>
           <p className="text-slate-700 text-xl font-black leading-relaxed italic border-l-4 border-slate-100 pl-8 ml-2">
             "{dummyDelta.narrative}"
           </p>
        </div>
      </section>

      {/* CHARTS SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
            <h2 className="label text-slate-400 tracking-[0.4em]">Neural Flux Distribution (Original vs Appeal)</h2>
            <div className="bg-white rounded-[3rem] shadow-card p-12 border border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] -mr-32 -mt-32" />
                <DeltaChart data={dummyDelta.featureChanges} />
            </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
            <h2 className="label text-slate-400 tracking-[0.4em]">Telemetry Summary</h2>
            <div className="bg-white rounded-[3rem] shadow-card border border-slate-50 overflow-hidden divide-y divide-slate-100">
               {dummyDelta.featureChanges.filter(f => f.direction === 'helped').map((f, i) => (
                 <div key={i} className="p-8 hover:bg-slate-50 transition-all flex justify-between items-center group">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary-accent transition-colors">{f.feature}</p>
                       <p className="text-lg font-black text-slate-900 tracking-tight">{f.after}</p>
                    </div>
                    <div className="w-10 h-10 bg-approved-bg text-approved rounded-xl flex items-center justify-center shadow-lg shadow-approved/10">
                       <Zap size={20} />
                    </div>
                 </div>
               ))}
            </div>
        </div>
      </section>

      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-200/50 mt-12 mb-20">
        <button 
          onClick={onNew}
          className="btn-outline flex items-center gap-3 px-10 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Navigate to New Pipeline
        </button>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="btn-outline flex items-center justify-center gap-3 px-8 text-sm group">
             Export Technical Dossier
             <Download size={18} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
          </button>
          <button 
            onClick={onNew}
            className="btn-primary flex items-center justify-center gap-3 px-12 group shadow-xl ring-8 ring-primary-accent/5"
          >
            Apply for Subsidized Credit
            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeltaPage;
