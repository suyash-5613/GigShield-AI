import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', password: '', city: 'Mumbai', platform: 'Zomato', averageWeeklyIncome: 3000, role: 'worker'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      toast.success(res.data.message);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setFormData({ ...formData, [field]: value });

  const inputClass = `
    w-full px-4 py-3.5 rounded-xl text-sm font-medium
    bg-white/5 border border-white/10 text-slate-200
    placeholder-slate-500
    focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
    transition-all duration-200
  `;

  const selectClass = `
    w-full px-4 py-3.5 rounded-xl text-sm font-medium
    bg-white/5 border border-white/10 text-slate-200
    focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30
    transition-all duration-200 appearance-none cursor-pointer
  `;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass p-8 shadow-2xl rounded-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4 shadow-lg glow-blue"
            >
              <Shield className="w-8 h-8 text-blue-400" />
            </motion.div>
            <h2 className="text-2xl font-bold gradient-text">GigShield AI</h2>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Parametric Insurance for Gig Workers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Name</label>
              <input type="text" required value={formData.name} onChange={e => update('name', e.target.value)}
                className={inputClass} placeholder="e.g. Rahul Sharma" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <input type="password" required value={formData.password} onChange={e => update('password', e.target.value)}
                className={inputClass} placeholder="••••••••" />
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">City</label>
                  <select value={formData.city} onChange={e => update('city', e.target.value)} className={selectClass}>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bengaluru">Bengaluru</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Platform</label>
                    <select value={formData.platform} onChange={e => update('platform', e.target.value)} className={selectClass}>
                      <option value="Zomato">Zomato</option>
                      <option value="Swiggy">Swiggy</option>
                      <option value="Zepto">Zepto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Avg Weekly ₹</label>
                    <input type="number" required value={formData.averageWeeklyIncome}
                      onChange={e => update('averageWeeklyIncome', Number(e.target.value))} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Role</label>
                  <select value={formData.role} onChange={e => update('role', e.target.value)} className={selectClass}>
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg glow-blue transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 font-semibold hover:text-blue-300 transition cursor-pointer">
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
