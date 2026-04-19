import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Sparkles, ArrowRight, ArrowUpRight, CheckCircle2, 
    Scale, MessageSquare, RotateCcw, Fingerprint, 
    Cpu, Shield, Zap, BarChart3, Eye, Users,
    ChevronRight, TrendingUp, Activity
} from 'lucide-react';

// Animated counter hook
const useCounter = (target, duration = 2000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseFloat(target);
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
};

const StatCounter = ({ value, suffix = '', prefix = '', label }) => {
    const count = useCounter(value);
    return (
        <div className="text-center">
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {prefix}{Number.isInteger(value) ? Math.round(count) : count.toFixed(1)}{suffix}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{label}</p>
        </div>
    );
};

const InnovationManifesto = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: RotateCcw,
            title: "Decision Loop",
            desc: "Contest → Re-evaluate → Transform. Turn static verdicts into living, improvable decisions.",
            color: "from-violet-500 to-purple-600",
            lightColor: "bg-violet-50 text-violet-600 border-violet-100"
        },
        {
            icon: Cpu,
            title: "Counterfactual Engine",
            desc: "AI suggests minimum changes to flip your result. An advisor, not an authority.",
            color: "from-blue-500 to-cyan-500",
            lightColor: "bg-blue-50 text-blue-600 border-blue-100"
        },
        {
            icon: Scale,
            title: "Right to Appeal",
            desc: "Every decision is challengeable. Submit evidence, modify inputs, get re-evaluated.",
            color: "from-emerald-500 to-teal-500",
            lightColor: "bg-emerald-50 text-emerald-600 border-emerald-100"
        },
        {
            icon: Eye,
            title: "Explainability Layer",
            desc: "SHAP charts, feature impact tables, and AI-written explanations for every decision.",
            color: "from-amber-500 to-orange-500",
            lightColor: "bg-amber-50 text-amber-600 border-amber-100"
        }
    ];

    const workflow = [
        { step: "01", label: "Submit", desc: "Enter application data", icon: Shield },
        { step: "02", label: "Analyze", desc: "ML model evaluates", icon: Activity },
        { step: "03", label: "Explain", desc: "Transparent reasoning", icon: Eye },
        { step: "04", label: "Contest", desc: "Challenge if unfair", icon: Scale },
        { step: "05", label: "Transform", desc: "Get a new verdict", icon: TrendingUp }
    ];

    return (
        <div className="min-h-screen pb-20 overflow-hidden -m-12 lg:-m-16 -mt-12 lg:-mt-16">
            
            {/* ===== HERO ===== */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Gradient mesh background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary-50/30" />
                <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] bg-violet-400/8 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-amber-300/6 rounded-full blur-[80px]" />
                
                {/* Grid dots */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }} />

                <div className="relative z-10 max-w-[1400px] mx-auto px-12 lg:px-16 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Text */}
                        <motion.div 
                            initial={{ opacity: 0, x: -40 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 0.9 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-xl">
                                <Sparkles size={12} />
                                AI Governance Platform
                            </div>

                            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-display font-black text-slate-900 tracking-[-0.04em] leading-[0.92] mb-8">
                                Make AI<br/>
                                <span className="relative">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-violet-500 to-primary-600">decisions</span>
                                    <motion.div 
                                        className="absolute -bottom-2 left-0 h-3 bg-primary-200/40 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                    />
                                </span><br/>
                                challengeable.
                            </h1>

                            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg mb-10">
                                Helix transforms one-way AI verdicts into an interactive contestation layer. 
                                Transparent explanations. Right to appeal. Real empowerment.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={() => navigate('/apply')}
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all"
                                >
                                    Start Application
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button 
                                    onClick={() => navigate('/explorer')}
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-700 rounded-2xl font-black text-sm border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
                                >
                                    Explore Cases
                                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Right: Bento Preview Cards */}
                        <motion.div 
                            initial={{ opacity: 0, x: 40 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 0.9, delay: 0.3 }}
                            className="hidden lg:grid grid-cols-2 gap-4"
                        >
                            {/* Card 1: Decision */}
                            <div className="bg-white rounded-3xl p-7 shadow-lg shadow-slate-200/50 border border-slate-100 col-span-2">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                            <CheckCircle2 size={20} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Verdict</p>
                                            <p className="text-sm font-black text-emerald-600">APPROVED</p>
                                        </div>
                                    </div>
                                    <span className="text-3xl font-black text-emerald-600">87.2%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: '87.2%' }}
                                        transition={{ delay: 1, duration: 1.2 }}
                                    />
                                </div>
                            </div>

                            {/* Card 2: Factors */}
                            <div className="bg-white rounded-3xl p-7 shadow-lg shadow-slate-200/50 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Top Factors</p>
                                <div className="space-y-3">
                                    {['Credit History', 'Married', 'Property Area'].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : 'bg-violet-500'}`} />
                                            <span className="text-[11px] font-bold text-slate-600 flex-1">{f}</span>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${i === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                                {i === 0 ? '+53%' : i === 1 ? '+26%' : '+13%'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 3: Contest */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 shadow-lg text-white">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Decision Delta</p>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl font-black text-emerald-400">+46.4%</span>
                                    <span className="text-[11px] font-bold text-white/50">confidence shift</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-[9px] font-black bg-rose-500/20 text-rose-400 px-2 py-1 rounded-lg">BEFORE: REJECT</span>
                                    <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg">AFTER: APPROVE</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-[1400px] mx-auto px-12 lg:px-16 -mt-12 relative z-20"
            >
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-slate-100">
                    <StatCounter value={11} label="ML Features" />
                    <StatCounter value={87.2} suffix="%" label="Peak Accuracy" />
                    <StatCounter value={100} suffix="%" label="Explainability" />
                    <StatCounter value={5} label="Workflow Steps" />
                </div>
            </motion.section>

            {/* ===== FEATURE BENTO ===== */}
            <section className="max-w-[1400px] mx-auto px-12 lg:px-16 mt-32">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-[11px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4">Core Innovation</p>
                    <h2 className="text-5xl font-display font-black text-slate-900 tracking-tight">
                        Not just a model. A <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">governance system</span>.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {features.map((f, idx) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all cursor-default"
                            >
                                <div className="flex items-start gap-6">
                                    <div className={`w-14 h-14 rounded-2xl ${f.lightColor} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">{f.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed text-[15px]">{f.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ===== WORKFLOW STEPS ===== */}
            <section className="max-w-[1400px] mx-auto px-12 lg:px-16 mt-32">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-950 rounded-[3rem] p-16 relative overflow-hidden"
                >
                    {/* BG effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-violet-600/10 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px]" />

                    <div className="relative z-10">
                        <p className="text-[11px] font-black text-primary-400 uppercase tracking-[0.4em] mb-4">Decision Pipeline</p>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-16">
                            From submission to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">transformation</span>
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {workflow.map((w, idx) => {
                                const Icon = w.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.15 }}
                                        className="relative group"
                                    >
                                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                                            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                                                <Icon size={22} className="text-primary-400" />
                                            </div>
                                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">{w.step}</p>
                                            <p className="text-white font-black text-sm tracking-tight">{w.label}</p>
                                            <p className="text-white/40 text-[11px] font-medium mt-1">{w.desc}</p>
                                        </div>
                                        {idx < 4 && (
                                            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                                                <ChevronRight size={16} className="text-white/20" />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ===== CTA ===== */}
            <section className="max-w-[1400px] mx-auto px-12 lg:px-16 mt-32 mb-12">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary-100">
                        <Zap size={12} />
                        Ready to explore?
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight mb-6">
                        AI should not be final,<br/>
                        it should be <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">questionable</span>.
                    </h2>
                    <p className="text-lg text-slate-500 max-w-lg mx-auto mb-10">
                        Start with a loan application and experience the full governance pipeline — from prediction to contestation.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate('/apply')}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 shadow-2xl shadow-primary-600/20 transition-all"
                        >
                            Launch Application
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={() => navigate('/ledger')}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-700 rounded-2xl font-black text-sm border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
                        >
                            View Decision Ledger
                            <BarChart3 size={18} />
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
                        {['Logistic Regression', 'Google Gemini', 'SHAP Analysis', 'JWT Auth', 'MongoDB'].map(tech => (
                            <span key={tech} className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{tech}</span>
                        ))}
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default InnovationManifesto;
