import express, { Application } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import initDatabase from './config/db';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Initialize Database
initDatabase();

// Middleware
app.use(express.json());

// use cors middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Routes
app.use('/auth', authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});