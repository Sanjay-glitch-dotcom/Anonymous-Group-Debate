const mongoose = require('mongoose');
const User = mongoose.model('User');
const { signToken } = require('../services/auth');

async function signup(req, res) {
  try {
    const { email, password, displayName } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = new User({ email, displayName });
    await user.setPassword(password);
    await user.save();
    const token = signToken(user);
    res.status(201).json({ token });
  } catch (e) {
    res.status(500).json({ message: 'Signup failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
}

module.exports = { signup, login };
