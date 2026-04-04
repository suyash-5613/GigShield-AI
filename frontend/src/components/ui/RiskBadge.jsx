const RiskBadge = ({ level }) => {
  const styles = {
    Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    High: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  const dots = {
    Low: 'bg-emerald-400',
    Medium: 'bg-amber-400',
    High: 'bg-red-400',
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${styles[level] || styles.Low}`}>
      <span className={`w-2 h-2 rounded-full ${dots[level] || dots.Low} animate-pulse`} />
      {level} Risk
    </span>
  );
};

export default RiskBadge;
