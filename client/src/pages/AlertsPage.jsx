import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, ShieldAlert, Cpu, Network, History, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import axios from 'axios';

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'CRITICAL', title: 'SHAP Baseline Drift detected', description: 'Monthly income weighting has shifted by 0.12 units globally. Neural re-calibration recommended.', time: '2m ago', icon: <Cpu />, color: 'text-rose-500 bg-rose-50' },
        { id: 2, type: 'CONVERSION', title: 'Decision Reversed in Case #28B4', description: 'Contestation layer successful for applicant Priya Somaiya. Target shift: +34.2%.', time: '14m ago', icon: <Zap />, color: 'text-amber-500 bg-amber-50' },
        { id: 3, type: 'SECURITY', title: 'Policy Directive Alpha v4.2 Applied', description: 'ISO-42001 compliance standards enforced across all regional governance nodes.', time: '1h ago', icon: <ShieldAlert />, color: 'text-sky-500 bg-sky-50' },
        { id: 4, type: 'NETWORK', title: 'Nexus Hub Sync (99.9%)', description: 'Executive Explorer instances synchronised across 14 geo-distributed ledger nodes.', time: '3h ago', icon: <Network />, color: 'text- emerald-500 bg-emerald-50' },
        { id: 5, type: 'GOVERNANCE', title: 'New Executive Directive Issued', description: 'ID: HLX-2491 created for high-priority directive: Corporate Audit v2.', time: '5h ago', icon: <History />, color: 'text-indigo-500 bg-indigo-50' }
    ]);

    const [recentCases, setRecentCases] = useState([]);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const response = await axios.get('http://localhost:5070/api/cases');
                setRecentCases(response.data.slice(0, 3));
            } catch (error) {
                console.error("Alerts fetching failed:", error);
            }
        };
        fetchRecent();
    }, []);

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary-600">
                        <Bell size={20} className="stroke-[3]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Oracle Network Feed</span>
                    </div>
                    <h1 className="text-5xl font-display font-black text-slate-900 tracking-tight">Governance Intelligence</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Real-time Neural Telemetry & Policy Updates</p>
                </div>
                
                <div className="flex gap-4">
                    <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
                        Mark all as reviewed
                    </button>
                    <button className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/10">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Alerts Feed */}
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="label text-slate-400 tracking-[0.4em]">Active Telemetry Stream</h2>
                    <AnimatePresence>
                        {alerts.map((alert, idx) => (
                            <motion.div 
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-card hover:border-primary-accent/20 transition-all group flex gap-8 items-start cursor-pointer"
                            >
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-sm ${alert.color}`}>
                                    {React.cloneElement(alert.icon, { size: 28, strokeWidth: 2.5 })}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${alert.color}`}>
                                                {alert.type}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{alert.time}</span>
                                        </div>
                                        <button className="text-slate-300 hover:text-rose-500 transition-colors">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-display font-black text-slate-900 tracking-tight group-hover:text-primary-accent transition-colors">{alert.title}</h3>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{alert.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Right Column: Status & Recent Activity */}
                <div className="lg:col-span-4 space-y-12">
                     <section className="space-y-6">
                        <h2 className="label text-slate-400 tracking-[0.4em]">Helix Vitality</h2>
                        <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-primary-accent/20 blur-[60px] -mr-16 -mt-16" />
                           <div className="relative z-10 space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Global Stability</p>
                                    <h3 className="text-4xl font-display font-black tracking-tighter">99.98%</h3>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-accent w-[99.9%]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase">Latency</p>
                                        <p className="text-xl font-black">1.4ms</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase">Throughput</p>
                                        <p className="text-xl font-black">420/s</p>
                                    </div>
                                </div>
                           </div>
                        </div>
                     </section>

                     <section className="space-y-6">
                        <h2 className="label text-slate-400 tracking-[0.4em]">Neural Commit Log</h2>
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-card space-y-6">
                            {recentCases.map((c, i) => (
                                <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.updated_state?.decision === 'Approved' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-black text-slate-900 truncate">CASE #{c._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Decision Processed</p>
                                    </div>
                                    <span className={`text-[10px] font-black ${c.updated_state?.decision === 'Approved' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {c.updated_state?.decision === 'Approved' ? '✓' : '✗'}
                                    </span>
                                </div>
                            ))}
                        </div>
                     </section>

                     <div className="p-10 bg-primary-accent rounded-[3rem] text-white flex items-center justify-between group cursor-pointer shadow-lg shadow-primary-accent/20">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Oracle Protocol</p>
                            <h3 className="text-2xl font-black tracking-tight leading-none">Settings</h3>
                         </div>
                         <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                             <ArrowRight size={20} />
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;
