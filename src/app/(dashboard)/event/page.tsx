"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetEventsQuery,
  useDeleteEventMutation, // Assuming you have this set up in your API slice
} from "@/redux/features/event/eventAPI";
import {
  Edit,
  Trash2,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Define the shape of your actual API data
interface EventData {
  id: number;
  title: string;
  event_date: string;
  discription: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export default function EventPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  // Fetch API data (passing page parameter for pagination)
  const { data, isLoading, isFetching } = useGetEventsQuery({
    page: currentPage,
  });
  const [deleteEventMutation, { isLoading: isDeleting }] =
    useDeleteEventMutation();

  const events: EventData[] = data?.data || [];
  const meta = data?.meta;

  // Handlers
  const handleDeleteClick = (id: number) => {
    setEventToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEventMutation(eventToDelete).unwrap();
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete the event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const handleNextPage = () => {
    if (meta?.next) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (meta?.previous || currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='space-y-6 relative'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-slate-800 lg:hidden'>Event</h1>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm'>
          <span className='text-sm font-medium text-slate-500'>Total</span>
          <span className='text-xl font-bold text-slate-800'>
            {meta?.total_items || 0}
          </span>
        </div>

        <Link
          href='/event/create'
          className='px-5 py-2.5 bg-teal-700 text-white text-sm font-semibold rounded-lg hover:bg-teal-800 transition-colors shadow-sm'
        >
          CREATE EVENT
        </Link>
      </div>

      {isLoading || isFetching ? (
        <div className='py-10 text-center text-slate-500 font-medium'>
          Loading events...
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {events.map((ev) => (
              <div
                key={ev.id}
                className='bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col'
              >
                <div className='flex justify-between items-start mb-1.5'>
                  <h3 className='text-[15px] font-bold text-orange-500'>
                    {ev.title}
                  </h3>

                  {/* Action Icons */}
                  <div className='flex items-center gap-2'>
                    <Link
                      href={`/event/edit/${ev.id}`}
                      className='p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors'
                      title='Edit Event'
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(ev.id)}
                      className='p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors'
                      title='Delete Event'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className='text-sm font-semibold text-blue-500 mb-4'>
                  Date: {formatDate(ev.event_date)}
                </p>

                {/* Using the real description from the API */}
                <p className='text-sm text-slate-500 flex-grow'>
                  {ev.discription}
                </p>
              </div>
            ))}

            {events.length === 0 && (
              <div className='col-span-full py-10 text-center text-slate-500 font-medium bg-white rounded-xl border border-slate-200'>
                No events found.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {meta && meta.total_pages > 1 && (
            <div className='flex items-center justify-between bg-white border border-slate-200 px-4 py-3 sm:px-6 rounded-xl mt-6'>
              <div className='flex flex-1 justify-between sm:hidden'>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className='relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50'
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === meta.total_pages}
                  className='relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50'
                >
                  Next
                </button>
              </div>

              <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
                <div>
                  <p className='text-sm text-slate-700'>
                    Showing page{" "}
                    <span className='font-semibold'>{meta.current_page}</span>{" "}
                    of <span className='font-semibold'>{meta.total_pages}</span>
                  </p>
                </div>
                <div>
                  <nav
                    className='isolate inline-flex -space-x-px rounded-md shadow-sm'
                    aria-label='Pagination'
                  >
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className='relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <span className='sr-only'>Previous</span>
                      <ChevronLeft className='h-5 w-5' aria-hidden='true' />
                    </button>
                    <span className='relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-offset-0'>
                      {currentPage}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === meta.total_pages}
                      className='relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <span className='sr-only'>Next</span>
                      <ChevronRight className='h-5 w-5' aria-hidden='true' />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Warning Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200'>
            <button
              onClick={closeDeleteModal}
              className='absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors'
            >
              <X size={20} />
            </button>

            <div className='flex flex-col items-center text-center mt-2'>
              <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4'>
                <AlertTriangle className='w-6 h-6 text-red-600' />
              </div>
              <h3 className='text-lg font-bold text-slate-900 mb-2'>
                Delete Event
              </h3>
              <p className='text-sm text-slate-500 mb-6'>
                Are you sure you want to delete this event? This action cannot
                be undone and will remove the event permanently.
              </p>

              <div className='flex gap-3 w-full'>
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className='flex-1 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className='flex-1 py-2.5 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2'
                >
                  {isDeleting ? "Deleting..." : "Delete Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useGetEventsQuery } from "@/redux/features/event/eventAPI";
// import Link from "next/link";

// interface EventItem {
//   id: string;
//   title: string;
//   date: string;
//   features: string[];
// }

// const mockEvents: EventItem[] = Array.from({ length: 6 }, (_, i) => ({
//   id: `EV${i + 1}`,
//   title: "Employee Appreciation Week 2026",
//   date: "Date: May 15-21, 2026",
//   features: [
//     "Special rewards for top performers",
//     "Announcement of raffle draw winners",
//     "Free training sessions for skill development",
//     "Fun games and engagement activities",
//   ],
// }));

// export default function EventPage() {
//   const { data } = useGetEventsQuery(undefined);

//   return (
//     <div className='space-y-6'>
//       <div className='flex items-center justify-between'>
//         <h1 className='text-2xl font-bold text-slate-800 lg:hidden'>Event</h1>
//       </div>

//       <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
//         <div className='inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm'>
//           <span className='text-sm font-medium text-slate-500'>Total</span>
//           <span className='text-xl font-bold text-slate-800'>10</span>
//         </div>

//         <Link
//           href='/event/create'
//           className='px-5 py-2.5 bg-teal-700 text-white text-sm font-semibold rounded-lg hover:bg-teal-800 transition-colors shadow-sm'
//         >
//           CREATE EVENT
//         </Link>
//       </div>

//       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
//         {mockEvents.map((ev) => (
//           <div
//             key={ev.id}
//             className='bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow'
//           >
//             <h3 className='text-[15px] font-bold text-orange-500 mb-1.5'>
//               {ev.title}
//             </h3>
//             <p className='text-sm font-semibold text-blue-500 mb-4'>
//               {ev.date}
//             </p>

//             <ul className='space-y-1.5'>
//               {ev.features.map((feature, idx) => (
//                 <li
//                   key={idx}
//                   className='flex items-start gap-1.5 text-xs font-medium text-slate-500'
//                 >
//                   <span className='text-slate-400 shrink-0 mt-0.5'>&gt;</span>
//                   <span>{feature}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
