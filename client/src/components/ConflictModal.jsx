import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const ConflictModal = ({ isOpen, onClose, onResolve }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-surface rounded-[2.5rem] shadow-2xl overflow-hidden border border-border"
        >
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-warning-bg text-warning rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-warning/10">
              <AlertCircle size={40} />
            </div>
            
            <h2 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight">Data Conflict Detected</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10">
              The AI has detected a discrepancy between your input and the uploaded bank statement evidence.
            </p>

            <div className="flex items-center justify-center gap-6 mb-12">
              <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-border">
                <span className="label">Your Input</span>
                <p className="text-3xl font-black text-slate-400 line-through">₹28,000</p>
              </div>
              
              <div className="bg-primary/5 p-3 rounded-full">
                <ArrowRight size={24} className="text-primary" />
              </div>

              <div className="flex-1 bg-approved-bg p-6 rounded-3xl border border-approved/20">
                <span className="label text-approved">Evidence (Net)</span>
                <p className="text-3xl font-black text-approved">₹46,200</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => onResolve(46200)}
                className="btn-primary w-full flex items-center justify-center gap-3 py-6"
              >
                <CheckCircle2 size={24} />
                Resolve & Apply ₹46,200
              </button>
              <button 
                onClick={onClose}
                className="btn-outline w-full py-6"
              >
                Keep My Input (Will require audit)
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 text-center border-t border-border">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Verified by OCR Engine v2.1 • 99.8% Confidence
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConflictModal;
