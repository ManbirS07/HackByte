const Volunteer = require('../models/Volunteer');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register new volunteer
exports.registerVolunteer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    // Check if volunteer already exists
    let volunteer = await Volunteer.findOne({ email });
    if (volunteer) {
      return res.status(400).json({ msg: 'Volunteer already exists with this email' });
    }

    // Create new volunteer
    volunteer = new Volunteer({
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
    });

    await volunteer.save();

    // Create JWT token
    const payload = {
      volunteer: {
        id: volunteer.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken',
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, volunteer: { 
          id: volunteer.id,
          full_name: volunteer.full_name,
          email: volunteer.email
        }});
      }
    );
  } catch (err) {
    console.error('Error in registerVolunteer:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get volunteer profile
exports.getVolunteerProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.volunteer.id).select('-password');
    if (!volunteer) {
      return res.status(404).json({ msg: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
