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
          disabled={isSaving}
          className='w-full py-3 bg-teal-700 text-white font-semibold rounded-xl hover:bg-teal-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed text-sm'
        >
          {isSaving ? "Saving..." : "Save Now"}
        </button>
      </div>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/set-state-in-effect */
// "use client";

// import { useState, useEffect } from "react";
// import {
//   useGetSingleJobQuery,
//   useUpdateJobMutation, // replace with your actual mutation hook
// } from "@/redux/features/jobs/jobsAPI";
// import {
//   MapPin,
//   Users,
//   DollarSign,
//   Clock,
//   Timer,
//   Building2,
//   Star,
//   X,
//   MessageSquare,
//   Phone,
//   FileText,
//   Lightbulb,
//   ChevronUp,
// } from "lucide-react";
// import Image from "next/image";
// import { useParams } from "next/navigation";

// export default function JobDetailsPage() {
//   const id = useParams().id as string;
//   const { data: response, isLoading } = useGetSingleJobQuery(id);
//   const job = response?.data;

//   const [tips, setTips] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   // Replace with your actual RTK mutation
//   const [updateJobMutation] = useUpdateJobMutation();

//   useEffect(() => {
//     if (job?.tips) setTips(job.tips);
//   }, [job]);

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       await updateJobMutation({ jobId: id, updatedData: { tips } });
//       console.log("Save tips:", tips);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className='py-20 text-center text-slate-500 text-sm'>
//         Loading job details...
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className='py-20 text-center text-slate-500 text-sm'>
//         Job not found.
//       </div>
//     );
//   }

//   const formattedDate = new Date(job.date_time).toLocaleDateString("en-US", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   const status = job.is_completed ? "Completed" : "Ongoing";

//   return (
//     <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
//       {/* Left Column */}
//       <div className='lg:col-span-2 space-y-6'>
//         {/* Job Summary Card */}
//         <div className='bg-white rounded-xl border border-slate-200 p-6'>
//           <div className='flex items-start gap-4 mb-6'>
//             <div className='w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 overflow-hidden'>
//               {job.creator.image ? (
//                 <Image
//                   src={job.creator.image}
//                   alt={job.creator.full_name}
//                   width={56}
//                   height={56}
//                   className='w-full h-full object-cover'
//                   unoptimized
//                 />
//               ) : (
//                 <Building2 className='w-7 h-7 text-slate-400' />
//               )}
//             </div>
//             <div>
//               <h2 className='text-xl font-bold text-slate-800'>
//                 {job.creator.full_name}
//               </h2>
//               <div className='flex items-center gap-2 mt-1'>
//                 <span className='text-sm font-semibold text-blue-600'>
//                   {job.role_type.title}
//                 </span>
//                 <span
//                   className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//                     job.is_completed
//                       ? "bg-slate-100 text-slate-500"
//                       : "bg-green-50 text-green-600"
//                   }`}
//                 >
//                   {status}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className='space-y-4'>
//             <div className='flex items-center gap-3 text-sm text-slate-600'>
//               <MapPin className='w-5 h-5 text-slate-400 shrink-0' />
//               {job.location}
//             </div>
//             <div className='flex items-center justify-between text-sm text-slate-600'>
//               <div className='flex items-center gap-3'>
//                 <Users className='w-5 h-5 text-slate-400 shrink-0' />
//                 Vacancy
//               </div>
//               <span className='bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-bold'>
//                 {job.vacancy}
//               </span>
//             </div>
//             <div className='flex items-center gap-3 text-sm font-bold text-green-600'>
//               <DollarSign className='w-5 h-5 text-green-500 shrink-0' />$
//               {job.salary} / shift
//             </div>
//             <div className='flex items-center gap-3 text-sm text-slate-600'>
//               <Clock className='w-5 h-5 text-slate-400 shrink-0' />
//               {job.shift} &nbsp;•&nbsp; {formattedDate}
//             </div>
//           </div>

//           <div className='mt-6 pt-5 border-t border-slate-100'>
//             <div className='flex items-center gap-2 text-sm font-semibold text-blue-500'>
//               <Timer className='w-5 h-5' />
//               {job.job_title}
//             </div>
//           </div>
//         </div>

