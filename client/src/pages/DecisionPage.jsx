import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DecisionBadge from '../components/DecisionBadge';
import ConfidenceGauge from '../components/ConfidenceGauge';
import SHAPChart from '../components/SHAPChart';
import FeatureImpactTable from '../components/FeatureImpactTable';
import { Info, ArrowLeft, ArrowRight, Zap, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DecisionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5070/api/case/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching decision data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="animate-spin h-12 w-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Retrieving Neural Verdict...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="p-12 text-center bg-white rounded-[3rem] shadow-card">
      <h2 className="text-2xl font-black text-slate-900 mb-4">Decision Not Found</h2>
      <p className="text-slate-500 mb-8">The requested case record could not be located in the ledger.</p>
      <button onClick={() => navigate('/apply')} className="btn-primary px-8 py-4">New Application</button>
    </div>
  );

  const isApproved = data?.decision?.toLowerCase().startsWith('approve');

  return (
    <div className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT COLUMN: Decision Status */}
        <div className="flex flex-col items-center lg:items-start gap-12 bg-white p-12 rounded-[3rem] shadow-card border border-slate-50 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 ${isApproved ? 'bg-approved' : 'bg-rejected'}`} />
          
          <DecisionBadge 
            status={data.decision} 
            applicationNumber={`APP-${id.slice(-4).toUpperCase()}`} 
          />
          
          <div className="w-full flex justify-center py-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <ConfidenceGauge 
              confidence={data.confidence || 0} 
              status={data.decision} 
            />
          </div>

          <div className={`w-full ${isApproved ? 'bg-approved-bg border-approved/10' : 'bg-rejected-bg border-rejected/10'} rounded-[2rem] p-8 border flex gap-5`}>
            <div className={`${isApproved ? 'text-approved' : 'text-rejected'} shrink-0`}>
              <Info size={28} strokeWidth={2.5} />
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <h4 className={`text-[13px] font-black uppercase tracking-widest ${isApproved ? 'text-approved' : 'text-rejected'}`}>Transparency Insight</h4>
                 <span className={`${isApproved ? 'bg-approved/10 text-approved' : 'bg-rejected/10 text-rejected'} text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter`}>Gemini 3 Flash</span>
               </div>
               <p className="text-[15px] leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                 {data.explanation || `Decision based on core financial metrics including credit integrity and debt-to-income ratio.`}
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
                      Outcome determined via automated compliance checks. The model utilized Logistic Regression with weight-based contribution mapping to identify key decision drivers.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-50 rounded-2xl">
                          <span className="label">Algorithm</span>
                          <p className="text-xs font-black text-slate-900">Logistic Regression v1.0</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl">
                          <span className="label">Verification</span>
                          <p className="text-xs font-black text-slate-900">Neural Audit Active</p>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Advisor Engine - Only for Rejected cases */}
          {!isApproved && (
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
                   {data.counterfactuals?.suggestions?.map((cf, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-xs font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-accent" />
                        {cf.description}
                      </li>
                   )) || (
                     <li className="flex items-center gap-3 text-xs font-bold italic text-slate-500">
                       No simple path identified. Consult manual audit.
                     </li>
                   )}
                 </ul>
                 {data.counterfactuals?.ai_advice && (
                   <p className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-[10px] leading-relaxed text-slate-300 italic">
                      {data.counterfactuals.ai_advice}
                   </p>
                 )}
               </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Insights */}
        <div className="flex flex-col gap-8 bg-white p-12 rounded-[3rem] shadow-card border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-accent/5 blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <h3 className="label mb-4 opacity-50 tracking-[0.4em]">Neural Decision Insight</h3>
            <h2 className="text-4xl font-display font-black text-slate-900 mb-2 tracking-tight">Why Was This Decision Made?</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mb-12">Global Feature Importance Mapping (SHAP values)</p>
            
            {data.topFactors && data.topFactors.length > 0 ? (
              <>
                <SHAPChart data={data.topFactors} />
                <FeatureImpactTable data={data.topFactors} />
              </>
            ) : (
              <div className="py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Neural contribution mapping not available for this record type.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-200/50 mt-8 mb-12">
        <button 
          onClick={() => navigate('/apply')}
          className="btn-outline flex items-center gap-3 px-10 text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          New Application
        </button>
        
        <div className="flex flex-col items-center sm:items-end gap-3">
          <button 
            disabled={isApproved}
            onClick={() => navigate(`/contest/${id}`)}
            className="btn-primary flex items-center gap-3 px-12 text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
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
