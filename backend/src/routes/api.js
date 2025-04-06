import express from 'express';
const router = express.Router(); 
import { getallevents, geteventbyid, createEvent} from '../controllers/eventController.js';
import { getallOrganizations, getorgbyid, createOrganization, findOrganizationByName, loginOrganization } from '../controllers/organizationController.js';
import { createVolunteer, getVolunteerById, updateVolunteer, getAllVolunteers, loginVolunteer } from '../controllers/volunteerController.js';
import { 
  getOrganizationApplications, 
  createApplication, 
  analyzeResume, 
  updateApplicationStatus,
  getVolunteerApplications // Import the new controller function
} from '../controllers/applicationController.js';

// Volunteer routes
router.post('/volunteers/register', createVolunteer);
router.post('/volunteers/login', loginVolunteer); // Add login endpoint
router.get('/volunteers/:id', getVolunteerById);
router.put('/volunteers/:id', updateVolunteer);
router.get('/volunteers', getAllVolunteers);

// Organization routes 
router.post('/organizations/register', createOrganization);
router.post('/organizations/login', loginOrganization); // Add login endpoint
router.get('/organizations', getallOrganizations);
router.get('/organizations/search', findOrganizationByName);
router.get('/organizations/:id', getorgbyid);

// Event routes 
router.get('/events', getallevents);
router.get('/events/:id', geteventbyid);
router.post('/create-event', createEvent);

// Application routes
router.post('/applications', createApplication);
router.get('/organizations/:organizationId/applications', getOrganizationApplications);
router.post('/applications/:applicationId/analyze', analyzeResume);
router.put('/applications/:applicationId/status', updateApplicationStatus);
router.get('/volunteers/:volunteerId/applications', getVolunteerApplications); // New route

// Admin routes 
router.post('/admins', (req, res) => {
    res.send('Create admin endpoint');
});
router.get('/admins/:id', (req, res) => {
    res.send('Get admin by ID endpoint');
});

export default router;
