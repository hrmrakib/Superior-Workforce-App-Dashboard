import type { User, UserDetail, StatCard, ChartDataPoint } from "@/types";

// ─── Stats ─────────────────────────────────────────────────────────────────

export const statsData: StatCard[] = [
  { label: "Total Users", value: "1250", iconType: "users" },
  { label: "Employer", value: "525", iconType: "employer" },
  { label: "Job Seeker", value: "725", iconType: "jobseeker" },
  { label: "Total Earning", value: "$1254", iconType: "earning" },
  { label: "Active Job", value: "125", iconType: "activejob" },
];

// ─── Chart Data ────────────────────────────────────────────────────────────

export const revenueChartData: ChartDataPoint[] = [
  { year: "2020", value: 3200 },
  { year: "2021", value: 5800 },
  { year: "2022", value: 4200 },
  { year: "2023", value: 6500 },
  { year: "2024", value: 8900 },
  { year: "2025", value: 7400 },
  { year: "2026", value: 9200 },
];

export const monthlyChartData: ChartDataPoint[] = [
  { year: "Jan", value: 1200 },
  { year: "Feb", value: 1900 },
  { year: "Mar", value: 1500 },
  { year: "Apr", value: 2300 },
  { year: "May", value: 2100 },
  { year: "Jun", value: 2800 },
  { year: "Jul", value: 3200 },
  { year: "Aug", value: 2900 },
  { year: "Sep", value: 3500 },
  { year: "Oct", value: 3100 },
  { year: "Nov", value: 3800 },
  { year: "Dec", value: 4200 },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

const AVATARS = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
  "https://i.pravatar.cc/40?img=4",
  "https://i.pravatar.cc/40?img=5",
  "https://i.pravatar.cc/40?img=6",
  "https://i.pravatar.cc/40?img=7",
  "https://i.pravatar.cc/40?img=8",
];

// ─── Users Table Data ──────────────────────────────────────────────────────

export const allUsers: User[] = Array.from({ length: 72 }, (_, i) => ({
  id: `#1234${i + 1}`,
  name: i % 3 === 0 ? "Olivia Rhye" : i % 3 === 1 ? "Sarah Johnson" : "James Wilson",
  avatar: AVATARS[i % AVATARS.length],
  gmail:
    i % 3 === 0
      ? "Olivia123@gmail.com"
      : i % 3 === 1
      ? "sarah.johnson@email.com"
      : "james.wilson@gmail.com",
  phone: "0175589484",
  role: i % 2 === 0 ? "Job Seeker" : "Employer",
  joiningDate: "19 March, 2026",
  joiningDate2: "02 Feb, 2026",
  status:
    i % 5 === 1
      ? "Suspend"
      : i % 7 === 3
      ? "Pending"
      : "Active",
}));

export const activeUsers = allUsers.filter((u) => u.status === "Active");
export const pendingUsers = allUsers.filter((u) => u.status === "Pending");

// ─── Detailed User (modal) ─────────────────────────────────────────────────

export const sarahJohnsonDetail: UserDetail = {
  id: "#12345",
  name: "Sarah Johnson",
  avatar: "https://i.pravatar.cc/80?img=5",
  gmail: "sarah.johnson@email.com",
  phone: "+1 (415) 555-0123",
  role: "Job Seeker",
  joiningDate: "19 March, 2026",
  joiningDate2: "02 Feb, 2026",
  status: "Active",
  rating: 4.8,
  badge: "Registered Nurse",
  location: "San Francisco, CA",
  email: "sarah.johnson@email.com",
  points: 50,
  completedJobs: 50,
  cancellation: "5%",
  experience: "5 years experience",
  bio: "Motivated and detail-oriented individual seeking opportunities to apply my skills, grow professionally, and contribute effectively to a dynamic organization.",
  documents: [
    { id: "1", name: "Varicella Text Record", status: "none" },
    { id: "2", name: "MMR Vaccination Record", status: "none" },
    { id: "3", name: "Physical Exam and Health assesment", status: "none" },
    { id: "4", name: "Pennsylvania Department of Aging Letter", status: "none" },
    { id: "5", name: "Psychiatric and Mental Health Nursing - One", status: "none" },
    { id: "6", name: "Govt ID", status: "none" },
    { id: "7", name: "CV", status: "none" },
    { id: "8", name: "TB Test", status: "none" },
    { id: "9", name: "HEP Vaccination", status: "none" },
    { id: "10", name: "TDAP Vaccination", status: "none" },
  ],
  certifications: ["BLS", "ACLS", "PALS", "RN License", "CNA License", "CPR Certified"],
  skills: ["Vital Signs", "CPR", "Medical Records", "IV Therapy", "Wound Care"],
  education: [
    {
      id: "1",
      institution: "H.S.C",
      school: "Hashil School & College",
      year: "2013",
      completionStatus: "Completed",
      license: "N/A",
      certificate: "Certificate.png",
    },
  ],
};

export const pendingUserDetail: UserDetail = {
  ...sarahJohnsonDetail,
  status: "Pending",
  documents: [
    { id: "1", name: "Varicella Text Record", status: "invalid" },
    { id: "2", name: "MMR Vaccination Record", status: "invalid" },
    { id: "3", name: "Physical Exam and Health assessment", status: "valid" },
    { id: "4", name: "Pennsylvania Department of Aging Letter", status: "valid" },
    { id: "5", name: "Psychiatric and Mental Health Nursing - One", status: "valid" },
    { id: "6", name: "Govt ID", status: "valid" },
    { id: "7", name: "CV", status: "valid" },
    { id: "8", name: "TB Test", status: "valid" },
    { id: "9", name: "HEP Vaccination", status: "invalid" },
    { id: "10", name: "TDAP Vaccination", status: "invalid" },
  ],
  education: [
    {
      id: "1",
      institution: "H.S.C",
      school: "Hashil School & College",
      year: "2013",
      completionStatus: "Completed",
      license: "N/A",
      certificate: "Certificate.png",
    },
    {
      id: "2",
      institution: "H.S.C",
      school: "Hashil School & College",
      year: "2013",
      completionStatus: "Completed",
      license: "N/A",
      certificate: "Certificate.png",
    },
  ],
};
