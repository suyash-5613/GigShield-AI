import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, AlertTriangle, Clock, Wallet } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const Claims = ({ user }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/policy/my-claims', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setClaims(res.data || []);
      } catch (err) { /* no claims */ }
      finally { setLoading(false); }
    };
    fetchClaims();
  }, []);

  const statusConfig = {
    Paid: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20', label: 'Paid' },
    Approved: { icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/20', label: 'Approved' },
    Pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/20', label: 'Pending' },
    Suspicious: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/20', label: 'Flagged' },
    Rejected: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/20', label: 'Rejected' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-violet-400" />
          Claims History
        </h1>
        <p className="text-slate-400 text-sm mt-1">All zero-touch claims processed automatically</p>
      </motion.div>

      {claims.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No claims yet</p>
          <p className="text-slate-500 text-sm mt-1">Claims are auto-generated when triggers occur</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {claims.map((claim, i) => {
            const cfg = statusConfig[claim.status] || statusConfig.Pending;
            return (
              <GlassCard key={claim._id} className="p-5" delay={i * 0.08}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                      <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{claim.triggerEvent}</p>
                      <p className="text-xs text-slate-500">{new Date(claim.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                      {cfg.label}
                    </span>
                    <p className={`text-lg font-bold ${claim.status === 'Paid' ? 'text-emerald-400' : 'text-slate-400'}`}>
                      ₹{claim.payoutAmount}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Claims;
