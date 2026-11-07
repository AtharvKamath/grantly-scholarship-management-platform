export type UserRole = 'student' | 'admin';

export type EducationLevel =
  | 'School (9th-12th)'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Diploma / Polytechnic'
  | 'PhD / Doctoral'
  | 'All';

export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'All';

export type ApplicationStatus =
  | 'Interested'
  | 'Preparing Documents'
  | 'Applied'
  | 'Under Review'
  | 'Approved'
  | 'Rejected';

export type DocumentType =
  | 'Academic Marksheet'
  | 'Income Certificate'
  | 'Caste Certificate'
  | 'Aadhaar Card'
  | 'Bonafide Certificate'
  | 'Bank Passbook'
  | 'Other Documents';

export interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  state: string;
  district: string;
  collegeName: string;
  educationLevel: EducationLevel;
  course: string;
  currentYear: string;
  cgpa: number; // e.g. 8.4
  annualIncome: number; // in INR
  category: Category;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  avatarUrl?: string;
  preferredScholarshipTypes?: string[];
  preferredEducationLevel?: EducationLevel;
  preferredCourse?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  studentProfile?: StudentProfile;
}

export interface Scholarship {
  id: string;
  name: string;
  organization: string;
  amount: number; // in INR
  amountDisplay: string;
  description: string;
  educationLevel: EducationLevel;
  eligibleCourses: string[];
  states: string[];
  category: Category;
  maxFamilyIncome?: number; // ceiling in INR
  minCGPA?: number;
  genderPreference?: 'All' | 'Female' | 'Male';
  deadline: string; // ISO date format YYYY-MM-DD
  applicationUrl: string;
  verified: boolean;
  featured?: boolean;
  eligibilityCriteria: string[];
  requiredDocuments: DocumentType[];
  benefits: string[];
  applicationProcess: string[];
  importantDates: {
    title: string;
    date: string;
  }[];
  createdAt: string;
}

export interface ApplicationRecord {
  id: string;
  studentId: string;
  scholarshipId: string;
  scholarshipName: string;
  organization: string;
  amount: number;
  amountDisplay: string;
  status: ApplicationStatus;
  appliedDate: string;
  deadline: string;
  notes?: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  studentId: string;
  documentName: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Review';
  fileUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'status' | 'system' | 'match';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AIRecommendation {
  scholarshipId: string;
  matchCategory: 'HIGH MATCH' | 'POSSIBLE MATCH' | 'NOT ELIGIBLE';
  matchPercentage: number;
  whyItMatches: string;
  missingRequirements: string[];
  actionTips: string;
}
