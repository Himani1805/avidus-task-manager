import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ActivityLog from '../models/activityLog.model.js';
import { JWT_SECRET, JWT_EXPIRES } from '../config/config.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password hashing is handled in model)
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Verify password
    if (user && (await user.comparePassword(password))) {
      
      // Block inactive users
      if (user.status === 'Inactive') {
        return res.status(403).json({ message: 'User account is inactive. Please contact admin' });
      }

      // Log login activity
      await ActivityLog.create({
        userId: user._id,
        action: 'Login activity',
        details: 'User logged in successfully',
      });

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser };