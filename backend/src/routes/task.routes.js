import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller.js';

const taskRouter = express.Router();

// Apply protect middleware globally to all task endpoints
taskRouter.use(protect);

// Task routes
taskRouter.post('/', createTask);
taskRouter.get('/', getTasks);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);

export default taskRouter;