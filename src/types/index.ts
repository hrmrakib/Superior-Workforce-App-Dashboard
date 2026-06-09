// ─── User & Related Types ──────────────────────────────────────────────────

export type UserStatus = "Active" | "Inactive" | "Suspend" | "Pending";
export type UserRole = "Job Seeker" | "Employer" | "Admin";

export interface User {
  id: string;
  name: string;
  avatar: string;
  gmail: string;
  phone: string;
  role: UserRole;
  joiningDate: string;
  joiningDate2: string;
  status: UserStatus;
}

export interface Document {
  id: string;
  name: string;
  status?: "valid" | "invalid" | "none";
}

export interface Education {
  id: string;
  institution: string;
  school: string;
  year: string;
  completionStatus: "Completed" | "In Progress";
  license: string;
  certificate: string;
}

export interface UserDetail extends User {
  rating: number;
  badge: string;
  location: string;
  email: string;
  points: number;
  completedJobs: number;
  cancellation: string;
  experience: string;
  bio: string;
  documents: Document[];
  certifications: string[];
  skills: string[];
  education: Education[];
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export interface StatCard {
  label: string;
  value: string | number;
  iconType: "users" | "employer" | "jobseeker" | "earning" | "activejob";
}

// ─── Chart ─────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  year: string;
  value: number;
}

// ─── Notification ──────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  createdAt: string;
}

// ─── Pagination ────────────────────────────────────────────────────────────

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}
