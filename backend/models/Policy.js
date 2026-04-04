const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverageAmount: { type: Number, enum: [500, 1000, 2000], required: true },
  premium: {
    basePrice: { type: Number, required: true },
    rainRisk: { type: Number, default: 0 },
    heatRisk: { type: Number, default: 0 },
    pollutionRisk: { type: Number, default: 0 },
    totalPremium: { type: Number, required: true }
  },
  status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Policy', PolicySchema);
