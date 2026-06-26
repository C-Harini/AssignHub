const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register  (students only)
async function register(req, res) {
  try {
    const { name, email, rollNumber, rollNo, password } = req.body || {};
    const roll = rollNumber || rollNo;
    if (!name || !email || !roll || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      rollNumber: roll,
      password,
      role: 'student',
      status: 'pending',
    });

    return res.status(201).json({
      message: 'Registration submitted. Awaiting admin approval.',
      user: user.toSafeJSON(),
    });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is not a ${role} account` });
    }

    if (user.role === 'student') {
      if (user.status === 'pending') {
        return res.status(403).json({ message: 'Waiting for admin approval' });
      }
      if (user.status === 'rejected') {
        return res.status(403).json({ message: 'Registration rejected' });
      }
    }

    const token = generateToken(user);
    return res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
}

// GET /api/auth/profile
async function profile(req, res) {
  return res.json({ user: req.user.toSafeJSON ? req.user.toSafeJSON() : req.user });
}

module.exports = { register, login, profile };
