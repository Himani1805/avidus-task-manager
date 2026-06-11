import Task from '../models/task.model.js';
import ActivityLog from '../models/activityLog.model.js';

// Create a new task
const createTask = async (req, res) => {
  const { title, description } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      createdBy: req.user._id,
    });

    // Log the task creation activity
    await ActivityLog.create({
      userId: req.user._id,
      action: 'Task creation',
      details: `Task created: "${title}"`,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks (Admins see all, Users see only their own)
const getTasks = async (req, res) => {
  try {
    let tasks;

    // Check role to filter or return all tasks
    if (req.user.role === 'Admin') {
      tasks = await Task.find({}).populate('createdBy', 'name email');
    } else {
      tasks = await Task.find({ createdBy: req.user._id });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task (Only for the owner or Admin)
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify ownership or Admin privileges
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Apply updates dynamically
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();

    // Log the update activity
    await ActivityLog.create({
      userId: req.user._id,
      action: 'Task update',
      details: `Task updated ID: ${id} to status: ${task.status}`,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task (Owner or Admin only)
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify authorization: must be the creator OR an admin
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    // Log the deletion activity
    await ActivityLog.create({
      userId: req.user._id,
      action: 'Task deletion',
      details: `Deleted task titled: "${task.title}"`,
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createTask, getTasks, updateTask, deleteTask };