"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Timer,
  Building2,
  UserCircle,
  Briefcase,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

type JobStatus = "Ongoing" | "Upcoming" | "Completed";

interface Job {
  id: string;
  hospital: string;
  role: string;
  status: JobStatus;
  location: string;
  employeesAssigned: number;
  pay: string;
  shift: string;
  type: string;
  date: string;
  remainingTime: string;
}

const mockJobs: Job[] = Array.from({ length: 12 }, (_, i) => ({
  id: `JOB${1000 + i}`,
  hospital: "City Hospital",
  role: "CNA",
  status: ["Ongoing", "Ongoing", "Upcoming", "Completed"][i % 4] as JobStatus,
  location: "Los Angeles, CA",
  employeesAssigned: 10,
  pay: "$22 / hour",
  shift: "Night Shift",
  type: "Full-time",
  date: "12 March, 2026",
  remainingTime: "2h remaining",
}));

const ITEMS_PER_PAGE = 6;

export default function ManageJobsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<JobStatus | "All Jobs">(
    "All Jobs",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.hospital
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTab = activeTab === "All Jobs" || job.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / ITEMS_PER_PAGE),
  );
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <div className='bg-white rounded-xl border border-slate-200 p-4'>
          <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3'>
            <Users className='w-5 h-5 text-blue-500' />
          </div>
          <p className='text-sm text-slate-500 font-medium'>Total Users</p>
          <p className='text-2xl font-bold text-slate-800 mt-1'>1250</p>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-4'>
          <div className='w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3'>
            <UserCircle className='w-5 h-5 text-green-500' />
          </div>
          <p className='text-sm text-slate-500 font-medium'>Employer</p>
          <p className='text-2xl font-bold text-slate-800 mt-1'>525</p>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-4'>
          <div className='w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-3'>
            <Users className='w-5 h-5 text-orange-500' />
          </div>
          <p className='text-sm text-slate-500 font-medium'>Job Seeker</p>
          <p className='text-2xl font-bold text-slate-800 mt-1'>725</p>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-4'>
          <div className='w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3'>
            <BarChart3 className='w-5 h-5 text-purple-500' />
          </div>
          <p className='text-sm text-slate-500 font-medium'>Total Earning</p>
          <p className='text-2xl font-bold text-slate-800 mt-1'>$1254</p>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-4'>
          <div className='w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3'>
            <Briefcase className='w-5 h-5 text-slate-500' />
          </div>
          <p className='text-sm text-slate-500 font-medium'>Active Job</p>
          <p className='text-2xl font-bold text-slate-800 mt-1'>125</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className='flex flex-col xl:flex-row xl:items-center justify-between gap-4'>
        {/* Tabs */}
        <div className='flex items-center gap-1 overflow-x-auto bg-slate-50 p-1 rounded-xl border border-slate-200'>
          {(["All Jobs", "Ongoing", "Upcoming", "Completed"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab} {tab === "All Jobs" && "(72)"}
                {tab === "Ongoing" && "(25)"}
                {tab === "Upcoming" && "(12)"}
                {tab === "Completed" && "(25)"}
              </button>
            ),
          )}
        </div>

        {/* Search & Filter */}
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
            <input
              type='text'
              placeholder='Search Jobs'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className='pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 w-[240px]'
            />
          </div>
          <div className='relative'>
            <select className='appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 w-[140px] bg-white text-slate-700 font-medium'>
              <option value='All'>All</option>
              <option value='Active'>Active</option>
              <option value='Closed'>Closed</option>
            </select>
            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none' />
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        {paginatedJobs.map((job) => (
          <div
            key={job.id}
            className='bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow'
          >
            <div className='flex items-start gap-3 mb-4'>
              <div className='w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0'>
                <Building2 className='w-6 h-6 text-slate-400' />
              </div>
              <div>
                <h3 className='font-bold text-slate-800 text-base'>
                  {job.hospital}
                </h3>
                <div className='flex items-center gap-2 mt-0.5'>
                  <span className='text-sm font-semibold text-blue-600'>
                    {job.role}
                  </span>
                  <span className='text-sm text-slate-500'>{job.status}</span>
                </div>
              </div>
            </div>

            <div className='space-y-3 mb-5'>
              <div className='flex items-center gap-3 text-sm text-slate-600'>
                <MapPin className='w-4 h-4 text-slate-400 shrink-0' />
                {job.location}
              </div>
              <div className='flex items-center justify-between text-sm text-slate-600'>
                <div className='flex items-center gap-3'>
                  <Users className='w-4 h-4 text-slate-400 shrink-0' />
                  Employees Assigned
                </div>
                <span className='bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold'>
                  {job.employeesAssigned}
                </span>
              </div>
              <div className='flex items-center gap-3 text-sm font-medium text-green-600'>
                <DollarSign className='w-4 h-4 text-green-500 shrink-0' />
                {job.pay}
              </div>
              <div className='flex items-center gap-3 text-sm text-slate-600'>
                <Clock className='w-4 h-4 text-slate-400 shrink-0' />
                {job.shift} • {job.type} &nbsp; {job.date}
              </div>
            </div>

            <div className='flex items-center justify-between pt-4 border-t border-slate-100'>
              <div className='flex items-center gap-2 text-sm font-medium text-blue-500'>
                <Timer className='w-4 h-4' />
                {job.remainingTime}
              </div>
              <Link
                href={`/manage-jobs/${job.id}`}
                className='px-4 py-2 bg-teal-700 text-white text-sm font-medium rounded-lg hover:bg-teal-800 transition-colors'
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
        {paginatedJobs.length === 0 && (
          <div className='col-span-full py-12 text-center text-slate-500'>
            No jobs found matching your criteria.
          </div>
        )}
      </div>

      <div className='flex justify-center mt-6'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
