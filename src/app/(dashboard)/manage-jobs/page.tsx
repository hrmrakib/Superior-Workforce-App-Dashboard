/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Search,
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
import { useGetJobsQuery } from "@/redux/features/jobs/jobsAPI";
import Image from "next/image";
import useDebounce from "@/hooks/useDebounce";

type JobStatus = "Ongoing" | "Completed";
type TabOption = JobStatus | "All Jobs";

const ITEMS_PER_PAGE = 6;

function getIsCompletedParam(tab: TabOption): boolean | undefined {
  if (tab === "Completed") return true;
  if (tab === "Ongoing") return false;
  return undefined; // "All Jobs"  — no filter
}

export default function ManageJobsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabOption>("All Jobs");
  const [currentPage, setCurrentPage] = useState(1);
  const debounceSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetJobsQuery({
    page: currentPage,
    page_size: ITEMS_PER_PAGE,
    search: debounceSearch,
    ...(getIsCompletedParam(activeTab) !== undefined && {
      is_completed: getIsCompletedParam(activeTab),
    }),
  });

  const jobs = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;

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
        <div className='flex items-center gap-1 overflow-x-auto bg-slate-50 p-1 rounded-xl border border-slate-200'>
          {(["All Jobs", "Ongoing", "Completed"] as const).map((tab) => (
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
              {tab}
            </button>
          ))}
        </div>

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
              className='pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 w-60'
            />
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        {isLoading ? (
          <div className='col-span-full py-12 text-center text-slate-500'>
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className='col-span-full py-12 text-center text-slate-500'>
            No jobs found matching your criteria.
          </div>
        ) : (
          jobs.map((job: any) => (
            <div
              key={job.id}
              className='bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow'
            >
              <div className='flex items-start gap-3 mb-4'>
                <div className='w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0'>
                  {job.creator.image ? (
                    <Image
                      src={job.creator.image}
                      alt={job.creator.full_name}
                      className='w-full h-full rounded-lg object-cover'
                      width={48}
                      height={48}
                      priority
                      unoptimized
                    />
                  ) : (
                    <Building2 className='w-6 h-6 text-slate-400' />
                  )}
                </div>
                <div>
                  <h3 className='font-bold text-slate-800 text-base'>
                    {job.creator.full_name}
                  </h3>
                  <div className='flex items-center gap-2 mt-0.5'>
                    <span className='text-sm font-semibold text-blue-600'>
                      {job.role_type.title}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        job.is_completed
                          ? "bg-slate-100 text-slate-500"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {job.is_completed ? "Completed" : "Ongoing"}
                    </span>
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
                    Vacancy
                  </div>
                  <span className='bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold'>
                    {job.vacancy}
                  </span>
                </div>
                <div className='flex items-center gap-3 text-sm font-medium text-green-600'>
                  <DollarSign className='w-4 h-4 text-green-500 shrink-0' />$
                  {job.salary} / shift
                </div>
                <div className='flex items-center gap-3 text-sm text-slate-600'>
                  <Clock className='w-4 h-4 text-slate-400 shrink-0' />
                  {job.shift} &nbsp;•&nbsp;{" "}
                  {new Date(job.date_time).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className='flex items-center justify-between pt-4 border-t border-slate-100'>
                <div className='flex items-center gap-2 text-sm font-medium text-blue-500'>
                  <Timer className='w-4 h-4' />
                  {job.job_title}
                </div>
                <Link
                  href={`/manage-jobs/${job.id}`}
                  className='px-4 py-2 bg-teal-700 text-white text-sm font-medium rounded-lg hover:bg-teal-800 transition-colors'
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
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
