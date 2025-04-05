import Event from '../models/Event.js';

export const getallevents = async(req, res) => {
    try {
        console.log("Received filter params:", req.query);
        
        // Build query based on filters
        let query = {};
        
        // Filter by causes if provided
        if (req.query.causes) {
            const causes = Array.isArray(req.query.causes) 
                ? req.query.causes 
                : [req.query.causes];
            query.cause = { $in: causes };
            console.log("Filtering by causes:", causes);
        }
        
        // Filter by required skills if provided
        if (req.query.skills) {
            const skills = Array.isArray(req.query.skills) 
                ? req.query.skills 
                : [req.query.skills];
            
            // Correct way to filter array fields in MongoDB
            query.skills_required = { $in: skills };
            console.log("Filtering by skills:", skills);
        }
        
        // Filter by location if provided
        if (req.query.location) {
            const locationRegex = new RegExp(req.query.location, 'i');
            query.$or = [
                { 'location.city': locationRegex },
                { 'location.address': locationRegex },
                { 'location.pincode': locationRegex }
            ];
            console.log("Filtering by location:", req.query.location);
        }
        
        // Filter by date if provided
        if (req.query.date) {
            try {
                const searchDate = new Date(req.query.date);
                
                // Make sure the date is valid
                if (!isNaN(searchDate.getTime())) {
                    const nextDay = new Date(searchDate);
                    nextDay.setDate(searchDate.getDate() + 1);
                    
                    query.date = { 
                        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
                        $lt: new Date(nextDay.setHours(0, 0, 0, 0))
                    };
                    console.log("Filtering by date:", query.date);
                } else {
                    console.error("Invalid date format:", req.query.date);
                }
            } catch (dateError) {
                console.error("Error parsing date:", req.query.date, dateError);
            }
        }
        
        console.log("Final query:", JSON.stringify(query, null, 2));
        
        // Check if we actually have any filters
        const hasFilters = Object.keys(query).length > 0;
        
        // Execute the query
        const events = await Event.find(query);
        console.log(`Found ${events.length} events matching filters`);
        
        // Log the titles of found events for debugging
        console.log("Event titles:", events.map(e => e.title));
        
        res.status(200).json({ 
            events,
            meta: {
                total: events.length,
                filters: hasFilters ? query : "none"
            }
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.toString() 
        });
    }
}

export const geteventbyid = async(req, res) => {
    try {
        console.log("Fetching event with ID:", req.params.id);
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        // Include more comprehensive event details if needed
        // For example, you could populate volunteer data here
        
        console.log("Found event:", event.title);
        res.status(200).json({event});
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const createEvent = async (req, res) => {
    try {
        console.log("Creating new event with data:", req.body);
        
        const newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            cause: req.body.cause,
            location: req.body.location,
            date: new Date(req.body.date),
            time: req.body.time,
            duration: req.body.duration,
            skills_required: req.body.skills_required,
            volunteers_limit: req.body.volunteers_limit,
            organizer: req.body.organizer,
            image_url: req.body.image_url || `https://source.unsplash.com/800x400/?volunteer,${req.body.cause.toLowerCase()}`
        });
        
        await newEvent.save();
        console.log("Event created successfully with ID:", newEvent._id);
        
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
}

