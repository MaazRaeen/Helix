import React, { useState } from 'react';
import DecisionBadge from '../components/DecisionBadge';
import ConfidenceGauge from '../components/ConfidenceGauge';
import SHAPChart from '../components/SHAPChart';
import FeatureImpactTable from '../components/FeatureImpactTable';
import { Info, ArrowLeft, ArrowRight, Zap, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DecisionPage = ({ onContest, onNew }) => {
  const [expanded, setExpanded] = useState(false);

  const dummyData = {
    decision: "Rejected",
    confidence: 38,
    applicationNumber: "APP-2847",
    contributions: [
      { feature: 'Credit Score',    value: '580',     shapValue: -0.31, direction: 'negative' },
      { feature: 'Monthly Income',  value: '₹28,000', shapValue: -0.24, direction: 'negative' },
      { feature: 'Employment',      value: 'Employed', shapValue: +0.18, direction: 'positive' },
      { feature: 'Debt Ratio',      value: '28.6%',   shapValue: +0.09, direction: 'positive' },
      { feature: 'Loan Multiplier', value: '7.1x',    shapValue: -0.05, direction: 'negative' },
    ]
  };

  return (
    <div className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT COLUMN: Decision Status */}
        <div className="flex flex-col items-center lg:items-start gap-12 bg-white p-12 rounded-[3rem] shadow-card border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-rejected" />
          
          <DecisionBadge 
            status={dummyData.decision} 
            applicationNumber={dummyData.applicationNumber} 
          />
          
          <div className="w-full flex justify-center py-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <ConfidenceGauge 
              confidence={dummyData.confidence} 
              status={dummyData.decision} 
            />
          </div>

          <div className="w-full bg-rejected-bg rounded-[2rem] p-8 border border-rejected/10 flex gap-5">
            <div className="text-rejected shrink-0">
              <Info size={28} strokeWidth={2.5} />
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <h4 className="text-[13px] font-black uppercase tracking-widest text-rejected">Transparency Insight</h4>
                 <span className="bg-rejected/10 text-rejected text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Gemini 3 Flash</span>
               </div>
               <p className="text-[15px] leading-relaxed text-slate-700 font-medium">
                Rejected because your <span className="font-black text-rejected border-b-2 border-rejected/20">credit score (580)</span> is below the 650 threshold [impact: 42%] and your <span className="font-black text-rejected border-b-2 border-rejected/20">monthly income (₹28,000)</span> is below the ₹40,000 minimum [impact: 34%].
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="w-full border-2 border-slate-100 rounded-[2rem] overflow-hidden bg-white hover:border-slate-200 transition-all">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="w-full px-8 py-6 flex justify-between items-center hover:bg-slate-50 transition-colors"
            >
              <span className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Policy Breakdown</span>
              <div className={`w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center transition-transform duration-300 ${expanded ? 'rotate-180 bg-slate-900 text-white' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-8 pb-8 flex flex-col gap-4">
                    <p className="text-[14px] text-slate-500 leading-relaxed font-medium pb-6 border-b border-slate-50">
                      Your application did not meet two key automated compliance checks. The model utilized Gradient Boosting with SHAP value calculation to determine this outcome.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-50 rounded-2xl">
                          <span className="label">Algorithm</span>
                          <p className="text-xs font-black text-slate-900">XGBoost v1.7.5</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl">
                          <span className="label">Verification</span>
                          <p className="text-xs font-black text-slate-900">Level 3 Audit</p>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* New Advisor Section */}
          <div className="w-full bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 text-white/10 group-hover:text-primary-accent/20 transition-colors">
                <Lightbulb size={80} />
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-primary-accent rounded-xl flex items-center justify-center">
                    <Zap size={20} className="text-white" />
                 </div>
                 <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">Advisor Engine</h4>
                   <p className="text-sm font-black">Path to Approval</p>
                 </div>
               </div>
               
               <p className="text-xs text-slate-400 font-medium mb-4 leading-relaxed">
                 Helix has determined the minimal changes required to reverse this decision:
               </p>
               
               <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-xs font-bold">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary-accent" />
                   Increase Monthly Income by +₹12,000
                 </li>
                 <li className="flex items-center gap-3 text-xs font-bold">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary-accent" />
                   Reduce Loan Multiplier to 4.5x
                 </li>
               </ul>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Insights */}
        <div className="flex flex-col gap-8 bg-white p-12 rounded-[3rem] shadow-card border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-accent/5 blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <h3 className="label mb-4 opacity-50 tracking-[0.4em]">Neural Decision Insight</h3>
            <h2 className="text-4xl font-display font-black text-slate-900 mb-2 tracking-tight">Why Was This Decision Made?</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mb-12">Global Feature Importance Mapping (SHAP values)</p>
            
            <SHAPChart data={dummyData.contributions} />
            
            <FeatureImpactTable data={dummyData.contributions} />
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-200/50 mt-8 mb-12">
        <button 
          onClick={onNew}
          className="btn-outline flex items-center gap-3 px-10 text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          New Application
        </button>
        
        <div className="flex flex-col items-center sm:items-end gap-3">
          <button 
            onClick={onContest}
            className="btn-primary flex items-center gap-3 px-12 text-sm group"
          >
            Contest High-Impact Factors
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] px-4 py-1 bg-slate-50 rounded-full border border-slate-100">
            Identity Verified • Real-time Processing Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default DecisionPage;
