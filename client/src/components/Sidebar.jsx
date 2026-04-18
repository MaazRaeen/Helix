import React from 'react';
import { 
    Layout, Search, PlusCircle, History, 
    Settings, HelpCircle, User, Fingerprint,
    LogOut, Bell, Shield, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active, onClick, disabled }) => (
    <motion.button
        whileHover={!disabled ? { x: 5 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center gap-3 px-6 py-4 transition-all relative group ${
            active 
            ? 'text-primary-600 font-bold sidebar-item-active' 
            : 'text-slate-400 hover:text-slate-600'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
        <Icon size={20} className={`${active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span className="text-sm tracking-wide">{label}</span>
        {active && (
            <motion.div 
                layoutId="sidebar-active"
                className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l-full shadow-glow"
            />
        )}
    </motion.button>
);

const Sidebar = ({ currentView, onViewChange }) => {
    return (
        <aside className="w-72 h-screen sticky top-0 bg-white/40 backdrop-blur-xl border-r border-slate-200/50 flex flex-col z-30 overflow-hidden">
            {/* Logo Section */}
            <div className="p-8 pb-12">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onViewChange('list')}>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent rounded-2xl flex items-center justify-center text-white shadow-glow group-hover:rotate-6 transition-transform duration-500">
                        <Fingerprint size={28} />
                    </div>
                    <div>
                        <h1 className="font-display font-black text-xl tracking-tight text-slate-900 leading-none">
                            Helix
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mt-1 opacity-80">GovEngine v3</p>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 space-y-2">
                <div className="px-8 pb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Management</p>
                </div>
                <SidebarItem 
                    icon={Search} 
                    label="Case Explorer" 
                    active={currentView === 'list'} 
                    onClick={() => onViewChange('list')} 
                />
                <SidebarItem 
                    icon={PlusCircle} 
                    label="New Request" 
                    disabled 
                />
                <SidebarItem 
                    icon={History} 
                    label="Decision History" 
                    disabled 
                />
                
                <div className="px-8 pt-8 pb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Governance</p>
                </div>
                <SidebarItem 
                    icon={Shield} 
                    label="Compliance Audit" 
                    disabled 
                />
                <SidebarItem 
                    icon={Bell} 
                    label="Notifications" 
                    disabled 
                />
            </div>

            {/* Bottom Section: Profile */}
            <div className="p-6 mt-auto border-t border-slate-200/50 bg-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-accent p-0.5">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                <User size={20} className="text-slate-400" />
                            </div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate tracking-tight">Arghadeep D.</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Policy Lead</p>
                    </div>
                    <button className="text-slate-300 hover:text-rose-500 transition-colors">
                        <LogOut size={18} />
                    </button>
                </div>

                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <div className="flex items-center gap-1.5 hover:text-primary-600 cursor-pointer transition-colors">
                        <Settings size={12} />
                        Settings
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-primary-600 cursor-pointer transition-colors">
                        <HelpCircle size={12} />
                        Support
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
