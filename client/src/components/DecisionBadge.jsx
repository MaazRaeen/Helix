import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const DecisionBadge = ({ status, applicationNumber }) => {
  const isApproved = status.toLowerCase() === 'approved';
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        flex items-center gap-3 px-8 py-4 rounded-full border-2 
        ${isApproved 
          ? 'bg-approved-bg border-approved text-approved outline outline-8 outline-approved/5' 
          : 'bg-rejected-bg border-rejected text-rejected outline outline-8 outline-rejected/5'}
      `}>
        {isApproved ? (
          <CheckCircle2 size={32} strokeWidth={2.5} />
        ) : (
          <XCircle size={32} strokeWidth={2.5} />
        )}
        <span className="text-2xl font-black uppercase tracking-widest">{status}</span>
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
        Application #{applicationNumber}
      </span>
    </div>
  );
};

export default DecisionBadge;

