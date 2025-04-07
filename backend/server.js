import express from 'express';
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Basic route for testing API connection
app.get('/api', (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Routes
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/test', require('./routes/test'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackbyte')
  .then(() => {
    console.log('MongoDB Connected');
    // Enable detailed mongoose debugging to log all queries
    mongoose.set('debug', true);
    
    // Define port
    const PORT = process.env.PORT || 5000;

    // Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
