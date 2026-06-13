/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  useGetSingleJobQuery,
  useUpdateJobMutation,
} from "@/redux/features/jobs/jobsAPI";
import {
  MapPin,
  Users,
  DollarSign,
  Clock,
  Timer,
  Building2,
  FileText,
  Lightbulb,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function JobDetailsPage() {
  const id = useParams().id as string;
  const { data: response, isLoading } = useGetSingleJobQuery(id);
  const job = response?.data;

  const [tips, setTips] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [updateJobMutation] = useUpdateJobMutation();

  useEffect(() => {
    if (job?.tips) setTips(job.tips);
  }, [job]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateJobMutation({ jobId: id, updatedData: { tips } });
      toast.success("Job updated successfully");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='py-20 text-center text-slate-500 text-sm'>
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className='py-20 text-center text-slate-500 text-sm'>
        Job not found.
      </div>
    );
  }

  const formattedDate = new Date(job.date_time).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const status = job.is_completed ? "Completed" : "Ongoing";

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {/* Left Column */}
      <div className='lg:col-span-2 space-y-6'>
        {/* Job Summary Card */}
        <div className='bg-white rounded-xl border border-slate-200 p-6'>
          <div className='flexflex-col items-start gap-4 mb-6 pb-5 border-b border-slate-100'>
            <div className='flex items-start gap-4 mb-2'>
              <div className='w-13 h-13 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 overflow-hidden'>
                {job.creator.image ? (
                  <Image
                    src={job.creator.image}
                    alt={job.creator.full_name}
                    width={52}
                    height={52}
                    className='w-full h-full object-cover'
                    unoptimized
                  />
                ) : (
                  <Building2 className='w-6 h-6 text-slate-400' />
                )}
              </div>
              <div>
                <h2 className='text-lg font-bold text-slate-800'>
                  {job.creator.full_name}
                </h2>
                <div className='flex items-center gap-2 mt-1.5'>
                  <span className='text-sm font-semibold text-blue-600'>
                    {job.role_type.title}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      job.is_completed
                        ? "bg-slate-100 text-slate-500"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span className='font-semibold'>Email:</span>{" "}
              {job?.creator?.email}
            </div>
          </div>

          <div className='space-y-3.5'>
            <div className='flex items-center gap-3 text-sm text-slate-600'>
              <MapPin className='w-4 h-4 text-slate-400 shrink-0' />
              {job.location}
            </div>

            <div className='flex items-center justify-between text-sm text-slate-600'>
              <div className='flex items-center gap-3'>
                <Users className='w-4 h-4 text-slate-400 shrink-0' />
                Vacancy
              </div>
              <span className='bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md text-xs font-bold'>
                {job.vacancy}
              </span>
            </div>

            <div className='flex items-center gap-3 text-sm font-bold text-green-600'>
              <DollarSign className='w-4 h-4 text-green-500 shrink-0' />$
              {job.salary} / shift
            </div>

            <div className='flex items-center gap-3 text-sm text-slate-600 capitalize'>
              <Clock className='w-4 h-4 text-slate-400 shrink-0' />
              {job.shift} &nbsp;•&nbsp; {formattedDate}
            </div>
          </div>

          {job.job_title && (
            <div className='mt-5 pt-4 border-t border-slate-100'>
              <div className='flex items-center gap-2 text-sm font-semibold text-blue-500'>
                <Timer className='w-4 h-4' />
                {job.job_title}
              </div>
            </div>
          )}
        </div>

        {/* Job Description Card */}
        {(job.job_description ||
          job.responsibilitie ||
          job.role_type.mandatory_docs.length > 0) && (
          <div className='bg-white rounded-xl border border-slate-200 p-6'>
            <div className='flex items-center gap-3 mb-5'>
              <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center'>
                <FileText className='w-4 h-4 text-blue-500' />
              </div>
              <h3 className='font-bold text-slate-800 text-base'>
                Job Description
              </h3>
            </div>

            {job.job_description && (
              <p className='text-sm text-slate-600 leading-relaxed'>
                {job.job_description}
              </p>
            )}

            {job.responsibilitie && (
              <div className='mt-4'>
                <h4 className='font-semibold text-slate-700 text-sm mb-2'>
                  Responsibilities
                </h4>
                <p className='text-sm text-slate-600 leading-relaxed'>
                  {job.responsibilitie}
                </p>
              </div>
            )}

            {job.role_type.mandatory_docs.length > 0 && (
              <div className='mt-5 pt-4 border-t border-slate-100'>
                <h4 className='font-semibold text-slate-700 text-sm mb-3'>
                  Mandatory Documents
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {job.role_type.mandatory_docs.map(
                    (doc: { id: number; title: string }) => (
                      <span
                        key={doc.id}
                        className='text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium'
                      >
                        {doc.title}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className='space-y-5'>
        {/* Tips Card */}
        <div className='bg-white rounded-xl border border-slate-200 p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center'>
              <Lightbulb className='w-4 h-4 text-slate-500' />
            </div>
            <h3 className='font-bold text-slate-800 text-base'>Tips</h3>
          </div>
          <textarea
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder='Add tips for this job...'
            rows={5}
            className='w-full p-3.5 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed bg-slate-50/50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors'
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || !tips || !job.id || job?.tips === tips}
          className='w-full py-3 bg-teal-700 text-white font-semibold rounded-xl hover:bg-teal-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed text-sm'
        >
          {isSaving ? "Saving..." : "Save Now"}
        </button>
      </div>
    </div>
  );
}
