import React, { useState } from 'react';

const ApplicationPage = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    income: '',
    creditScore: '',
    employment: 'Employed (Salaried)',
    loanTerm: '36m',
    loanAmount: '',
    debts: ''
  });

  const loadDemoData = () => {
    setFormData({
      income: '28000',
      creditScore: '580',
      employment: 'Employed (Salaried)',
      loanTerm: '36m',
      loanAmount: '200000',
      debts: '8000'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const calculateDTI = () => {
    const monthlyIncome = parseFloat(formData.income) || 0;
    const monthlyDebts = parseFloat(formData.debts) || 0;
    if (monthlyIncome === 0) return 0;
    return ((monthlyDebts / monthlyIncome) * 100).toFixed(1);
  };

  const dti = calculateDTI();
  const loanMultiplier = formData.income > 0 ? (formData.loanAmount / formData.income).toFixed(1) : 0;

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900">Loan Application</h1>
          <p className="text-muted font-bold mt-2 uppercase tracking-widest text-[11px]">Submission Portal v4.0 • Secured TLS 1.3</p>
        </div>
        <button 
          onClick={loadDemoData}
          className="btn-outline px-6 py-3 text-xs self-start md:self-center uppercase tracking-widest"
        >
          Load Neural Test Case
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Form */}
        <div className="lg:col-span-2 bg-surface rounded-[2.5rem] shadow-card p-12 border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-accent/5 blur-[100px] -mr-32 -mt-32" />
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            {/* Row 1 */}
            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Monthly Income (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 45,000" 
                className="input-base"
                value={formData.income}
                onChange={(e) => setFormData({...formData, income: e.target.value})}
                required
              />
              <p className="text-[10px] text-slate-400 font-bold ml-1 italic">Calculated post-tax net intake</p>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Credit Score</label>
              <input 
                type="number" 
                placeholder="e.g. 720" 
                className="input-base"
                value={formData.creditScore}
                onChange={(e) => setFormData({...formData, creditScore: e.target.value})}
                required
              />
              <p className="text-[10px] text-slate-400 font-bold ml-1 italic">Min: 300 | Max: 850</p>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Employment Status</label>
              <select 
                className="input-base bg-white"
                value={formData.employment}
                onChange={(e) => setFormData({...formData, employment: e.target.value})}
              >
                <option>Employed (Salaried)</option>
                <option>Self-Employed</option>
                <option>Unemployed</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Loan Term</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {['12m', '24m', '36m', '48m', '60m'].map(term => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setFormData({...formData, loanTerm: term})}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all duration-200 ${
                      formData.loanTerm === term 
                      ? 'bg-primary-accent text-white border-primary-accent shadow-lg shadow-primary-accent/20' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-primary-accent/30'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Loan Amount (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 2,00,000" 
                className="input-base"
                value={formData.loanAmount}
                onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                required
              />
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Existing Monthly Debts (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 5,000" 
                className="input-base"
                value={formData.debts}
                onChange={(e) => setFormData({...formData, debts: e.target.value})}
                required
              />
            </div>

            {/* Footer */}
            <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 mt-8 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400 text-[12px] font-bold italic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                AES-256 Encrypted Transmission
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary flex items-center gap-3 min-w-[280px] justify-center py-6 text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
                    Neural Processing...
                  </>
                ) : (
                  <>
                    Validate & Submit
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Summary Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-surface rounded-[2rem] shadow-card p-10 border border-slate-50 sticky top-12">
            <h3 className="label mb-8 pb-4 border-b border-slate-100">Live Simulation Status</h3>
            
            <div className="space-y-10">
              {/* DTI */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">DTI Ratio</span>
                  <span className={`text-2xl font-black ${dti > 60 ? 'text-rejected' : dti > 40 ? 'text-warning' : 'text-approved'}`}>
                    {dti}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-700 rounded-full ${dti > 60 ? 'bg-rejected' : dti > 40 ? 'bg-warning' : 'bg-approved'}`}
                    style={{ width: `${Math.min(dti, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 italic">Target: Below 40%</p>
              </div>

              {/* Loan Multiplier */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Multiplier</span>
                  <span className={`text-2xl font-black ${loanMultiplier > 20 ? 'text-rejected' : loanMultiplier > 10 ? 'text-warning' : 'text-approved'}`}>
                    {loanMultiplier}x
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-700 rounded-full ${loanMultiplier > 20 ? 'bg-rejected' : loanMultiplier > 10 ? 'bg-warning' : 'bg-approved'}`}
                    style={{ width: `${Math.min((loanMultiplier / 20) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 italic">Target: Below 10x</p>
              </div>

              {/* Monthly EMI */}
              <div className="pt-8 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Estimated EMI</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">₹6,420</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 italic px-3 py-1 bg-slate-50 rounded-lg inline-block">Estimated @ 8.5% p.a.</p>
              </div>

              {/* Quick Checks */}
              <div className="space-y-4 pt-8 border-t border-slate-100">
                {[
                  { label: 'Income Threshold', status: formData.income >= 25000 },
                  { label: 'Credit Integrity', status: formData.creditScore >= 650 },
                  { label: 'Liquidity Ratio', status: dti <= 40 }
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${check.status ? 'bg-approved/5 border-approved/20 text-approved' : 'bg-rejected/5 border-rejected/20 text-rejected'}`}>
                      {check.status ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[12px] font-black uppercase tracking-widest ${check.status ? 'text-slate-700' : 'text-slate-400'}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
