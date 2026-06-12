import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getActivityLogs,
  getAnalytics
} from '../controllers/admin.controller.js';

const adminRouter = express.Router();

// Enforce both protection layers globally for all administrative endpoints
adminRouter.use(protect, admin);

// Admin core routes
adminRouter.get('/users', getAllUsers);
adminRouter.delete('/users/:id', deleteUser);
adminRouter.put('/users/:id/status', updateUserStatus);
adminRouter.get('/logs', getActivityLogs);
adminRouter.get('/analytics', getAnalytics);

export default adminRouter;