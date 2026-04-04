import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ShieldCheck, Wallet, TrendingUp, AlertTriangle, Activity, Zap } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import RiskBadge from '../components/ui/RiskBadge';

const Dashboard = ({ user }) => {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [premiumData, setPremiumData] = useState(null);
  const [latestClaim, setLatestClaim] = useState(null);

  const fetchPolicy = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/policy/my-policy', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPolicy(res.data);
    } catch (err) { /* no policy */ }
    finally { setLoading(false); }
  };

  const fetchPremium = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/policy/calculate-premium', { coverageAmount: 1000 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPremiumData(res.data);
    } catch (err) { /* ignore */ }
  };

  useEffect(() => {
    fetchPolicy();
    fetchPremium();

    const socket = io('http://localhost:5000');
    socket.on('claim-update', (data) => {
      if (data.userId === user?.id) {
        setLatestClaim(data.claim);
        if (data.claim.status === 'Paid') {
          toast.success(data.message, { icon: '✅', duration: 6000 });
        } else {
          toast.warning(data.message, { icon: '⚠️', duration: 6000 });
        }
      }
    });
    return () => socket.disconnect();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Coverage Status',
      value: policy ? 'Active' : 'None',
      sub: policy ? `Expires ${new Date(policy.endDate).toLocaleDateString()}` : 'Purchase a policy',
      icon: ShieldCheck,
      color: policy ? 'text-emerald-400' : 'text-slate-500',
      iconBg: policy ? 'bg-emerald-500/15' : 'bg-slate-500/15',
    },
    {
      label: 'Earnings Protected',
      value: policy ? `₹${policy.coverageAmount}` : '—',
      sub: policy ? `Payout: ₹${policy.coverageAmount * 0.4}` : 'No active policy',
      icon: Wallet,
      color: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
    },
    {
      label: 'Weekly Premium',
      value: policy ? `₹${policy.premium?.totalPremium}` : '—',
      sub: policy ? 'AI-calculated pricing' : 'Varies by risk',
      icon: TrendingUp,
      color: 'text-violet-400',
      iconBg: 'bg-violet-500/15',
    },
    {
      label: 'Risk Level',
      value: premiumData?.riskScore || 'Unknown',
      sub: `${user?.city} conditions`,
      icon: Activity,
      color: premiumData?.riskScore === 'High' ? 'text-red-400' : premiumData?.riskScore === 'Medium' ? 'text-amber-400' : 'text-emerald-400',
      iconBg: premiumData?.riskScore === 'High' ? 'bg-red-500/15' : premiumData?.riskScore === 'Medium' ? 'bg-amber-500/15' : 'bg-emerald-500/15',
      badge: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Protecting your {user?.platform} earnings in {user?.city}
          </p>
        </div>
        {premiumData && <RiskBadge level={premiumData.riskScore} />}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <GlassCard key={stat.label} className="p-5" delay={i * 0.1}>
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              {stat.badge ? (
                <RiskBadge level={stat.value} />
              ) : (
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">{stat.sub}</p>
          </GlassCard>
        ))}
      </div>

      {/* Active Policy Detail */}
      {policy && (
        <GlassCard className="p-0 overflow-hidden" delay={0.4}>
          <div className="relative p-6 bg-gradient-to-r from-blue-600/20 via-violet-600/10 to-transparent">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center glow-blue">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Active Coverage</h3>
                  <p className="text-sm text-slate-400">₹{policy.coverageAmount}/week • Auto-Claim enabled</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Monitoring Active
                </span>
              </div>
            </div>
          </div>

          {/* Premium Breakdown inside the active policy card */}
          <div className="p-6 border-t border-white/5">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">AI Premium Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Base', value: policy.premium.basePrice, color: 'text-slate-300' },
                { label: 'Rain Risk', value: policy.premium.rainRisk, color: 'text-blue-400' },
                { label: 'Heat Risk', value: policy.premium.heatRisk, color: 'text-orange-400' },
                { label: 'Pollution', value: policy.premium.pollutionRisk, color: 'text-slate-400' },
                { label: 'Total', value: policy.premium.totalPremium, color: 'text-emerald-400', highlight: true },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-xl ${item.highlight ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/3'} text-center`}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color} mt-1`}>₹{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Latest Claim Timeline */}
      <GlassCard className="p-6" delay={0.5}>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Zero-Touch Claims Timeline
        </h3>

        <ClaimsTimeline latestClaim={latestClaim} city={user?.city} />
      </GlassCard>
    </div>
  );
};

/* ===== Timeline Sub-component ===== */
const ClaimsTimeline = ({ latestClaim, city }) => {
  const steps = [
    { label: 'Policy Activated', sub: `Monitoring ${city}`, icon: ShieldCheck, done: true, color: 'blue' },
    { label: 'Trigger Occurred', sub: latestClaim?.triggerEvent || 'Waiting...', icon: AlertTriangle, done: !!latestClaim, color: 'amber' },
    { label: 'Claim Created', sub: latestClaim ? 'Auto-validated' : 'Waiting...', icon: Activity, done: !!latestClaim, color: 'violet' },
    {
      label: latestClaim?.status === 'Paid' ? 'Paid Instantly' : latestClaim?.status === 'Suspicious' ? 'Flagged' : 'Payout',
      sub: latestClaim?.status === 'Paid' ? `₹${latestClaim.payoutAmount} credited` : latestClaim ? 'Review required' : 'Waiting...',
      icon: Wallet,
      done: latestClaim?.status === 'Paid',
      color: latestClaim?.status === 'Paid' ? 'emerald' : latestClaim?.status === 'Suspicious' ? 'red' : 'slate',
    }
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', line: 'bg-blue-500' },
    amber: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', line: 'bg-amber-500' },
    violet: { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30', line: 'bg-violet-500' },
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', line: 'bg-emerald-500' },
    red: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', line: 'bg-red-500' },
    slate: { bg: 'bg-slate-500/15', text: 'text-slate-500', border: 'border-slate-500/30', line: 'bg-slate-700' },
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-0 w-full">
      {steps.map((step, i) => {
        const c = colorMap[step.color] || colorMap.slate;
        return (
          <div key={i} className="flex items-center flex-1 w-full sm:w-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex flex-col items-center text-center min-w-[100px]"
            >
              <div className={`w-11 h-11 rounded-full ${c.bg} border ${c.border} flex items-center justify-center mb-2 ${step.done ? '' : 'opacity-40'}`}>
                <step.icon className={`w-5 h-5 ${c.text}`} />
              </div>
              <p className={`text-xs font-semibold ${step.done ? 'text-slate-200' : 'text-slate-500'}`}>{step.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{step.sub}</p>
            </motion.div>
            {i < steps.length - 1 && (
              <div className={`hidden sm:block flex-1 h-px mx-2 ${step.done ? c.line : 'bg-white/5'} transition-colors duration-500`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
