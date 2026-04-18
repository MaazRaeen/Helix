import React from 'react';
import { motion } from 'framer-motion';

const DeltaChart = ({ data }) => {
  const maxVal = Math.max(...data.flatMap(d => [Math.abs(d.shapBefore), Math.abs(d.shapAfter)]));
  
  return (
    <div className="w-full space-y-12 py-8">
      <div className="flex justify-end gap-8 mb-4">
        <div className="flex items-center gap-2">
           <div className="w-4 h-4 bg-slate-900/20 rounded-sm" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Original SHAP</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-4 h-4 bg-slate-900 rounded-sm" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Post-Appeal SHAP</span>
        </div>
      </div>

      <div className="space-y-10">
        {data.map((item, idx) => {
          const beforeWidth = (Math.abs(item.shapBefore) / maxVal) * 100;
          const afterWidth = (Math.abs(item.shapAfter) / maxVal) * 100;
          const isBeforePos = item.shapBefore > 0;
          const isAfterPos = item.shapAfter > 0;
          
          return (
            <div key={idx} className="relative h-16 flex items-center">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 z-10" />
              
              <div className="absolute inset-x-0 top-0 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                 {item.feature}
              </div>

              <div className="absolute inset-x-0 top-6 bottom-0 flex flex-col justify-center gap-1.5">
                 {/* Before Bar */}
                 <div className="w-full h-4 flex">
                    <div className="flex-1 flex justify-end">
                       {!isBeforePos && (
                         <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${beforeWidth}%` }}
                           transition={{ duration: 1, delay: idx * 0.1 }}
                           className="h-full bg-slate-900/20 rounded-l-sm"
                         />
                       )}
                    </div>
                    <div className="flex-1 flex justify-start">
                       {isBeforePos && (
                         <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${beforeWidth}%` }}
                           transition={{ duration: 1, delay: idx * 0.1 }}
                           className="h-full bg-slate-900/20 rounded-r-sm"
                         />
                       )}
                    </div>
                 </div>

                 {/* After Bar */}
                 <div className="w-full h-4 flex text-center">
                    <div className="flex-1 flex justify-end">
                       {!isAfterPos && (
                         <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${afterWidth}%` }}
                           transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                           className={`h-full rounded-l-sm ${item.shapAfter > item.shapBefore ? 'bg-emerald-500' : 'bg-slate-900'}`}
                         />
                       )}
                    </div>
                    <div className="flex-1 flex justify-start">
                       {isAfterPos && (
                         <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${afterWidth}%` }}
                           transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                           className={`h-full rounded-r-sm ${item.shapAfter > item.shapBefore ? 'bg-emerald-500' : 'bg-slate-900'}`}
                         />
                       )}
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeltaChart;

