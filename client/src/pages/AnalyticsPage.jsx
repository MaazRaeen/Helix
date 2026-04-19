import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, CheckCircle2, XCircle, Users, Shield, 
  Activity, Scale, FileText, Clock, Loader2 
} from 'lucide-react';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, auditRes] = await Promise.all([
          axios.get('http://localhost:5070/api/analytics'),
          axios.get('http://localhost:5070/api/audit-log').catch(() => ({ data: [] }))
        ]);
        setData(analyticsRes.data);
        setAuditLogs(auditRes.data);
      } catch (error) {
        console.error('Analytics fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="animate-spin text-primary-600" size={48} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Computing Analytics...</p>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    { label: 'Total Applications', value: data.total, icon: FileText, color: 'primary', sub: 'All time' },
    { label: 'Approval Rate', value: `${data.approvalRate}%`, icon: TrendingUp, color: 'emerald', sub: `${data.approved} approved` },
    { label: 'Rejection Rate', value: `${(100 - data.approvalRate).toFixed(1)}%`, icon: XCircle, color: 'rose', sub: `${data.rejected} rejected` },
    { label: 'Contestation Rate', value: `${data.contestationRate}%`, icon: Scale, color: 'amber', sub: `${data.contested} contested` },
    { label: 'Avg. Confidence', value: `${data.avgConfidence}%`, icon: Activity, color: 'violet', sub: 'Model certainty' },
    { label: 'Active Audits', value: auditLogs.length, icon: Shield, color: 'cyan', sub: 'Last 100 actions' },
  ];

  const colorMap = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-100', bar: 'bg-primary-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', bar: 'bg-emerald-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', bar: 'bg-rose-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', bar: 'bg-amber-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', bar: 'bg-violet-500' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', bar: 'bg-cyan-500' },
  };

  const maxTimelineCount = Math.max(...data.timeline.map(t => t.count), 1);

  const actionColors = {
    LOGIN: 'bg-primary-100 text-primary-700',
    REGISTER: 'bg-emerald-100 text-emerald-700',
    SUBMIT_APPLICATION: 'bg-blue-100 text-blue-700',
    RE_EVALUATE: 'bg-amber-100 text-amber-700',
    DELETE_CASE: 'bg-rose-100 text-rose-700',
    VIEW_ANALYTICS: 'bg-violet-100 text-violet-700',
    CONTEST: 'bg-orange-100 text-orange-700',
    VIEW_DECISION: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-600">
            <BarChart3 size={20} className="stroke-[3]" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Intelligence Dashboard</span>
          </div>
          <h1 className="text-5xl font-display font-black text-slate-900 tracking-tight">Analytics Hub</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Real-time governance metrics and audit intelligence</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const c = colorMap[stat.color];
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`bg-white rounded-[2rem] p-8 shadow-card border border-slate-50 hover:shadow-xl transition-all`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl ${c.bg} ${c.text} border ${c.border}`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.sub}</span>
              </div>
              <p className={`text-4xl font-black ${c.text} tracking-tight mb-1`}>{stat.value}</p>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Approval/Rejection Donut */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-card border border-slate-50"
        >
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Decision Distribution</h3>
          <div className="flex items-center gap-10">
            {/* Donut Chart (CSS) */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-40 h-40 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <circle 
                  cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                  strokeDasharray={`${data.approvalRate} ${100 - data.approvalRate}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{data.approvalRate}%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase">Approved</span>
              </div>
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-black text-slate-700">Approved</span>
                <span className="ml-auto text-sm font-black text-emerald-600">{data.approved}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-sm font-black text-slate-700">Rejected</span>
                <span className="ml-auto text-sm font-black text-rose-600">{data.rejected}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm font-black text-slate-700">Contested</span>
                <span className="ml-auto text-sm font-black text-amber-600">{data.contested}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-card border border-slate-50"
        >
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Applications (Last 7 Days)</h3>
          <div className="flex items-end gap-3 h-40">
            {data.timeline.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-black text-slate-400">{t.count}</span>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((t.count / maxTimelineCount) * 100, 5)}%` }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="w-full bg-primary-500 rounded-xl min-h-[4px]"
                />
                <span className="text-[9px] font-bold text-slate-400">
                  {new Date(t.date).toLocaleDateString('en', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Factors */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-white rounded-[2.5rem] p-10 shadow-card border border-slate-50"
      >
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Most Influential Model Factors</h3>
        <div className="space-y-4">
          {data.topFactors.map((f, i) => {
            const maxCount = data.topFactors[0]?.count || 1;
            return (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-black text-slate-700 w-40 truncate">{f.feature}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(f.count / maxCount) * 100}%` }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  />
                </div>
                <span className="text-sm font-black text-primary-600 w-10 text-right">{f.count}</span>
              </div>
            );
          })}
          {data.topFactors.length === 0 && (
            <p className="text-slate-400 text-sm font-medium">No factor data available yet.</p>
          )}
        </div>
      </motion.div>

      {/* Audit Trail */}
      {auditLogs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-card border border-slate-50"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Recent Audit Trail</h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-700 uppercase">Live Monitoring</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Time</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {auditLogs.slice(0, 15).map((log, idx) => (
                  <tr key={log._id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-[11px] font-bold text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-700">{log.userName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                        log.userRole === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'
                      }`}>
                        {log.userRole}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${actionColors[log.action] || 'bg-slate-100 text-slate-600'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-500 font-medium max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsPage;
