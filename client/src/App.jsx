import React, { useState, useEffect } from 'react';
import api from './utils/api';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import { Layout, Search, PlusCircle, History } from 'lucide-react';

function App() {
    const [view, setView] = useState('list'); // 'list' or 'dashboard'
    const [selectedCaseId, setSelectedCaseId] = useState(null);

    const handleSelectCase = (id) => {
        setSelectedCaseId(id);
        setView('dashboard');
    };

    return (
        <div className="min-h-screen bg-corporate-light flex flex-col font-sans text-corporate-text">
            {/* Nav */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('list')}>
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                    <span className="font-display font-bold text-lg tracking-tight">AI Decision Contestation</span>
                </div>
                
                <nav className="flex gap-6">
                    <button 
                        onClick={() => setView('list')}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${view === 'list' ? 'text-primary-600' : 'text-corporate-muted hover:text-primary-600'}`}
                    >
                        <Search size={18} />
                        Case Explorer
                    </button>
                    <button 
                        className="flex items-center gap-2 text-sm font-medium text-corporate-muted hover:text-primary-600 transition-colors"
                        disabled
                    >
                        <PlusCircle size={18} />
                        New Application
                    </button>
                </nav>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs font-semibold text-corporate-text">Arghadeep Debnath</p>
                        <p className="text-[10px] text-corporate-muted">Compliance Officer</p>
                    </div>
                    <div className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-500">AD</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                {view === 'list' ? (
                    <CaseList onSelect={handleSelectCase} />
                ) : (
                    <Dashboard 
                        caseId={selectedCaseId} 
                        onBack={() => setView('list')} 
                        onUpdate={() => {}} 
                    />
                )}
            </main>
        </div>
    );
}

export default App;
