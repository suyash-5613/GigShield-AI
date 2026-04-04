const User = require('../models/User');
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'worker' });
    
    // Total Claims
    const totalClaims = await Claim.countDocuments();
    
    // Users with fraud flags
    const flaggedUsers = await User.find({ 'flags.suspicious': true }).select('name city flags createdAt');

    // Recent triggers (Claims acting as triggers)
    const recentTriggers = await Claim.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name city');

    // Calculate Loss Ratio = Total Claims Paid / Total Premium Collected * 100
    const allClaimsPaid = await Claim.find({ status: 'Paid' });
    const allPolicies = await Policy.find();
    
    const totalPayouts = allClaimsPaid.reduce((sum, claim) => sum + (claim.payoutAmount || 0), 0);
    const totalPremiums = allPolicies.reduce((sum, policy) => sum + ((policy.premium && policy.premium.totalPremium) ? policy.premium.totalPremium : 0), 0);
    
    let lossRatio = 0;
    if (totalPremiums > 0) {
      lossRatio = ((totalPayouts / totalPremiums) * 100).toFixed(2);
    }
    
    // Also get total claims from users (all claims timeline for normal users is fetched by normal users, admin gets all)

    res.json({
      totalUsers,
      totalClaims,
      lossRatio: `${lossRatio}%`,
      totalPayouts,
      totalPremiums,
      flaggedUsers,
      recentTriggers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
