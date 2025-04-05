import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    areaOfInterests: [{
        type: String,
        enum: [
            "Health", "Education", "Environment", "Animal Welfare",
            "Elderly Care", "Children & Youth", "Disaster Relief",
            "Poverty Alleviation", "Community Development", "Arts & Culture"
        ]
    }],
    govId: {
        idType: {
            type: String,
            enum: ["Aadhar", "PAN", "Driving License", "Passport", "Voter ID"],
            required: true
        },
        idNumber: { type: String, required: true },
        idDocument: { type: String, required: true }
    },
    resume: { type: String, required: true },
    introVideo: { type: String, required: true },
    badges: [{ type: String }],
    points: { type: Number, default: 0 },
    trustScore: { type: Number, default: 0 },
    completedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    reviews: [{
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String
    }],
    workHistory: [{
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
        title: String,                  
        cause: String,             
        date: Date,                     
        hoursContributed: Number,       
        feedbackFromOrg: {
            rating: { type: Number, min: 1, max: 5 },
            comment: String
        },
        badgeEarned: String             // Badge earned in this event (if any)
    }]
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteers', volunteerSchema);
export default Volunteer;