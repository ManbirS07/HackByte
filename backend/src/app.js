import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
dotenv.config()

import apiRoutes from './routes/api.js';
import connectToDatabase from './config/database.js';

const app = express();

// Connect to database
connectToDatabase();

// CORS configuration - allow all origins in development
app.use(cors({
  origin: '*', // Allow all origins in development'http://localhost:8080', 'http://127.0.0.1:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Routes
app.get('/', (req, res) => {
  res.send('Volunteer API is running!');
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
app.use('/assets', express.static('public/assets'));

export default app;