import express from "express";
import cors from "cors";
import { PORT } from "./config/config.js";
import connectDB from "./config/db.js";

// Import routers with your explicit naming style
import authRouter from './routes/auth.routes.js';
import taskRouter from './routes/task.routes.js';
import adminRouter from './routes/admin.routes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Main API Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/admin', adminRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Avidus Task Manager API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});