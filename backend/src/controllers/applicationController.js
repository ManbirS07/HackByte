import VolunteerApplication from '../models/VolunteerApplication.js';
import Volunteer from '../models/Volunteer.js';
import Event from '../models/Event.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Get all applications for an organization
export const getOrganizationApplications = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    if (!organizationId) {
      return res.status(400).json({ message: 'Organization ID is required' });
    }
    
    // Find applications for this organization
    const applications = await VolunteerApplication.find({ organization: organizationId })
      .populate({
        path: 'volunteer',
        select: 'fullName email phone areaOfInterests govId resume introVideo badges points completedEvents trustScore'
      })
      .populate({
        path: 'event',
        select: 'title description cause date time location'
      })
      .sort({ appliedAt: -1 });
    
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
};

// Get all applications for a volunteer
export const getVolunteerApplications = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    
    if (!volunteerId) {
      return res.status(400).json({ message: 'Volunteer ID is required' });
    }
    
    // Find applications for this volunteer
    const applications = await VolunteerApplication.find({ volunteer: volunteerId })
      .populate({
        path: 'event',
        select: 'title description cause date time location organizer'
      })
      .populate({
        path: 'organization',
        select: 'name email phone website'
      })
      .sort({ appliedAt: -1 });
    
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
};

// Create new application
export const createApplication = async (req, res) => {
  try {
    const { volunteerId, eventId } = req.body;
    
    // Find event to get organization ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if event has available slots
    if (event.volunteers_limit <= 0) {
      return res.status(400).json({ message: 'This event has no more volunteer slots available' });
    }
    
    const organizationId = event.organizer.id;
    
    // Check if application already exists
    const existingApplication = await VolunteerApplication.findOne({
      volunteer: volunteerId,
      event: eventId
    });
    
    if (existingApplication) {
      return res.status(400).json({ 
        message: 'You have already applied for this event',
        application: existingApplication
      });
    }
    
    // Get volunteer details to include in the application
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    // Create new application
    const application = new VolunteerApplication({
      volunteer: volunteerId,
      event: eventId,
      organization: organizationId
    });
    
    await application.save();
    
    // Update event to decrement available volunteer slots
    event.volunteers_limit -= 1;
    event.volunteers_registered.push(volunteerId);
    await event.save();
    
    res.status(201).json({ 
      message: 'Application submitted successfully', 
      application,
      remainingSlots: event.volunteers_limit
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
};

// Analyze resume using Gemini AI
export const analyzeResume = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await VolunteerApplication.findById(applicationId)
      .populate({
        path: 'volunteer',
        select: 'fullName email phone areaOfInterests govId resume introVideo badges points completedEvents trustScore'
      })
      .populate({
        path: 'event',
        select: 'title description cause skills_required'
      });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    const volunteer = application.volunteer;
    const event = application.event;
    
    // Prepare context for AI analysis
    const prompt = `
      Analyze this volunteer's profile for the event "${event.title}" with cause "${event.cause}" requiring skills: ${event.skills_required.join(', ')}.
      
      Volunteer Information:
      - Name: ${volunteer.fullName}
      - Areas of Interest: ${volunteer.areaOfInterests.join(', ')}
      - Completed Events: ${volunteer.completedEvents?.length || 0}
      - Trust Score: ${volunteer.trustScore}
      - Points: ${volunteer.points}
      - Badges: ${volunteer.badges?.join(', ') || 'None'}
      
      Based on this information, provide a brief analysis of how well the volunteer's profile matches the event requirements.
      Give a suitability score between 0-100, a brief summary, and list key strengths and any improvement suggestions.
      Format the output as JSON with the following structure:
      {
        "score": (number between 0-100),
        "summary": (brief summary),
        "strengths": [(list of key strengths)],
        "suggestions": [(list of suggestions for improvement)]
      }
    `;
    
    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.log('Raw AI response:', text);
      analysis = {
        score: 70,
        summary: "Could not generate detailed analysis. The volunteer appears to be a good match based on available information.",
        strengths: ["Past volunteer experience"],
        suggestions: ["Consider reviewing full resume for more details"]
      };
    }
    
    // Update application with AI analysis
    application.aiAnalysis = analysis;
    await application.save();
    
    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const application = await VolunteerApplication.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    application.status = status;
    application.reviewNotes = notes;
    application.reviewedAt = new Date();
    
    await application.save();
    
    // If accepted, add the volunteer to the event's accepted volunteers
    if (status === 'accepted') {
      const event = await Event.findById(application.event);
      if (event) {
        if (!event.acceptedVolunteers) {
          event.acceptedVolunteers = [];
        }
        
        if (!event.acceptedVolunteers.includes(application.volunteer)) {
          event.acceptedVolunteers.push(application.volunteer);
          await event.save();
        }
      }
    }
    
    res.status(200).json({ 
      message: `Application ${status} successfully`, 
      application 
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
};
