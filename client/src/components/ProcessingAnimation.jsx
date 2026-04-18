import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Database, Network } from 'lucide-react';

const ProcessingAnimation = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: <Cpu />, text: 'Synchronizing Neural Weights...', duration: 800 },
    { icon: <Database />, text: 'Parsing Evidential Documents...', duration: 1000 },
    { icon: <Network />, text: 'Running SHAP Simulation...', duration: 1200 },
    { icon: <ShieldCheck />, text: 'Finalizing Governance Ledger...', duration: 800 }
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep(s => s + 1);
      }, steps[step].duration);
      return () => clearTimeout(timer);
    } else {
      setTimeout(onComplete, 500);
    }
  }, [step, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 backdrop-blur-xl">
      <div className="text-center">
        <div className="relative mb-12">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="w-40 h-40 rounded-full border-4 border-slate-100 border-t-primary-accent"
           />
           <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="p-6 bg-white rounded-3xl shadow-xl border border-slate-50 text-primary-accent"
                >
                  {steps[Math.min(step, steps.length - 1)].icon}
                </motion.div>
              </AnimatePresence>
           </div>
        </div>
        
        <div className="h-8">
           <AnimatePresence mode="wait">
             <motion.p
               key={step}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="text-[14px] font-black uppercase tracking-[0.3em] text-slate-900"
             >
               {steps[Math.min(step, steps.length - 1)].text}
             </motion.p>
           </AnimatePresence>
        </div>
        
        <div className="mt-8 flex justify-center gap-1.5">
           {steps.map((_, i) => (
             <motion.div 
               key={i}
               className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-primary-accent outline outline-4 outline-primary-accent/10' : 'w-2 bg-slate-200'}`}
             />
           ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingAnimation;
