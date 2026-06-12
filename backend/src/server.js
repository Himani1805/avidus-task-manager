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
const allowedOrigins = [
  'http://localhost:5173',
  'https://avidus-task-manager-tau.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman, or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));


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