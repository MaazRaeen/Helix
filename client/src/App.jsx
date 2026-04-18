import React, { useState, useEffect } from 'react';
import api from './utils/api';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import Sidebar from './components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const [view, setView] = useState('list'); // 'list' or 'dashboard'
    const [selectedCaseId, setSelectedCaseId] = useState(null);

    const handleSelectCase = (id) => {
        setSelectedCaseId(id);
        setView('dashboard');
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 relative">
            {/* Immersive Background System */}
            <div className="bg-mesh" />
            <div className="fixed inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />
            
            {/* Dynamic Light Sources */}
            <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary-600/10 rounded-full blur-[160px] animate-float pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-accent/10 rounded-full blur-[160px] animate-float pointer-events-none" style={{ animationDelay: '-8s' }} />
            <div className="fixed top-[40%] left-[20%] w-[20vw] h-[20vw] bg-indigo-400/10 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '-12s' }} />

            <Sidebar currentView={view} onViewChange={setView} />

            <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
                {/* Content Container */}
                <div className="max-w-[1400px] mx-auto p-12 lg:p-16">
                    <AnimatePresence mode="wait">
                        {view === 'list' ? (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, scale: 0.99, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.01, y: -10 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full"
                            >
                                <div className="mb-12">
                                    <h2 className="text-4xl font-display font-black tracking-tight text-slate-900 mb-2">
                                        Case Explorer
                                    </h2>
                                    <p className="text-slate-500 font-medium max-w-2xl">
                                        Real-time decision pipeline for the Governance Engine. Review, analyze, and contest AI-driven approvals.
                                    </p>
                                </div>
                                <CaseList onSelect={handleSelectCase} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full"
                            >
                                <Dashboard 
                                    caseId={selectedCaseId} 
                                    onBack={() => setView('list')} 
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Footer Decor */}
                <div className="h-24 flex items-center justify-center border-t border-slate-200/50 mt-12 bg-white/10 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                      Decentralized Governance Ledger • TLS Secured
                    </p>
                </div>
            </main>
        </div>
    );
}

export default App;
