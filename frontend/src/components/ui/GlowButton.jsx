import { motion } from 'framer-motion';

const GlowButton = ({ children, onClick, variant = 'primary', disabled = false, className = '', ...props }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 glow-blue text-white',
    success: 'bg-emerald-600 hover:bg-emerald-500 glow-green text-white',
    danger: 'bg-red-600 hover:bg-red-500 glow-red text-white',
    warning: 'bg-amber-600 hover:bg-amber-500 glow-orange text-white',
    purple: 'bg-violet-600 hover:bg-violet-500 glow-purple text-white',
    ghost: 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-3 rounded-xl font-semibold text-sm
        transition-all duration-200
        ${variants[variant]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default GlowButton;
