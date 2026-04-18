import React from 'react';
import { motion } from 'framer-motion';

const SHAPChart = ({ data }) => {
  // Find max value to scale the bars
  const maxVal = Math.max(...data.map(d => Math.abs(d.shapValue)));
  
  return (
    <div className="w-full space-y-8 py-6">
      <div className="flex justify-between items-center bg-slate-50 px-6 py-4 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-approved rounded-sm" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Helps Approval</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-rejected rounded-sm" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hurts Approval</span>
        </div>
      </div>

      <div className="space-y-6">
        {data.map((item, idx) => {
          const isPositive = item.shapValue > 0;
          const barWidth = (Math.abs(item.shapValue) / maxVal) * 100;
          
          return (
            <div key={idx} className="relative h-12 flex items-center">
              {/* Baseline */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 z-10" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-full h-8 flex">
                   {/* Negative Side */}
                   <div className="flex-1 flex justify-end pr-px">
                     {!isPositive && (
                       <motion.div
                         initial={{ width: 0 }}
                         animate={{ width: `${barWidth}%` }}
                         transition={{ duration: 0.8, delay: idx * 0.1 }}
                         className="h-full bg-rejected/80 rounded-l-lg border-y border-l border-rejected/20"
                       />
                     )}
                   </div>
                   
                   {/* Positive Side */}
                   <div className="flex-1 flex justify-start pl-px">
                     {isPositive && (
                       <motion.div
                         initial={{ width: 0 }}
                         animate={{ width: `${barWidth}%` }}
                         transition={{ duration: 0.8, delay: idx * 0.1 }}
                         className="h-full bg-approved/80 rounded-r-lg border-y border-r border-approved/20"
                       />
                     )}
                   </div>
                 </div>
              </div>
              
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
                <span className={`text-[11px] font-black uppercase tracking-widest ${!isPositive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {!isPositive && item.feature}
                </span>
                <span className={`text-[11px] font-black uppercase tracking-widest ${isPositive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {isPositive && item.feature}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SHAPChart;
