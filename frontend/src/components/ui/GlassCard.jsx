import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, glow = '', delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        glass ${hover ? 'glass-hover' : ''} ${glow}
        transition-all duration-300 ease-out
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
