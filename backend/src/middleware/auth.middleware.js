import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/config.js'; 

// Middleware to protect routes from unauthorized access
const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the 'Bearer <token>' string
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our centralized JWT secret
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch the user from database using the token ID and exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      // Check if the user exists in the database
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Block access immediately if the user account status is set to Inactive
      if (req.user.status === 'Inactive') {
        return res.status(403).json({ message: 'User account is inactive. Please contact admin' });
      }

      // Move to the next middleware or controller if everything is fine
      return next();
    } catch (error) {
      // Handle expired or modified/invalid tokens gracefully
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Return an error if no authorization token was provided in headers
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to restrict access to Admin users only
const admin = (req, res, next) => {
  // Check if the user object exists on the request and has the Admin role
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    // Return a forbidden error if the user role is not Admin
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };