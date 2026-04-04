const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  platform: { type: String, required: true },
  averageWeeklyIncome: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['worker', 'admin'], default: 'worker' },
  flags: {
    suspicious: { type: Boolean, default: false },
    reason: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
