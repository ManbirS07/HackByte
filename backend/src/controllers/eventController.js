import Event from '../models/Event.js';

export const getallevents = async(req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({events});
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const geteventbyid = async(req, res) => {
    try {
        console.log(req.params.id)
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({event});
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const createEvent = async (req, res) => {
    try {
        const {title, description, cause, location, city, address, pincode, date, startTime, duration , requiredSkills, numberOfVolunteers } = req.body;
        const newEvent = new Event({ title, description, cause, location, city, address, pincode,date, startTime, duration, requiredSkills, numberOfVolunteers 
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

