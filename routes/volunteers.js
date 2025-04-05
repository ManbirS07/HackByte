const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const auth = require('../middleware/auth');

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
    check('interests', 'Interests should be an array').isArray(),
  ],
  volunteerController.registerVolunteer
);

// @route   GET /api/volunteers/profile
// @desc    Get volunteer profile
// @access  Private
router.get('/profile', auth, volunteerController.getVolunteerProfile);

module.exports = router;
