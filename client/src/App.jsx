import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import Sidebar from './components/Sidebar';
import ApplicationPage from './pages/ApplicationPage';
import DecisionPage from './pages/DecisionPage';
import ContestPage from './pages/ContestPage';
import DeltaPage from './pages/DeltaPage';
import InnovationManifesto from './pages/InnovationManifesto';
import DirectivePage from './pages/DirectivePage';
import LedgerPage from './pages/LedgerPage';
import AlertsPage from './pages/AlertsPage';
import LoginPage from './pages/LoginPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatWidget from './components/ChatWidget';
import { motion, AnimatePresence } from 'framer-motion';

// Route wrapper for animated transitions
const PageMotion = ({ children, ...props }) => (
    <motion.div className="w-full" {...props}>{children}</motion.div>
);

const fade = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 }, transition: { duration: 0.6 } };

// Main authenticated app shell
function AppShell() {
    const location = useLocation();
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[11px]">Initializing Helix...</p>
                </div>
            </div>
        );
    }

    if (!user) return <LoginPage />;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 relative">
            {/* Immersive Background System */}
            <div className="bg-mesh" />
            <div className="fixed inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />
            
            {/* Dynamic Light Sources */}
            <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary-600/10 rounded-full blur-[160px] animate-float pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-accent/10 rounded-full blur-[160px] animate-float pointer-events-none" style={{ animationDelay: '-8s' }} />
            <div className="fixed top-[40%] left-[20%] w-[20vw] h-[20vw] bg-indigo-400/10 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '-12s' }} />

            <Sidebar />

            <main className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth">
                <div className="max-w-[1400px] mx-auto p-12 lg:p-16">
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={
                                <PageMotion initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.7 }}>
                                    <InnovationManifesto />
                                </PageMotion>
                            } />

                            <Route path="/explorer" element={
                                <PageMotion initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.4 }}>
                                    <div className="mb-12">
                                        <h2 className="text-4xl font-display font-black tracking-tight text-slate-900 mb-2">Case Explorer</h2>
                                        <p className="text-slate-500 font-medium max-w-2xl">Real-time decision pipeline for the Governance Engine. Review, analyze, and contest AI-driven approvals.</p>
                                    </div>
                                    <CaseList />
                                </PageMotion>
                            } />

                            <Route path="/case/:id" element={<PageMotion {...fade}><DecisionPage /></PageMotion>} />
                            <Route path="/apply" element={<PageMotion {...fade}><ApplicationPage /></PageMotion>} />
                            <Route path="/decision/:id" element={<PageMotion {...fade}><DecisionPage /></PageMotion>} />
                            <Route path="/contest/:id" element={<PageMotion {...fade}><ContestPage /></PageMotion>} />
                            <Route path="/delta/:id" element={<PageMotion {...fade}><DeltaPage /></PageMotion>} />
                            <Route path="/directives" element={<PageMotion {...fade}><DirectivePage /></PageMotion>} />
                            <Route path="/ledger" element={<PageMotion {...fade}><LedgerPage /></PageMotion>} />
                            <Route path="/alerts" element={<PageMotion {...fade}><AlertsPage /></PageMotion>} />
                            <Route path="/analytics" element={<PageMotion {...fade}><AnalyticsPage /></PageMotion>} />
                        </Routes>
                    </AnimatePresence>
                </div>
                
                <div className="h-24 flex items-center justify-center border-t border-slate-200/50 mt-12 bg-white/10 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                      Decentralized Governance Ledger • TLS Secured
                    </p>
                </div>
                <ChatWidget />
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppShell />
        </AuthProvider>
    );
}

export default App;
