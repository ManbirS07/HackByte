
import Organization from '../models/Organization.js';

export const getallOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json({ organizations });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getorgbyid = async (req, res) => {
    try {
        console.log(req.params.id)
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json({organization});
    } catch (error) {
        console.error('Error fetching organization:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const createOrganization = async (req, res) => {
    try {
        const {
            name,
            description,
            email,
            phone,
            website,
            address,
            social_links,
            logo_url,
            password // In a real implementation, this would be hashed
        } = req.body;
        
        // Check if organization with the same email already exists
        const existingOrganization = await Organization.findOne({ email });
        if (existingOrganization) {
            return res.status(400).json({ message: 'Organization with this email already exists' });
        }
        
        // Create new organization
        const newOrganization = new Organization({
            name,
            description,
            email,
            phone,
            website,
            address,
            social_links,
            logo_url,
            // In a real implementation, we would store a hashed password
            // and have user authentication logic
        });
        
        await newOrganization.save();
        
        res.status(201).json({
            message: 'Organization registered successfully',
            organization: {
                id: newOrganization._id,
                name: newOrganization.name,
                email: newOrganization.email,
                verified: newOrganization.verified
            }
        });
    } catch (error) {
        console.error('Error creating organization:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