//         {/* Job Description Card */}
//         <div className='bg-white rounded-xl border border-slate-200 p-6'>
//           <div className='flex items-center gap-3 mb-4'>
//             <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center'>
//               <FileText className='w-4 h-4 text-blue-500' />
//             </div>
//             <h3 className='font-bold text-slate-800 text-lg'>
//               Job Description
//             </h3>
//           </div>
//           <p className='text-sm text-slate-600 leading-relaxed mb-4'>
//             {job.job_description}
//           </p>
//           {job.responsibilitie && (
//             <>
//               <h4 className='font-semibold text-slate-700 text-sm mb-2'>
//                 Responsibilities
//               </h4>
//               <p className='text-sm text-slate-600 leading-relaxed'>
//                 {job.responsibilitie}
//               </p>
//             </>
//           )}
//           {job.role_type.mandatory_docs.length > 0 && (
//             <div className='mt-4 pt-4 border-t border-slate-100'>
//               <h4 className='font-semibold text-slate-700 text-sm mb-2'>
//                 Mandatory Documents
//               </h4>
//               <div className='flex flex-wrap gap-2'>
//                 {job.role_type.mandatory_docs.map((doc: any) => (
//                   <span
//                     key={doc.id}
//                     className='text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full'
//                   >
//                     {doc.title}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Reviews Card — static until API provides data */}
//         <div className='bg-white rounded-xl border border-slate-200 p-6'>
//           <div className='flex items-center justify-between mb-6'>
//             <div className='flex items-center gap-3'>
//               <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center'>
//                 <MessageSquare className='w-4 h-4 text-blue-500' />
//               </div>
//               <h3 className='font-bold text-slate-800 text-lg'>Review</h3>
//               <div className='flex items-center gap-1.5 ml-2'>
//                 <div className='flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md'>
//                   <Star className='w-3.5 h-3.5 fill-yellow-500 text-yellow-500' />
//                   <span className='text-xs font-bold text-yellow-700'>4.8</span>
//                 </div>
//                 <span className='text-xs text-slate-500'>2 Reviews</span>
//               </div>
//             </div>
//             <button className='text-slate-400 hover:text-slate-600 transition-colors'>
//               <ChevronUp size={20} />
//             </button>
//           </div>

//           <div className='space-y-5'>
//             {[1, 2].map((i) => (
//               <div key={i} className='flex gap-4'>
//                 <Image
//                   src={`https://i.pravatar.cc/40?img=${i + 10}`}
//                   alt='Reviewer'
//                   width={40}
//                   height={40}
//                   className='rounded-full w-10 h-10 object-cover border border-slate-100 shrink-0'
//                   unoptimized
//                 />
//                 <div className='flex-1'>
//                   <div className='flex items-center justify-between'>
//                     <div>
//                       <h4 className='font-semibold text-sm text-slate-800'>
//                         Mr. John
//                       </h4>
//                       <p className='text-sm text-slate-500 mt-0.5'>
//                         Great Experience
//                       </p>
//                     </div>
//                     <div className='flex gap-1'>
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <Star
//                           key={star}
//                           className={`w-4 h-4 ${
//                             star === 5
//                               ? "fill-slate-200 text-slate-200"
//                               : "fill-yellow-400 text-yellow-400"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right Column */}
//       <div className='space-y-6'>
//         {/* Employees List Card — static until API provides data */}
//         <div className='bg-white rounded-xl border border-slate-200 p-6'>
//           <div className='flex items-center gap-3 mb-6'>
//             <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center'>
//               <Users className='w-4 h-4 text-blue-500' />
//             </div>
//             <h3 className='font-bold text-slate-800 text-lg'>
//               Employees List (2)
//             </h3>
//           </div>

//           <div className='space-y-4'>
//             {[1, 2].map((i) => (
//               <div
//                 key={i}
//                 className='flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0'
//               >
//                 <div className='flex items-center gap-3'>
//                   <Image
//                     src={`https://i.pravatar.cc/40?img=${i + 20}`}
//                     alt='Employee'
//                     width={36}
//                     height={36}
//                     className='rounded-full w-9 h-9 object-cover border border-slate-100 shrink-0'
//                     unoptimized
//                   />
//                   <div>
//                     <h4 className='font-semibold text-sm text-slate-800'>
//                       Mr. Rahan
//                     </h4>
//                     <p className='text-xs font-semibold text-blue-600 mt-0.5'>
//                       CNA
//                     </p>
//                   </div>
//                 </div>
//                 <div className='flex items-center gap-2'>
//                   <button className='w-7 h-7 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center hover:bg-orange-100 transition-colors'>
//                     <X size={14} />
//                   </button>
//                   <button className='w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors'>
//                     <MessageSquare size={14} />
//                   </button>
//                   <button className='w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors'>
//                     <Phone size={14} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tips Card — editable */}
//         <div className='bg-white rounded-xl border border-slate-200 p-6'>
//           <div className='flex items-center gap-3 mb-4'>
//             <div className='w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center'>
//               <Lightbulb className='w-4 h-4 text-slate-500' />
//             </div>
//             <h3 className='font-bold text-slate-800 text-lg'>Tips</h3>
//           </div>
//           <textarea
//             value={tips}
//             onChange={(e) => setTips(e.target.value)}
//             placeholder='Add tips for this job...'
//             rows={4}
//             className='w-full p-4 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed bg-slate-50/50 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors'
//           />
//         </div>

//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className='w-full py-3 bg-teal-700 text-white font-semibold rounded-xl hover:bg-teal-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed'
//         >
//           {isSaving ? "Saving..." : "Save Now"}
//         </button>
//       </div>
//     </div>
//   );
// }
