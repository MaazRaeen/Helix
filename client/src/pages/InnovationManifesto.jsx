import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Sparkles, ShieldAlert, Cpu, 
    ArrowRight, CheckCircle2, 
    Scale, MessageSquare, LineChart,
    RotateCcw, Fingerprint, HelpCircle
} from 'lucide-react';

const InnovationManifesto = () => {
    const navigate = useNavigate();
    const sections = [
        {
            icon: <Fingerprint className="text-primary-600" size={40} />,
            title: "Process Over Parameters",
            content: "The uniqueness isn't in standard inputs like income or credit scores—those are industry standards. The true innovation lies in transforming a static, one-way AI verdict into an interactive, user-driven dialogue.",
            accent: "bg-primary-50 text-primary-600"
        },
        {
            icon: <RotateCcw className="text-accent" size={40} />,
            title: "The Dynamic Decision Loop",
            content: "Typical systems provide a dead-end 'reject.' Helix introduces a dynamic loop: Decision → Contestation → Transformation. Users actively influence and change outcomes through a transparent re-evaluation process.",
            accent: "bg-accent/10 text-accent"
        },
        {
            icon: <Cpu className="text-indigo-600" size={40} />,
            title: "Advisor, Not Authority",
            content: "Our counterfactual engine suggests minimal changes required for approval, turning the system from a rejecting authority into an advisor. We don't just judge users; we guide them toward success.",
            accent: "bg-indigo-50 text-indigo-600"
        },
        {
            icon: <Scale className="text-emerald-600" size={40} />,
            title: "The Right to Appeal",
            content: "We introduce accountability by simulating a 'Right to Appeal'—a feature missing in most automated platforms. We treat AI decisions as challengeable and improvable, not final.",
            accent: "bg-emerald-50 text-emerald-600"
        }
    ];

    return (
        <div className="min-h-screen pb-20 overflow-hidden">
            {/* Hero Section */}
            <section className="pt-20 pb-32 text-center relative">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto px-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-glow animate-pulse">
                        <Sparkles size={14} />
                        Hackathon Innovation Showcase
                    </div>
                    
                    <h1 className="text-7xl md:text-8xl font-display font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                        AI should not be <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent to-indigo-600">final</span>, it should be <br/>
                        challengeable.
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
                        Helix transforms static AI decisions into a transparent contestation layer. Because the innovation isn't in the data—it's in the <span className="text-slate-900 font-black">empowerment</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button 
                            onClick={() => navigate('/apply')}
                            className="btn-primary w-full sm:w-auto px-12 py-5 text-lg group shadow-2xl ring-offset-4 ring-offset-slate-50 ring-4 ring-primary-600/10"
                        >
                            Explore the Interface
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
                
                {/* Visual Storytelling Background Elements */}
                <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-primary-600/5 blur-[100px] rounded-full animate-float" />
                <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-accent/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-4s' }} />
            </section>

            {/* Core Pillars */}
            <section className="max-w-[1400px] mx-auto px-12 lg:px-16 mb-32">
                <h2 className="label text-center mb-16 tracking-[0.5em] text-slate-400">Why Helix Stands Out</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="bg-white/40 backdrop-blur-xl border border-white p-12 rounded-[3.5rem] shadow-card hover:shadow-2xl hover:border-primary-100 transition-all group"
                        >
                            <div className={`w-20 h-20 ${section.accent} rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                {section.icon}
                            </div>
                            <h3 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight">
                                {section.title}
                            </h3>
                            <p className="text-slate-600 font-medium leading-relaxed text-lg">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Practical Relevance Section */}
            <section className="bg-slate-900 text-white rounded-[4rem] mx-12 lg:mx-16 p-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10 max-w-3xl">
                    <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-primary-400 mb-6">Real-World Impact</h2>
                    <h3 className="text-5xl font-display font-black tracking-tight mb-10 leading-none">
                        Questioning decisions is a <br/> human right.
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                <MessageSquare className="text-primary-400" size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-white uppercase tracking-wider text-sm mb-2">Accountability</h4>
                                <p className="text-slate-400 font-medium">Aligning AI with modern expectations of fairness and user empowerment.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                <HelpCircle className="text-accent" size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-white uppercase tracking-wider text-sm mb-2">Transparency</h4>
                                <p className="text-slate-400 font-medium">The decision delta view shows probability shifts and feature impact.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating UI Mockup Element */}
                <div className="hidden lg:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-1/3 aspect-video bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[2rem] p-8 -rotate-6 shadow-2xl">
                    <div className="w-full h-4 bg-white/10 rounded-full mb-6" />
                    <div className="space-y-4">
                        <div className="w-3/4 h-2 bg-white/5 rounded-full" />
                        <div className="w-1/2 h-2 bg-white/5 rounded-full" />
                        <div className="w-2/3 h-2 bg-white/5 rounded-full" />
                    </div>
                    <div className="mt-12 flex justify-end">
                        <div className="w-24 h-10 bg-primary-600 rounded-xl" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InnovationManifesto;
