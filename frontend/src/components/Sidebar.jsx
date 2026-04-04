import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, ShieldCheck, FileText, Zap, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ user, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['worker', 'admin'] },
    { label: 'Buy Policy', icon: ShieldCheck, path: '/buy-policy', roles: ['worker'] },
    { label: 'Claims', icon: FileText, path: '/claims', roles: ['worker'] },
    { label: 'Simulator', icon: Zap, path: '/simulator', roles: ['worker', 'admin'] },
    { label: 'Admin Panel', icon: Settings, path: '/admin', roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-blue-400" />
        </div>
        {(!collapsed || isMobile) && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden"
          >
            <h1 className="text-lg font-bold gradient-text whitespace-nowrap">GigShield AI</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Parametric Insurance</p>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              transition-all duration-200 group relative
              ${isActive
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card & Logout */}
      <div className="p-3 mt-auto">
        {(!collapsed || isMobile) && (
          <div className="glass p-4 mb-3">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.city} • {user?.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl text-slate-300 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] z-50 bg-[#0b1120]/95 backdrop-blur-2xl border-r border-white/5"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30
          bg-[#0b1120]/80 backdrop-blur-2xl border-r border-white/5
          transition-all duration-300
          ${collapsed ? 'w-[72px]' : 'w-[240px]'}
        `}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white text-xs cursor-pointer transition"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
