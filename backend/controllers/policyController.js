const Policy = require('../models/Policy');
const User = require('../models/User');
const Claim = require('../models/Claim');
const { getCityState } = require('../utils/globalState');

exports.calculatePremium = async (req, res) => {
  try {
    const { coverageAmount } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Base Price
    const basePrice = 30;
    
    // Get current environmental state for user's city
    const env = getCityState(user.city);
    
    let rainRisk = 0;
    if (env.rain > 70) rainRisk = 15;
    else if (env.rain >= 30) rainRisk = 10;
    
    let heatRisk = 0;
    if (env.temp > 40) heatRisk = 10;
    else if (env.temp > 35) heatRisk = 5;
    
    let pollutionRisk = 0;
    if (env.aqi > 300) pollutionRisk = 8;
    else if (env.aqi > 200) pollutionRisk = 4;
    
    const totalPremium = basePrice + rainRisk + heatRisk + pollutionRisk;
    
    // Also derive "Risk Score" based on these factors
    let riskScore = 'Low';
    if (totalPremium > 45) riskScore = 'High';
    else if (totalPremium > 35) riskScore = 'Medium';
    
    res.json({
      basePrice,
      rainRisk,
      heatRisk,
      pollutionRisk,
      totalPremium,
      environmentalState: env,
      riskScore
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.purchasePolicy = async (req, res) => {
  try {
    const { coverageAmount, calculatedPremium } = req.body;
    
    // Check if user already has an active policy
    const existing = await Policy.findOne({ user: req.user.id, status: 'Active' });
    if (existing) {
      return res.status(400).json({ error: 'You already have an active policy' });
    }
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7-day policy
    
    const policy = new Policy({
      user: req.user.id,
      coverageAmount,
      premium: calculatedPremium,
      endDate,
      status: 'Active'
    });
    
    await policy.save();
    
    res.status(201).json({ message: 'Policy purchased successfully', policy });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMyPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({ user: req.user.id, status: 'Active' }).sort({ createdAt: -1 });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

