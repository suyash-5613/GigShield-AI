import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ShieldCheck, CloudRain, ThermometerSun, Wind, CheckCircle2, Sparkles } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import RiskBadge from '../components/ui/RiskBadge';

const BuyPolicy = ({ user }) => {
  const [premiumData, setPremiumData] = useState(null);
  const [selectedCoverage, setSelectedCoverage] = useState(null);
  const [loading, setLoading] = useState(false);

  const coverageOptions = [
    { amount: 500, label: 'Basic', payout: 200, desc: 'Essential protection for short disruptions' },
    { amount: 1000, label: 'Standard', payout: 400, desc: 'Recommended coverage for regular workers', popular: true },
    { amount: 2000, label: 'Premium', payout: 800, desc: 'Maximum protection for high-earners' },
  ];

  const handleCalculatePremium = async (amount) => {
    setSelectedCoverage(amount);
    try {
      const res = await axios.post('http://localhost:5000/api/policy/calculate-premium', { coverageAmount: amount }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPremiumData({ ...res.data, coverageAmount: amount });
    } catch (err) {
      toast.error('Failed to calculate premium');
    }
  };

  const handlePurchase = async () => {
    if (!premiumData) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/policy/purchase', {
        coverageAmount: premiumData.coverageAmount,
        calculatedPremium: premiumData
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('🎉 Policy Purchased Successfully!');
      setPremiumData(null);
      setSelectedCoverage(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const breakdownItems = premiumData ? [
    { label: 'Base Price', value: premiumData.basePrice, icon: ShieldCheck, color: 'text-slate-300', iconColor: 'text-slate-400', bg: 'bg-slate-500/10' },
    { label: 'Rain Risk', value: premiumData.rainRisk, icon: CloudRain, color: 'text-blue-400', iconColor: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Heat Risk', value: premiumData.heatRisk, icon: ThermometerSun, color: 'text-orange-400', iconColor: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Pollution Risk', value: premiumData.pollutionRisk, icon: Wind, color: 'text-slate-400', iconColor: 'text-slate-400', bg: 'bg-slate-500/10' },
  ] : [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Buy Weekly Policy</h1>
        <p className="text-slate-400 text-sm mt-1">Select coverage for 7-day income loss protection in {user?.city}</p>
      </motion.div>

      {/* Coverage Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coverageOptions.map((opt, i) => (
          <GlassCard key={opt.amount} delay={i * 0.1}
            className={`p-6 cursor-pointer relative overflow-hidden ${selectedCoverage === opt.amount ? 'border-blue-500/40 bg-blue-500/5' : ''}`}
            onClick={() => handleCalculatePremium(opt.amount)}
          >
            {opt.popular && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Popular
              </span>
            )}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{opt.label}</p>
            <p className="text-3xl font-bold text-white mt-2">₹{opt.amount}</p>
            <p className="text-sm text-slate-400 mt-1">per week</p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-sm text-emerald-400 font-semibold">Payout: ₹{opt.payout}</p>
              <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
            </div>
            {selectedCoverage === opt.amount && (
              <motion.div
                layoutId="selected-coverage"
                className="absolute inset-0 border-2 border-blue-500/40 rounded-2xl pointer-events-none"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </GlassCard>
        ))}
      </div>

      {/* Premium Breakdown */}
      {premiumData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <GlassCard className="p-6" delay={0}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  AI Premium Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-1">Transparent pricing based on local risk conditions</p>
              </div>
              <RiskBadge level={premiumData.riskScore} />
            </div>

            <div className="space-y-3 mb-6">
              {breakdownItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.bg}`}>
                      <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${item.value > 0 ? item.color : 'text-slate-600'}`}>
                    {item.value > 0 ? `+₹${item.value}` : '₹0'}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-300">Total Weekly Premium</p>
                  <p className="text-xs text-emerald-500/80">Covers 7 days from activation</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-400">₹{premiumData.totalPremium}</p>
            </div>

            <GlowButton onClick={handlePurchase} variant="success" disabled={loading} className="w-full py-4 text-base">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                `Purchase ₹${premiumData.coverageAmount} Policy for ₹${premiumData.totalPremium}/week`
              )}
            </GlowButton>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default BuyPolicy;
