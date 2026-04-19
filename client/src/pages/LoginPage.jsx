import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LogIn, UserPlus, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-primary-500/20"
          >
            <Shield size={36} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2">HELIX</h1>
          <p className="text-primary-400 font-bold text-[11px] uppercase tracking-[0.4em]">Governance Engine</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 shadow-2xl">
          {/* Mode Tabs */}
          <div className="flex gap-2 bg-white/5 rounded-2xl p-1 mb-8">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <LogIn size={16} className="inline mr-2" /> Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <UserPlus size={16} className="inline mr-2" /> Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (register only) */}
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="e.g. Maaz Raeen"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="e.g. admin@helix.gov"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 bg-rose-500/10 text-rose-400 px-4 py-3 rounded-xl text-sm font-bold border border-rose-500/20"
                >
                  <AlertCircle size={18} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-700 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In to Helix' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setForm({ name: '', email: 'admin@helix.gov', password: 'admin123' })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center hover:bg-white/10 transition-colors group"
              >
                <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Admin</p>
                <p className="text-[11px] text-white/60 font-medium mt-1 group-hover:text-white/80">admin@helix.gov</p>
              </button>
              <button
                onClick={() => setForm({ name: '', email: 'maaz@helix.gov', password: 'user123' })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center hover:bg-white/10 transition-colors group"
              >
                <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest">User</p>
                <p className="text-[11px] text-white/60 font-medium mt-1 group-hover:text-white/80">maaz@helix.gov</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mt-8">
          Powered by Neural Governance Protocol v2.1.0
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
