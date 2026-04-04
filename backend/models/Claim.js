const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  triggerEvent: { type: String, required: true }, // e.g. "Heavy Rain", "Heatwave"
  payoutAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Paid', 'Rejected', 'Suspicious'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);
