import Volunteer from '../models/Volunteer.js';

// Create a new volunteer
export const createVolunteer = async (req, res) => {
    try {
        const volunteer = new Volunteer(req.body);
        await volunteer.save();
        res.status(201).json(volunteer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get volunteer details by ID
export const getVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update volunteer information
export const updateVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all volunteers
export const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage volunteer applications for events
export const applyForEvent = async (req, res) => {
    const { volunteerId, eventId } = req.body;
    try {
        const volunteer = await Volunteer.findById(volunteerId);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        volunteer.completedEvents.push(eventId);
        await volunteer.save();
        res.status(200).json(volunteer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login volunteer
export const loginVolunteer = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Attempting login for:', email);
        
        // Find volunteer by email
        const volunteer = await Volunteer.findOne({ email });
        
        if (!volunteer) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // In production, you would use bcrypt.compare
        // This is a simplified implementation for demonstration
        if (volunteer.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Generate JWT token (assuming jwt is imported)
        // In a real app, use a library like jsonwebtoken
        const token = 'sample-jwt-token-' + volunteer._id; // Simplified for demo
        
        console.log('Login successful for volunteer:', volunteer.fullName);
        
        // Return success with token and basic volunteer info
        res.status(200).json({
            message: 'Login successful',
            token,
            volunteer: {
                id: volunteer._id,
                fullName: volunteer.fullName,
                email: volunteer.email
            }
        });
    } catch (error) {
        console.error('Volunteer login error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};