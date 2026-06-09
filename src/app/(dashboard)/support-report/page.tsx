"use client";

import { useState } from "react";
import {
  useGetReportQuery,
  useUpdateReportStatusMutation,
} from "@/redux/features/report/reportAPI";
import {
  Reply,
  Clock,
  Download,
  Check,
  Ban,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";

// Define the interface based on your new API response
interface Document {
  id: number;
  document: string;
  created_at: string;
  updated_at: string;
}

interface SupportReport {
  id: number;
  user_id: number;
  title: string;
  discription: string; // Using API's exact spelling
  status: string;
  documents: Document[];
  created_at: string;
  updated_at: string;
}

export default function SupportPage() {
  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    reportId: number | null;
    status: string | null;
  }>({
    isOpen: false,
    reportId: null,
    status: null,
  });

  // Fetching Data
  const { data: reportsData, isLoading } = useGetReportQuery(undefined);
  const reports: SupportReport[] = reportsData?.data || [];
  const totalItems = reportsData?.meta?.total_items || 0;

  // Mutation for updating status
  const [updateReportStatusMutation, { isLoading: isUpdating }] =
    useUpdateReportStatusMutation();

  const handleOpenModal = (reportId: number, newStatus: string) => {
    setModalConfig({ isOpen: true, reportId, status: newStatus });
  };

  const handleCloseModal = () => {
    setModalConfig({ isOpen: false, reportId: null, status: null });
  };

  const confirmStatusUpdate = async () => {
    if (modalConfig.reportId === null || modalConfig.status === null) return;

    console.log(modalConfig.reportId, modalConfig.status);

    try {
      await updateReportStatusMutation({
        reportId: modalConfig.reportId,
        status: modalConfig.status,
      }).unwrap();
      // Close modal on success
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-10'>
        <span className='text-slate-500 font-medium'>Loading reports...</span>
      </div>
    );
  }

  return (
    <div className='space-y-6 relative'>
      {/* Header Stats */}
      <div className='inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm'>
        <span className='text-sm font-medium text-slate-500'>
          Total Support Requests
        </span>
        <span className='text-xl font-bold text-slate-800'>{totalItems}</span>
      </div>

      {/* Reports Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {reports.map((report) => (
          <div
            key={report.id}
            className='bg-white flex flex-col rounded-xl border border-slate-200 p-5 relative group transition-shadow hover:shadow-md'
          >
            <div className='flex items-start gap-3 mb-4'>
              {/* Fallback avatar using user_id */}
              <Image
                src={`https://i.pravatar.cc/40?img=${report.user_id}`}
                alt={`User ${report.user_id}`}
                width={40}
                height={40}
                className='rounded-full w-10 h-10 object-cover border border-slate-100'
                unoptimized
              />
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap flex-1'>
                <span className='px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-md'>
                  User #{report.user_id}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                    report.status === "Resolved"
                      ? "bg-emerald-100 text-emerald-700"
                      : report.status === "Rejected"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {report.status}
                </span>
                <button className='ml-auto text-slate-400 hover:text-blue-500 transition-colors'>
                  <Reply size={16} />
                </button>
              </div>
            </div>

            <h3 className='text-base font-bold text-slate-800 mb-2'>
              {report.title}
            </h3>
            <p className='text-sm text-slate-600 leading-relaxed mb-4 flex-1'>
              {report.discription}
            </p>

            {/* Documents Mapping */}
            {report.documents && report.documents.length > 0 && (
              <div className='mb-4 flex flex-wrap gap-3'>
                {report.documents.map((doc) => {
                  const fileName = doc.document.split("/").pop() || "Download";
                  return (
                    <a
                      key={doc.id}
                      href={doc.document}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex flex-col items-center justify-center gap-1 w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors p-2'
                    >
                      <Download size={20} className='text-slate-400' />
                      <span className='text-[10px] text-slate-500 font-medium truncate w-full text-center'>
                        {fileName}
                      </span>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Footer / Actions */}
            <div className='flex items-center justify-between mt-4 pt-4 border-t border-slate-100'>
              <div className='flex items-center gap-2 text-xs font-medium text-slate-500'>
                <Clock className='w-3.5 h-3.5' />
                {new Date(report.created_at).toLocaleString()}
              </div>

              {/* Status Update Trigger Buttons */}
              <div className='flex items-center gap-2'>
                {report.status !== "Resolved" && (
                  <button
                    onClick={() => handleOpenModal(report.id, "Resolved")}
                    className='flex items-center gap-1 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold rounded-md transition-colors'
                  >
                    <Check size={14} />
                    Approve
                  </button>
                )}
                {report.status !== "Rejected" && (
                  <button
                    onClick={() => handleOpenModal(report.id, "Rejected")}
                    className='flex items-center gap-1 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-md transition-colors'
                  >
                    <Ban size={14} />
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {reports.length > totalItems && (
        <div className='flex justify-center mt-8'>
          <button className='px-6 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm'>
            LOAD MORE
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalConfig.isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity'>
          <div className='bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200'>
            <div className='flex items-center gap-3 mb-4'>
              <div
                className={`p-2 rounded-full ${modalConfig.status === "Resolved" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
              >
                <AlertTriangle size={24} />
              </div>
              <h3 className='text-lg font-bold text-slate-800'>
                Confirm Action
              </h3>
            </div>

            <p className='text-slate-600 text-sm mb-6 leading-relaxed'>
              Are you sure you want to mark this report as{" "}
              <strong
                className={
                  modalConfig.status === "Resolved"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }
              >
                {modalConfig.status}
              </strong>
              ? This action will notify the user and update the system records.
            </p>

            <div className='flex items-center justify-end gap-3'>
              <button
                onClick={handleCloseModal}
                disabled={isUpdating}
                className='px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                disabled={isUpdating}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  modalConfig.status === "Resolved"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {isUpdating ? (
                  "Updating..."
                ) : (
                  <>
                    {modalConfig.status === "Resolved" ? (
                      <Check size={16} />
                    ) : (
                      <Ban size={16} />
                    )}
                    Confirm{" "}
                    {modalConfig.status === "Resolved"
                      ? "Approval"
                      : "Rejection"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
