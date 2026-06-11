import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Register route
authRouter.post('/register', registerUser);

// Login route
authRouter.post('/login', loginUser);

export default authRouter;