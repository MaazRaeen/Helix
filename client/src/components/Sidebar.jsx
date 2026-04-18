import React from 'react';
import { 
    Layout, Search, PlusCircle, History, 
    Settings, HelpCircle, User, Fingerprint,
    LogOut, Bell, Shield, ChevronRight, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active, onClick, disabled }) => (
    <motion.button
        whileHover={!disabled ? { x: 5, backgroundColor: 'rgba(79, 70, 229, 0.05)' } : {}}
        whileTap={!disabled ? { scale: 0.96 } : {}}
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-8 py-5 transition-all relative group ${
            active 
            ? 'text-primary-700 font-extrabold sidebar-item-active' 
            : 'text-slate-600 hover:text-primary-600'
        } cursor-pointer`}
    >
        <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-primary-100/50 text-primary-700' : 'bg-transparent text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
            <Icon size={22} className="stroke-[2.5]" />
        </div>
        <span className="text-[13px] uppercase tracking-wider font-black">{label}</span>
        {active && (
            <motion.div 
                layoutId="sidebar-active"
                className="absolute right-0 top-3 bottom-3 w-1.5 bg-primary-600 rounded-l-full shadow-glow"
            />
        )}
    </motion.button>
);

const Sidebar = ({ currentView, onViewChange }) => {
    const handlePlaceholder = (feature) => {
        alert(`${feature} module is currently syncing with the Governance Ledger...`);
    };

    return (
        <aside className="w-80 h-screen sticky top-0 bg-white/60 backdrop-blur-2xl border-r border-slate-200 shadow-2xl flex flex-col z-30 overflow-hidden">
            {/* Logo Section */}
            <div className="p-10 pb-12">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onViewChange('list')}>
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent rounded-[1.25rem] flex items-center justify-center text-white shadow-glow group-hover:rotate-6 transition-transform duration-500">
                        <Fingerprint size={32} />
                    </div>
                    <div>
                        <h1 className="font-display font-black text-2xl tracking-tighter text-slate-900 leading-none">
                            HELIX
                        </h1>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-600 mt-1.5 opacity-100">Governance Engine</p>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 space-y-1">
                <div className="px-10 pb-4">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational</p>
                </div>
                <SidebarItem 
                    icon={Award} 
                    label="Innovation Lab" 
                    active={currentView === 'manifesto'} 
                    onClick={() => onViewChange('manifesto')} 
                />
                <SidebarItem 
                    icon={Search} 
                    label="Executive Explorer" 
                    active={currentView === 'list'} 
                    onClick={() => onViewChange('list')} 
                />
                <SidebarItem 
                    icon={PlusCircle} 
                    label="New Directive" 
                    onClick={() => handlePlaceholder('Directive Creation')}
                />
                <SidebarItem 
                    icon={History} 
                    label="Decision Ledger" 
                    onClick={() => handlePlaceholder('Ledger History')}
                />
                
                <div className="px-10 pt-10 pb-4">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Applicant Experience</p>
                </div>
                <SidebarItem 
                    icon={Shield} 
                    label="Loan Application" 
                    active={currentView === 'applicant-flow'} 
                    onClick={() => onViewChange('applicant-flow')} 
                />
                <SidebarItem 
                    icon={Bell} 
                    label="Oracle Alerts" 
                    onClick={() => handlePlaceholder('Notification Stream')}
                />
            </div>

            {/* Bottom Section: Profile */}
            <div className="p-8 mt-auto border-t border-slate-200 bg-white/20 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent p-0.5 shadow-lg">
                            <div className="w-full h-full rounded-[0.9rem] bg-white flex items-center justify-center overflow-hidden">
                                <User size={24} className="text-slate-900" />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-black text-slate-900 truncate tracking-tight">Arghadeep D.</p>
                        <p className="text-[11px] font-black text-primary-600 uppercase tracking-widest truncate">Compliance Lead</p>
                    </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
                    <button className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                        <Settings size={14} className="stroke-[2.5]" />
                        Settings
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                        <HelpCircle size={14} className="stroke-[2.5]" />
                        Support
                    </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-200/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                        "AI should not be final, it should be challengeable."
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
