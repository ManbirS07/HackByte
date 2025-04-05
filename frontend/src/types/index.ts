// Common types used across the application

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  governmentId: {
    type: string;
    number: string;
    verified: boolean;
  };
  resume: {
    url: string;
    filename: string;
  };
  introVideo: {
    url: string;
    filename: string;
  };
  points: number;
  badges: Badge[];
  joinedAt: Date;
  completedEvents: number;
  rating: number;
  trustScore: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: "beginner" | "intermediate" | "advanced" | "expert" | "master";
  earnedAt?: Date;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  address: {
    city: string;
    full_address: string;
    pincode: string;
  };
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  logo_url: string;
  verified: boolean;
  createdAt?: Date; // Add createdAt property as optional
}

export interface Event {
  id: string;
  title: string;
  description: string;
  cause: string;
  location: {
    city: string;
    address: string;
    pincode: string;
  };
  date: Date;
  time: string;
  duration: string;
  skills_required: string[];
  volunteers_limit: number;
  volunteers_registered: string[];
  organizer: {
    id: string;
    name: string;
    contact_email: string;
    phone: string;
  };
  image_url?: string; 
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "moderator";
  createdAt: Date;
}

export interface SearchFilters {
  causes?: string[];
  skills?: string[];
  location?: string;
  date?: Date;
}

export interface Review {
  id: string;
  eventId: string;
  volunteerId: string;
  organizationId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface VolunteerApplication {
  id: string;
  volunteer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    interests: string[];
    governmentId: {
      type: string;
      number: string;
      verified: boolean;
      document_url: string;
    };
    resume_url: string;
    intro_video_url: string;
    points: number;
    badges: string[];
    completedEvents: number;
    trustScore: number;
  };
  event: {
    id: string;
    title: string;
    description: string;
    cause: string;
    date: Date;
    time: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: Date;
  reviewedAt?: Date;
  aiAnalysis?: {
    score: number;
    summary: string;
    strengths: string[];
    suggestions: string[];
  };
}

export const CAUSES = [
  "Health",
  "Education",
  "Environment",
  "Animal Welfare",
  "Elderly Care",
  "Children & Youth",
  "Disaster Relief",
  "Poverty Alleviation",
  "Community Development",
  "Arts & Culture"
];

export const SKILLS = [
  "Teaching",
  "Computer Skills",
  "Medical Knowledge",
  "Cooking",
  "Counseling",
  "Event Management",
  "Photography",
  "Design",
  "Gardening",
  "Construction",
  "Legal Knowledge",
  "Languages",
  "Social Media",
  "Writing",
  "Fundraising",
  "Music"
];

export const ID_TYPES = ["Aadhar Card", "Voter ID", "Passport", "Driving License", "PAN Card"];
