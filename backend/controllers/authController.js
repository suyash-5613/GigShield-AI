const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, city, platform, averageWeeklyIncome, password, role } = req.body;
    const existingUser = await User.findOne({ name });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
      name, city, platform, averageWeeklyIncome, password: hashedPassword, role: role || 'worker'
    });
    await user.save();
    
    // Auto-login after registration
    const token = jwt.sign({ id: user._id, role: user.role, city: user.city }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    
    res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, name: user.name, city: user.city, role: user.role }});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role, city: user.city }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    
    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, city: user.city, role: user.role }});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
