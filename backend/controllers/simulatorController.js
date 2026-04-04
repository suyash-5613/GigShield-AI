const Policy = require('../models/Policy');
const User = require('../models/User');
const Claim = require('../models/Claim');
const { updateCityState } = require('../utils/globalState');

exports.triggerEvent = async (req, res) => {
  try {
    const { city, eventType } = req.body;
    let environmentalUpdates = {};

    if (eventType === 'Heavy Rain') environmentalUpdates = { rain: 100 };
    else if (eventType === 'Heatwave') environmentalUpdates = { temp: 45 };
    else if (eventType === 'High Pollution') environmentalUpdates = { aqi: 400 };
    else if (eventType === 'Curfew') environmentalUpdates = { curfew: true }; // Just flag

    updateCityState(city, environmentalUpdates);

    // Find all users in the affected city
    const usersInCity = await User.find({ city });
    const userIds = usersInCity.map(u => u._id);

    // Find active policies for these users
    const activePolicies = await Policy.find({ user: { $in: userIds }, status: 'Active' });

    let processedCount = 0;
    
    // Process Zero-Touch Claims
    for (const policy of activePolicies) {
      // Payout is 40% of weekly coverage
      const payoutAmount = policy.coverageAmount * 0.40;

      // FRAUD DETECTION checks
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // 1. Same trigger repeatedly check
      const recentSimilarClaim = await Claim.findOne({
        policy: policy._id,
        triggerEvent: eventType,
        createdAt: { $gte: twentyFourHoursAgo }
      });

      if (recentSimilarClaim) {
        // Prevent duplicate claims entirely
        continue;
      }

      // 2. >2 claims in 24 hours -> suspicious
      const recentClaimsCount = await Claim.countDocuments({
        user: policy.user,
        createdAt: { $gte: twentyFourHoursAgo }
      });

      let claimStatus = 'Approved'; // auto approve by default
      if (recentClaimsCount >= 2) {
        claimStatus = 'Suspicious';
        
        // Flag user
        await User.findByIdAndUpdate(policy.user, { 
          'flags.suspicious': true, 
          'flags.reason': '>2 claims in 24h' 
        });
      } else {
        // Instantly mark as paid for Demo purposes (Instant Payout)
        claimStatus = 'Paid';
      }
      
      const newClaim = new Claim({
        user: policy.user,
        policy: policy._id,
        triggerEvent: eventType,
        payoutAmount,
        status: claimStatus
      });

      await newClaim.save();
      
      // Notify Frontend via Socket.io
      if (req.io) {
        req.io.emit('claim-update', {
          userId: policy.user,
          claim: newClaim,
          message: claimStatus === 'Paid' ? `✅ ₹${payoutAmount} credited successfully for ${eventType}` : `⚠️ Claim flagged for ${eventType}`
        });
      }

      processedCount++;
    }

    res.json({ message: `Triggered ${eventType} in ${city}`, affectedPolicies: activePolicies.length, claimsProcessed: processedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
