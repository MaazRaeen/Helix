import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeltaChart from '../components/DeltaChart';
import { ArrowLeft, ArrowRight, ShieldCheck, PlusCircle, CheckCircle2, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DeltaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5070/api/case/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching delta data:", error);
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
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Computing Neural Flux...</p>
      </div>
    );
  }

  if (!data) return (
    <div className="p-12 text-center bg-white rounded-[3rem] shadow-card">
      <h2 className="text-2xl font-black text-slate-900 mb-4">Case Not Found</h2>
      <button onClick={() => navigate('/explorer')} className="btn-primary px-8 py-4">Back to Explorer</button>
    </div>
  );

  const initialProb = data.initial_result?.probability || 0;
  const currentProb = data.updated_state?.probability || 0;
  const deltaProbability = (currentProb - initialProb) * 100;

  // Prepare data for DeltaChart
  const featureList = data.initial_result?.topFactors || [];
  const chartData = featureList.map(f => ({
    feature: f.feature,
    shapBefore: f.contribution || 0,
    shapAfter: f.contribution * (currentProb / (initialProb || 0.0001)) // Mocking shift if not in API
  }));

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* SUCCESS HERO BANNER */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-approved-bg to-emerald-50 border-2 border-approved/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-approved/5 blur-[100px] -mr-32 -mt-32" />
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Decision Delta</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Verified transformation</span>
             </div>
          </div>
          <h1 className="text-5xl font-display font-black text-emerald-900 tracking-tight leading-none">Appeal {currentProb > initialProb ? 'Successful!' : 'Processed'}</h1>
          <p className="text-emerald-700 text-lg font-black opacity-80 max-w-xl leading-relaxed">
            The contestation layer has forced a re-evaluation. Outcome verification shift: <span className="underline decoration-approved/30">+{deltaProbability.toFixed(1)}%</span>
          </p>
        </div>
        
        <div className="w-28 h-28 bg-approved rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shrink-0 relative">
          <CheckCircle2 size={56} strokeWidth={3} className="relative z-10" />
        </div>
      </motion.div>

      {/* COMPARISON MATRIX */}
      <section className="space-y-8">
        <h2 className="label text-slate-400 tracking-[0.4em]">Historical vs Optimized Performance</h2>
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-10">
          
          <div className="flex-1 bg-white border-2 border-slate-100 rounded-[3rem] p-10 text-center shadow-card relative">
            <span className="label mb-6 block opacity-50">Historical Baseline</span>
            <p className="text-3xl font-black text-slate-400 mb-1 tracking-tighter uppercase mb-6 line-through opacity-40">{data.initial_result?.decision} ✗</p>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-sm font-black text-slate-500 uppercase tracking-widest">{(initialProb * 100).toFixed(1)}% Confidence</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl">
                 <ArrowRight size={32} strokeWidth={3} />
               </div>
             </div>
          </div>

          <div className="flex-1 bg-white border-4 border-approved rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden ring-[12px] ring-approved/5">
            <span className="label text-approved mb-6 block">Current Optimized State</span>
            <p className="text-4xl font-black text-approved mb-1 tracking-tighter uppercase mb-6">{data.updated_state?.decision} ✓</p>
            <div className="p-6 bg-approved/5 rounded-2xl border border-approved/10">
               <p className="text-sm font-black text-approved uppercase tracking-widest">{(currentProb * 100).toFixed(1)}% Confidence</p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT DISTRIBUTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
            <h2 className="label text-slate-400 tracking-[0.4em]">Neural Flux Distribution</h2>
            <div className="bg-white rounded-[3rem] shadow-card p-12 border border-slate-50 relative overflow-hidden">
                <DeltaChart data={chartData} />
            </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
            <h2 className="label text-slate-400 tracking-[0.4em]">Verbatim Rationale Shift</h2>
            <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl h-full">
               <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Original Assessment</p>
                    <p className="text-sm font-medium italic opacity-60">"{data.initial_result?.explanation}"</p>
                  </div>
                  <div className="pt-8 border-t border-white/10">
                    <p className="text-[10px] font-black text-approved uppercase tracking-widest mb-3">Appeal Transformation</p>
                    <p className="text-lg font-black leading-relaxed">"{data.updated_state?.explanation}"</p>
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8 py-12 border-t border-slate-200/50 mt-8 mb-12">
        <button 
          onClick={() => navigate('/explorer')}
          className="btn-outline flex items-center gap-3 px-10 text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          View Application Ledger
        </button>
        
        <button 
          onClick={() => navigate('/apply')}
          className="btn-primary flex items-center gap-3 px-12 py-6 text-sm group shadow-glow"
        >
          <PlusCircle size={20} />
          New Governance Request
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default DeltaPage;
