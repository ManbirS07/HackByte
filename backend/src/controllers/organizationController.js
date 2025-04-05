import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

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
        const { id } = req.params;
        
        // Log the ID for debugging purposes
        console.log("Organization ID received:", id);
        
        // Check if ID is valid before querying
        if (!id || id === 'undefined' || id === 'null') {
            return res.status(400).json({ message: 'Invalid organization ID: empty or undefined' });
        }
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid organization ID format: ${id}` });
        }
        
        const organization = await Organization.findById(id);
        console.log("Organization found:", organization ? "Yes" : "No");
        
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        
        // Send the complete organization data
        res.status(200).json({organization});
    } catch (error) {
        console.error('Error fetching organization:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
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

// Add a new function to find organization by name
export const findOrganizationByName = async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name) {
            return res.status(400).json({ message: 'Organization name is required' });
        }
        
        console.log("Searching for organization with name:", name);
        
        // Create a case-insensitive regex for name search
        const nameRegex = new RegExp(name, 'i');
        const organization = await Organization.findOne({ name: nameRegex });
        
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        
        console.log("Found organization:", organization.name, "with ID:", organization._id);
        res.status(200).json({ organization });
    } catch (error) {
        console.error('Error finding organization by name:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
