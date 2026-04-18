import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApplication } from '../context/ApplicationContext';

const ApplicationPage = () => {
  const navigate = useNavigate();
  const { setCurrentApplicationId, setLatestResult } = useApplication();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    income: '',
    coapplicant_income: '0',
    creditScore: '',
    employment: 'Salaried',
    loanTerm: '360',
    loanAmount: '',
    debts: '',
    gender: 'Male',
    married: 'No',
    dependents: '0',
    education: 'Graduate',
    self_employed: 'No',
    property_area: 'Semiurban'
  });

  const loadDemoData = () => {
    setFormData({
      name: 'Maaz Raeen',
      income: '45000',
      coapplicant_income: '20000',
      creditScore: '720',
      employment: 'Salaried',
      loanTerm: '360',
      loanAmount: '250000',
      debts: '5000',
      gender: 'Male',
      married: 'Yes',
      dependents: '1',
      education: 'Graduate',
      self_employed: 'No',
      property_area: 'Semiurban'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Map frontend fields to backend expected fields
      const payload = {
        name: formData.name || "Anonymous Applicant",
        income: parseFloat(formData.income),
        coapplicant_income: parseFloat(formData.coapplicant_income),
        credit_score: parseFloat(formData.creditScore),
        loan_amount: parseFloat(formData.loanAmount),
        loan_term: parseFloat(formData.loanTerm),
        gender: formData.gender,
        married: formData.married,
        dependents: formData.dependents,
        education: formData.education,
        self_employed: formData.self_employed,
        property_area: formData.property_area,
        existing_debt: parseFloat(formData.debts),
        // Legacy compatibility
        employment_length: 24,
        bank_balance: 15000
      };

      const response = await axios.post('http://localhost:5070/api/predict', payload);
      const data = response.data;
      
      setCurrentApplicationId(data._id);
      setLatestResult(data);
      
      // Navigate to the decision page with the new case ID
      navigate(`/decision/${data._id}`);
    } catch (error) {
      console.error("Submission error:", error);
      alert("System connection failed. Please ensure the Governance Server is active.");
    } finally {
      setLoading(false);
    }
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
            <div className="md:col-span-2 flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Maaz Raeen" 
                className="input-base"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <p className="text-[10px] text-slate-400 font-bold ml-1 italic text-right border-r-2 border-primary-accent pr-3">Legal identity for audit purposes</p>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Applicant Income (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 45,000" 
                className="input-base"
                value={formData.income}
                onChange={(e) => setFormData({...formData, income: e.target.value})}
                required
              />
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Coapplicant Income (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 20,000" 
                className="input-base"
                value={formData.coapplicant_income}
                onChange={(e) => setFormData({...formData, coapplicant_income: e.target.value})}
              />
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
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Education Level</label>
              <select 
                className="input-base bg-white"
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
              >
                <option>Graduate</option>
                <option>Not Graduate</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Gender</label>
              <div className="flex gap-4 pt-1">
                {['Male', 'Female'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                      formData.gender === g ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Marital Status</label>
              <div className="flex gap-4 pt-1">
                {['Yes', 'No'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({...formData, married: m})}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                      formData.married === m ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'
                    }`}
                  >
                    {m === 'Yes' ? 'Married' : 'Single'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Dependents</label>
              <select 
                className="input-base bg-white"
                value={formData.dependents}
                onChange={(e) => setFormData({...formData, dependents: e.target.value})}
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Property Area</label>
              <select 
                className="input-base bg-white"
                value={formData.property_area}
                onChange={(e) => setFormData({...formData, property_area: e.target.value})}
              >
                <option>Urban</option>
                <option>Semiurban</option>
                <option>Rural</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-primary-accent transition-colors">Self Employed</label>
              <div className="flex gap-4 pt-1">
                {['Yes', 'No'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({...formData, self_employed: s})}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                      formData.self_employed === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

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

              <div className="pt-8 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Estimated EMI</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">₹6,420</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 italic px-3 py-1 bg-slate-50 rounded-lg inline-block">Estimated @ 8.5% p.a.</p>
              </div>

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
