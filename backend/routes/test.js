import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

export default router;
