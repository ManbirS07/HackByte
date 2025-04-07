import express from 'express';
const router = express.Router();

// Simple test endpoint
router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Test POST endpoint to see what data is received
router.post('/echo', (req, res) => {
  console.log('Received data:', req.body);
  res.json({ 
    message: 'Data received successfully',
    received: req.body
  });
});

module.exports = router;
