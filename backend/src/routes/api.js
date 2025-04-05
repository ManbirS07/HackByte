
import express from 'express';
const router = express.Router(); 
import { getallevents, geteventbyid, createEvent} from '../controllers/eventController.js';
import { getallOrganizations, getorgbyid, createOrganization } from '../controllers/organizationController.js';
import { createVolunteer, getVolunteerById, updateVolunteer, getAllVolunteers } from '../controllers/volunteerController.js';

// Volunteer routes
router.post('/volunteers/register', createVolunteer);
router.get('/volunteers/:id', getVolunteerById);
router.put('/volunteers/:id', updateVolunteer);
router.get('/volunteers', getAllVolunteers);

// Organization routes 
router.post('/organizations/register', createOrganization);
router.get('/organizations', getallOrganizations);
router.get('/organizations/:id', getorgbyid);

// Event routes 
router.get('/events', getallevents);
router.get('/events/:id', geteventbyid);
router.post('/create-event', createEvent);

// Admin routes 
router.post('/admins', (req, res) => {
    res.send('Create admin endpoint');
});
router.get('/admins/:id', (req, res) => {
    res.send('Get admin by ID endpoint');
});

export default router;
