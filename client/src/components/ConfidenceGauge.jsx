import React from 'react';
import { motion } from 'framer-motion';

const ConfidenceGauge = ({ confidence, status }) => {
  const isApproved = status.toLowerCase() === 'approved';
  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;
  
  return (
    <div className="relative flex flex-col items-center">
      <svg width="200" height="120" className="transform -rotate-180">
        {/* Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Progress */}
        <motion.path
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d="M 180 100 A 80 80 0 0 0 20 100"
          fill="none"
          stroke={isApproved ? "var(--approved)" : "var(--rejected)"}
          strokeWidth="20"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="transform rotate-180 origin-center"
        />
      </svg>
      
      <div className="absolute top-[45px] flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-slate-900"
        >
          {confidence}%
        </motion.span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
          Model Confidence
        </span>
      </div>
      
      <div className={`
        mt-4 px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest
        ${confidence > 60 
          ? 'bg-approved-bg text-approved border-approved/20' 
          : 'bg-warning-bg text-warning border-warning/20'}
      `}>
        {confidence > 60 ? '✓ Confident - High Certainty' : '⚠ Borderline - Near Threshold'}
      </div>
    </div>
  );
};

export default ConfidenceGauge;

