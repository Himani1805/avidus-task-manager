import User from '../models/user.model.js';
import Task from '../models/task.model.js';
import ActivityLog from '../models/activityLog.model.js';

// Get all users (excluding passwords)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle user status between Active and Inactive
const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update status field
    user.status = status || user.status;
    await user.save();

    res.status(200).json({ message: `User status updated to ${user.status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all system activity logs (Newest first)
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({})
      .sort({ timestamp: -1 })
      .populate('userId', 'name email');

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch real-time analytics summary
const getAnalytics = async (req, res) => {
  try {
    // Run counting operations in parallel to maximize performance
    const [totalUsers, totalTasks, completedTasks, pendingTasks] = await Promise.all([
      User.countDocuments({}),
      Task.countDocuments({}),
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ status: 'Pending' })
    ]);

    res.status(200).json({
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, deleteUser, updateUserStatus, getActivityLogs, getAnalytics };