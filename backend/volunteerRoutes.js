const express = require('express');
const router = express.Router();
const Volunteer = require('./models/Volunteer'); // Adjust path as needed

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // In a real app, you would query your database
    // For now, check against the data you provided
    const volunteer = await Volunteer.findOne({ email });
    
    if (!volunteer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // In production, use proper password comparison with bcrypt
    if (volunteer.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Return success with user data (excluding sensitive info)
    const userData = {
      id: volunteer._id,
      fullName: volunteer.fullName,
      email: volunteer.email,
      points: volunteer.points,
      trustScore: volunteer.trustScore
    };
    
    return res.status(200).json({ 
      message: 'Login successful', 
      token: 'dummy-token', // In production, use JWT
      user: userData 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
