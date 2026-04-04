import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, FileText, Activity, AlertTriangle, TrendingDown, Zap, Shield } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const metrics = [
    { label: 'Total Workers', value: stats.totalUsers, icon: Users, color: 'text-blue-400', iconBg: 'bg-blue-500/15' },
    { label: 'Total Claims', value: stats.totalClaims, icon: FileText, color: 'text-violet-400', iconBg: 'bg-violet-500/15' },
    { label: 'Loss Ratio', value: stats.lossRatio, icon: TrendingDown, color: 'text-amber-400', iconBg: 'bg-amber-500/15' },
    { label: 'Fraud Flagged', value: stats.flaggedUsers.length, icon: AlertTriangle, color: stats.flaggedUsers.length > 0 ? 'text-red-400' : 'text-emerald-400', iconBg: stats.flaggedUsers.length > 0 ? 'bg-red-500/15' : 'bg-emerald-500/15', alert: stats.flaggedUsers.length > 0 },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-400" />
          Admin Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">Platform metrics, fraud detection & trigger monitoring</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <GlassCard key={m.label} className={`p-5 ${m.alert ? 'border-red-500/20' : ''}`} delay={i * 0.1}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</span>
              <div className={`p-2 rounded-lg ${m.iconBg}`}>
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Finance Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard className="p-5" delay={0.4}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Premiums Collected</p>
          <p className="text-2xl font-bold text-blue-400">₹{stats.totalPremiums}</p>
        </GlassCard>
        <GlassCard className="p-5" delay={0.5}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Payouts</p>
          <p className="text-2xl font-bold text-red-400">₹{stats.totalPayouts}</p>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Triggers */}
        <GlassCard className="p-0 overflow-hidden" delay={0.6}>
          <div className="p-5 border-b border-white/5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Recent Claims / Triggers</h3>
          </div>
          {stats.recentTriggers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No claims yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {stats.recentTriggers.map(c => {
                const isPaid = c.status === 'Paid';
                return (
                  <div key={c._id} className="px-5 py-4 flex items-center justify-between hover:bg-white/3 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isPaid ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {isPaid ? '✓' : '!'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{c.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{c.user?.city} • {c.triggerEvent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isPaid ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                        {c.status}
                      </span>
                      <p className="text-sm font-bold text-slate-300 mt-1">₹{c.payoutAmount}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Fraud Flagged */}
        <GlassCard className="p-0 overflow-hidden" delay={0.7}>
          <div className="p-5 border-b border-white/5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-white">Fraud Flagged Users</h3>
          </div>
          {stats.flaggedUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
              <p className="text-emerald-400 text-sm font-medium">System is clean</p>
              <p className="text-slate-500 text-xs mt-1">No fraud detected</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {stats.flaggedUsers.map(u => (
                <div key={u._id} className="px-5 py-4 flex items-center justify-between hover:bg-white/3 transition">
                  <div>
                    <p className="text-sm font-semibold text-white">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.city} • <span className="text-red-400">{u.flags.reason}</span></p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300 cursor-pointer hover:bg-white/10 transition">
                    Review
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
