import React from 'react';

const FeatureImpactTable = ({ data }) => {
  return (
    <div className="w-full mt-10 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Factor</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 text-center">Your Value</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 text-center">Impact %</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 text-right">Effect</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((item, idx) => {
            const isPositive = item.direction === 'positive';
            const impactPct = Math.round(Math.abs(item.shapValue) * 100);
            
            return (
              <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-[13px] font-black text-slate-800">{item.feature}</td>
                <td className="px-6 py-4 text-[13px] font-mono text-slate-500 text-center">{item.value}</td>
                <td className="px-6 py-4 text-[13px] font-black text-slate-900 text-center">{impactPct}%</td>
                <td className="px-6 py-4 text-right">
                  <span className={`
                    inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                    ${isPositive 
                      ? 'bg-approved-bg text-approved border border-approved/20' 
                      : 'bg-rejected-bg text-rejected border border-rejected/20'}
                  `}>
                    {isPositive ? 'Positive' : 'Negative'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureImpactTable;

