import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConflictModal from '../components/ConflictModal';
import ProcessingAnimation from '../components/ProcessingAnimation';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap, Info, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    income: '',
    creditScore: '',
    employment: '',
    loanAmount: '',
    debts: '',
    reason: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5070/api/case/${id}`);
        const data = response.data;
        setFormData({
          income: data.income.toString(),
          creditScore: data.credit_score.toString(),
          employment: 'Employed (Salaried)', // Mocked default
          loanAmount: data.loan_amount.toString(),
          debts: data.existing_debt.toString(),
          reason: ''
        });
      } catch (error) {
        console.error("Error fetching case for contestation:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile({
        name: uploadedFile.name,
        size: (uploadedFile.size / (1024 * 1024)).toFixed(1) + ' MB'
      });
      // Simulate auto-triggering conflict modal for demo
      setTimeout(() => setIsModalOpen(true), 1200);
    }
  };

  const resolveConflict = (value) => {
    setFormData({ ...formData, income: value.toString() });
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Construct updated payload
      const payload = {
        income: parseFloat(formData.income),
        credit_score: parseFloat(formData.creditScore),
        existing_debt: parseFloat(formData.debts),
        loan_amount: parseFloat(formData.loanAmount)
      };

      // Call re-evaluate endpoint
      await axios.post(`http://localhost:5070/api/re-evaluate/${id}`, payload);
      
      // Navigate to delta after animation completes
      // Navigation happens in the ProcessingAnimation callback
    } catch (error) {
      console.error("Re-evaluation failed:", error);
      alert("Neural appeal failed to transmit. Please check server logs.");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="animate-spin h-12 w-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Preparing Contestation Sandbox...</p>
      </div>
    );
  }

  if (isProcessing) {
    return <ProcessingAnimation onComplete={() => navigate(`/delta/${id}`)} />;
  }

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ConflictModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onResolve={resolveConflict}
      />

      <div className="flex flex-col gap-4 border-b border-slate-100 pb-10">
        <button 
          onClick={() => navigate(`/decision/${id}`)}
          className="text-primary-accent text-[12px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-[-4px] transition-transform w-fit mb-4"
        >
          <ArrowLeft size={16} strokeWidth={3} />
          Back to Decision Report
        </button>
        <h1 className="text-5xl font-display font-black text-slate-900 tracking-tight">Contest Your Decision</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Identity: Verified • Appeal #1 (2 Remaining)</p>
      </div>

      <div className="bg-warning-bg border-2 border-warning/20 rounded-[2rem] p-8 flex gap-6 items-center shadow-lg shadow-warning/5">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-warning shadow-md shadow-warning/10 shrink-0">
           <Info size={32} strokeWidth={2.5} />
        </div>
        <p className="text-[15px] leading-relaxed text-slate-700 font-black">
          Fields highlighted in <span className="text-rejected border-b-2 border-rejected/20">high impact</span> are critical. Correcting these will maximize the probability of a reversed decision outcome.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT - Form */}
        <div className="bg-white rounded-[2.5rem] shadow-card p-12 border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-warning" />
          <h2 className="text-2xl font-display font-black text-slate-900 mb-2 tracking-tight uppercase tracking-widest">Parameter Adjustment</h2>
          <p className="text-[12px] text-slate-400 font-black uppercase tracking-widest mb-12">Modify only verified inaccurate information</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
              
              {/* Monthly Income - High Impact */}
              <div className="flex flex-col gap-3 group">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Monthly Income (₹)</label>
                  <span className="bg-rejected/10 text-rejected px-3 py-1 rounded-full text-[9px] font-black tracking-widest">HIGH IMPACT</span>
                </div>
                <input 
                  type="number" 
                  className="input-base border-rejected/20 focus:ring-rejected/10 focus:border-rejected shadow-sm shadow-rejected/5"
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                />
              </div>

              {/* Credit Score - High Impact */}
              <div className="flex flex-col gap-3 group">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Credit Score</label>
                  <span className="bg-rejected/10 text-rejected px-3 py-1 rounded-full text-[9px] font-black tracking-widest">HIGH IMPACT</span>
                </div>
                <input 
                  type="number" 
                  className="input-base border-rejected/20 focus:ring-rejected/10 focus:border-rejected shadow-sm shadow-rejected/5"
                  value={formData.creditScore}
                  onChange={(e) => setFormData({...formData, creditScore: e.target.value})}
                />
              </div>

              {/* Employment - Medium Impact */}
              <div className="flex flex-col gap-3 group">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Employment Status</label>
                  <span className="bg-warning/10 text-warning px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">Medium Impact</span>
                </div>
                <select 
                  className="input-base border-warning/10"
                  value={formData.employment}
                  onChange={(e) => setFormData({...formData, employment: e.target.value})}
                >
                  <option>Employed (Salaried)</option>
                  <option>Self-Employed</option>
                  <option>Unemployed</option>
                </select>
              </div>

              {/* Loan Amount - Low Impact */}
              <div className="flex flex-col gap-3 group">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Loan Amount (₹)</label>
                  <span className="text-slate-300 px-3 py-1 text-[9px] font-black tracking-widest uppercase">Neutral Impact</span>
                </div>
                <input 
                  type="number" 
                  className="input-base"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                />
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT - Evidence */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-[2.5rem] shadow-card p-10 border border-slate-50 relative">
            <h3 className="label mb-8 pb-4 border-b border-slate-100">Evidential Documentation</h3>
            
            {!file ? (
              <label className="block w-full cursor-pointer group">
                <div className="border-4 border-dashed border-slate-50 rounded-[2rem] p-16 flex flex-col items-center justify-center gap-6 group-hover:bg-primary-accent/5 group-hover:border-primary-accent/20 transition-all duration-500">
                  <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-primary-accent/10 group-hover:text-primary-accent transition-colors shadow-inner">
                    <Upload size={32} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900 tracking-tight">Drag & drop evidence</p>
                    <p className="text-[12px] text-primary-accent font-black uppercase tracking-widest underline mt-2">or select files manually</p>
                  </div>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-approved-bg border-2 border-approved/20 rounded-[2rem] p-8 flex items-center justify-between shadow-xl shadow-approved/5"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-approved shadow-lg">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">{file.name}</p>
                    <p className="text-[11px] text-approved font-black uppercase tracking-[0.2em]">{file.size} • Verified Format</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="p-3 bg-white text-rejected rounded-xl hover:bg-rejected-bg transition-colors shadow-md">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                     <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                   </svg>
                </button>
              </motion.div>
            )}

            <div className="mt-12 space-y-4">
              <h3 className="label">Governance Justification</h3>
              <textarea 
                className="input-base h-40 resize-none font-medium leading-relaxed" 
                placeholder="Explain why this data was incorrect in the original submission..."
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="sticky bottom-8 bg-white/80 backdrop-blur-xl border-2 border-slate-100 rounded-[2.5rem] p-6 flex items-center justify-between shadow-2xl z-50 ring-8 ring-white/20"
      >
        <div className="flex items-center gap-4 pl-4">
           <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 font-black text-xs">
             1/3
           </div>
           <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Appeal Limitation Protocol Active</span>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => navigate(`/decision/${id}`)} className="btn-outline px-10 py-5 text-sm uppercase">Cancel</button>
          <button 
            onClick={handleSubmit}
            className="btn-primary px-12 py-5 text-sm flex items-center gap-3 relative group overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
            Execute Neural Appeal
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContestPage;
