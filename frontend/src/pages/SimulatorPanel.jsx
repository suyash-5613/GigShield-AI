import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CloudRain, ThermometerSun, Wind, AlertTriangle, Zap, Radio } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const SimulatorPanel = () => {
  const [city, setCity] = useState('Mumbai');
  const [loading, setLoading] = useState(null); // which trigger is loading
  const [results, setResults] = useState([]);

  const triggers = [
    {
      label: 'Heavy Rain',
      event: 'Heavy Rain',
      icon: CloudRain,
      gradient: 'from-blue-600/20 to-blue-800/20',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
      iconColor: 'text-blue-400',
      desc: 'Rainfall > 70mm threshold',
    },
    {
      label: 'Heatwave',
      event: 'Heatwave',
      icon: ThermometerSun,
      gradient: 'from-orange-600/20 to-orange-800/20',
      border: 'border-orange-500/20 hover:border-orange-500/40',
      glow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
      iconColor: 'text-orange-400',
      desc: 'Temperature > 40°C threshold',
    },
    {
      label: 'High Pollution',
      event: 'High Pollution',
      icon: Wind,
      gradient: 'from-slate-600/20 to-slate-800/20',
      border: 'border-slate-500/20 hover:border-slate-400/40',
      glow: 'hover:shadow-[0_0_30px_rgba(148,163,184,0.15)]',
      iconColor: 'text-slate-400',
      desc: 'AQI > 300 threshold',
    },
    {
      label: 'Curfew',
      event: 'Curfew',
      icon: AlertTriangle,
      gradient: 'from-red-600/20 to-red-800/20',
      border: 'border-red-500/20 hover:border-red-500/40',
      glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
      iconColor: 'text-red-400',
      desc: 'Govt-mandated shutdown',
    },
  ];

  const handleTrigger = async (eventType) => {
    setLoading(eventType);
    try {
      const res = await axios.post('http://localhost:5000/api/simulator/trigger', { city, eventType });
      toast.success(`⚠ ${eventType} triggered in ${city}`, { description: `${res.data.claimsProcessed} claims processed` });
      setResults(prev => [{ event: eventType, city, ...res.data, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 8));
    } catch (err) {
      toast.error('Simulation failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-400" />
          Simulation Panel
        </h1>
        <p className="text-slate-400 text-sm mt-1">Trigger parametric events to demonstrate zero-touch claim automation</p>
      </motion.div>

      {/* City Selector */}
      <GlassCard className="p-5" delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/15">
              <Radio className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Target City</p>
              <p className="text-xs text-slate-500">Select the city to simulate disruption</p>
            </div>
          </div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 sm:max-w-[200px] px-4 py-3 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500/50 transition cursor-pointer"
          >
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>
        </div>
      </GlassCard>

      {/* Trigger Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {triggers.map((trigger, i) => (
          <motion.button
            key={trigger.event}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleTrigger(trigger.event)}
            disabled={loading === trigger.event}
            className={`
              p-6 rounded-2xl text-left transition-all duration-300 cursor-pointer
              bg-gradient-to-br ${trigger.gradient}
              border ${trigger.border}
              ${trigger.glow}
              backdrop-blur-xl
              disabled:opacity-40
            `}
          >
            <div className="flex items-start justify-between">
              <div>
                <trigger.icon className={`w-8 h-8 ${trigger.iconColor} mb-3`} />
                <p className="text-base font-bold text-white">Trigger {trigger.label}</p>
                <p className="text-xs text-slate-400 mt-1">{trigger.desc}</p>
              </div>
              {loading === trigger.event && (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Activity Log */}
      {results.length > 0 && (
        <GlassCard className="p-6" delay={0}>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Simulation Log</h3>
          <div className="space-y-2">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono w-16">{r.time}</span>
                  <span className="text-slate-200 font-medium">{r.event}</span>
                  <span className="text-slate-500">in {r.city}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">{r.affectedPolicies} policies</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20">
                    {r.claimsProcessed} claims
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* How it works */}
      <GlassCard className="p-6" delay={0.5}>
        <h3 className="text-sm font-bold text-slate-300 mb-3">How Simulation Works</h3>
        <ol className="space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2"><span className="text-blue-400 font-bold mt-0.5">1.</span> Select the target city where workers are registered</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 font-bold mt-0.5">2.</span> Click a trigger to update environmental conditions</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 font-bold mt-0.5">3.</span> Backend auto-evaluates all active policies in that city</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 font-bold mt-0.5">4.</span> Zero-touch claims are created and payouts processed instantly</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 font-bold mt-0.5">5.</span> Fraud system flags users with &gt;2 claims in 24 hours</li>
        </ol>
      </GlassCard>
    </div>
  );
};

export default SimulatorPanel;
