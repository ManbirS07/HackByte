import express from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import auth from '../middleware/auth.js';
import Volunteer from '../models/Volunteer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// @route   POST /api/volunteers/register
// @desc    Register a volunteer
// @access  Public
router.post(
  '/register',
  [
    check('full_name', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Please include a valid phone number').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('government_id.type', 'Government ID type is required').not().isEmpty(),
    check('government_id.number', 'Government ID number is required').not().isEmpty(),
    check('government_id.document_url', 'Government ID document URL is required').not().isEmpty(),
    check('resume_url', 'Resume URL is required').not().isEmpty(),
    check('intro_video_url', 'Intro video URL is required').not().isEmpty(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      console.log('Received registration request:', req.body);

      const {
        full_name,
        email,
        phone,
        password,
        government_id,
        resume_url,
        intro_video_url,
        interests,
        badges,
        points,
        completed_events,
        reviews
      } = req.body;

      // Check if volunteer already exists with this email
      let volunteer = await Volunteer.findOne({ email });
      if (volunteer) {
        return res.status(400).json({ msg: 'Volunteer already exists with this email' });
      }

      // Create new volunteer instance
      volunteer = new Volunteer({
        full_name,
        email,
        phone,
        password, // Will be hashed by pre-save hook in model
        government_id,
        resume_url,
        intro_video_url,
        interests,
        badges: badges || [],
        points: points || 0,
        completed_events: completed_events || 0,
        reviews: reviews || []
      });

      // Save volunteer to database
      await volunteer.save();
      console.log('Volunteer saved successfully:', volunteer._id);

      // Create JWT payload
      const payload = {
        volunteer: {
          id: volunteer.id
        }
      };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '5h' },
        (err, token) => {
          if (err) {
            console.error('JWT error:', err);
            throw err;
          }
          res.json({
            token,
            volunteer: {
              id: volunteer.id,
              full_name: volunteer.full_name,
              email: volunteer.email
            }
          });
        }
      );
    } catch (err) {
      console.error('Error registering volunteer:', err.message);
      if (err.name === 'ValidationError') {
        // Mongoose validation error
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages.join(', ') });
      }
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route   GET /api/volunteers/me
// @desc    Get current volunteer profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.volunteer.id).select('-password');
    
    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    
    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
