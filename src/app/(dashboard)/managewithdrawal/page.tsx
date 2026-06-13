/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  DollarSign,
  User,
  CalendarDays,
  BadgeCheck,
  X,
  AlertTriangle,
} from "lucide-react";

import Pagination from "@/components/ui/Pagination";
import {
  useGetWithdrawalRequestsQuery,
  useCreateWithdrawalRequestMutation,
} from "@/redux/features/withdrawalRequest/withdrawalAPI";
import useDebounce from "@/hooks/useDebounce";

// --- Types ---
export interface WithdrawalRequest {
  id: number;
  user_id: number;
  user_email: string;
  amount: string;
  payment_method: string;
  payment_details: {
    card_holder_name?: string;
    card_number?: string;
    card_expiry_date?: string;
    [key: string]: any;
  };
  status: "pending" | "approved" | "rejected";
  is_paid: boolean;
  reference_id: string | null;
  note: string | null;
  requested_at: string;
  updated_at: string;
}

// --- Action Modal ---
interface ActionModalProps {
  selected: number[];
  action: "approved" | "rejected" | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

function ActionModal({
  selected,
  action,
  onClose,
  onConfirm,
  isLoading,
}: ActionModalProps) {
  const [reason, setReason] = useState("");

  if (!action) return null;

  const isApprove = action === "approved";

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isApprove ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isApprove ? (
              <CheckCircle size={20} className='text-green-600' />
            ) : (
              <XCircle size={20} className='text-red-500' />
            )}
          </div>
          <div>
            <h3 className='text-base font-bold text-slate-800'>
              {isApprove ? "Approve" : "Reject"} Requests
            </h3>
            <p className='text-xs text-slate-400'>
              {selected.length} request{selected.length > 1 ? "s" : ""} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className='ml-auto w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors'
          >
            <X size={14} />
          </button>
        </div>

        <div className='mb-4'>
          <label className='block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5'>
            Reason / Note
          </label>
          <textarea
            rows={3}
            placeholder={
              isApprove
                ? "e.g. Withdrawal requests verified and approved."
                : "e.g. Insufficient balance or invalid details."
            }
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className='w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none'
          />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <button
            onClick={onClose}
            className='py-2.5 px-4 rounded-lg border-2 border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors'
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim() || isLoading}
            onClick={() => onConfirm(reason.trim())}
            className={`py-2.5 px-4 rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-50 ${
              isApprove
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Processing…
              </span>
            ) : isApprove ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Payment Details Pill ---
function PaymentDetailCell({ req }: { req: WithdrawalRequest }) {
  const { payment_method, payment_details } = req;
  const last4 = payment_details?.card_number?.slice(-4);
  return (
    <div className='flex items-center gap-1.5'>
      <div className='w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0'>
        <CreditCard size={12} className='text-indigo-500' />
      </div>
      <div>
        <p className='text-xs font-medium text-slate-700 capitalize'>
          {payment_method}
          {last4 ? ` •••• ${last4}` : ""}
        </p>
        {payment_details?.card_holder_name && (
          <p className='text-[10px] text-slate-400'>
            {payment_details.card_holder_name}
          </p>
        )}
      </div>
    </div>
  );
}

// --- Status Badge override for withdrawal statuses ---
function WithdrawalStatusBadge({
  status,
  isPaid,
}: {
  status: string;
  isPaid: boolean;
}) {
  const map: Record<string, { color: string; icon: React.ReactNode }> = {
    pending: {
      color: "bg-amber-50 text-amber-600 border border-amber-200",
      icon: <Clock size={11} />,
    },
    approved: {
      color: "bg-green-50 text-green-600 border border-green-200",
      icon: <BadgeCheck size={11} />,
    },
    rejected: {
      color: "bg-red-50 text-red-500 border border-red-200",
      icon: <XCircle size={11} />,
    },
  };
  const cfg = map[status] || map.pending;
  return (
    <div className='flex flex-col gap-1'>
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${cfg.color}`}
      >
        {cfg.icon}
        {status}
      </span>
      {status === "approved" && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            isPaid
              ? "bg-teal-50 text-teal-600 border border-teal-200"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          <DollarSign size={10} />
          {isPaid ? "Paid" : "Unpaid"}
        </span>
      )}
    </div>
  );
}

// --- Main Page ---
type TabKey = "all" | "pending" | "approved" | "rejected" | "is_paid";
const ITEMS_PER_PAGE = 15;

export default function ManageWithdrawalRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [pendingAction, setPendingAction] = useState<
    "approved" | "rejected" | null
  >(null);
  const [actionLoading, setActionLoading] = useState(false);

  const debounceQuery = useDebounce(searchQuery, 500);
  const [createWithdrawalRequestMutation] =
    useCreateWithdrawalRequestMutation();

  // Build query params based on active tab
  const queryParams: Record<string, any> = {
    page: currentPage,
    page_size: ITEMS_PER_PAGE,
    search: debounceQuery || undefined,
  };
  if (activeTab === "pending") queryParams.status = "pending";
  else if (activeTab === "approved") queryParams.status = "approved";
  else if (activeTab === "rejected") queryParams.status = "rejected";
  else if (activeTab === "is_paid") queryParams.is_paid = true;

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetWithdrawalRequestsQuery(queryParams);

  const allRequests: WithdrawalRequest[] = responseData?.data || [];
  const totalPages = responseData?.meta?.total_pages || 1;

  const TABS: { key: TabKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "is_paid", label: "Paid" },
  ];

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const allSelected =
    allRequests.length > 0 &&
    allRequests.every((r) => selectedIds.includes(r.id));

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? allRequests.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );
  };

  const handleConfirmAction = async (reason: string) => {
    if (!pendingAction || selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      await createWithdrawalRequestMutation({
        withdrawal_request_ids: selectedIds,
        action: pendingAction,
        reason,
      }).unwrap();
      setSelectedIds([]);
      setPendingAction(null);
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const tabStatusColor: Record<TabKey, string> = {
    all: "bg-slate-800 text-white",
    pending: "bg-amber-500 text-white",
    approved: "bg-green-600 text-white",
    rejected: "bg-red-500 text-white",
    is_paid: "bg-teal-600 text-white",
  };

  return (
    <>
      <div className='mt-5 bg-white rounded-xl border border-slate-200 overflow-hidden'>
        {/* Toolbar */}
        <div className='flex flex-col gap-3 px-4 py-3 border-b border-slate-100'>
          {/* Tabs row */}
          <div className='flex items-center gap-1 flex-wrap'>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? tabStatusColor[tab.key]
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + bulk actions row */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
            <div className='relative flex-1 sm:max-w-xs'>
              <Search
                size={14}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
              />
              <input
                type='text'
                placeholder='Search by email or reference'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className='pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 w-full'
              />
            </div>

            {selectedIds.length > 0 && (
              <div className='flex items-center gap-2 sm:ml-auto flex-wrap'>
                <span className='text-xs text-slate-500 font-medium'>
                  {selectedIds.length} selected
                </span>
                <button
                  onClick={() => setPendingAction("approved")}
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors'
                >
                  <CheckCircle size={13} />
                  Approve
                </button>
                <button
                  onClick={() => setPendingAction("rejected")}
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors'
                >
                  <XCircle size={13} />
                  Reject
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className='flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors'
                >
                  <X size={12} />
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-175'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50'>
                <th className='w-10 pl-4 py-3'>
                  <input
                    type='checkbox'
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className='rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer'
                  />
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  #
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  User
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Amount
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Payment
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Status
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Requested At
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Note
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {(isLoading || isFetching) && (
                <tr>
                  <td colSpan={8} className='text-center py-12'>
                    <div className='flex items-center justify-center gap-2 text-slate-400 text-sm'>
                      <div className='w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin' />
                      Loading requests…
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isFetching &&
                allRequests.map((req, index) => {
                  const isSelected = selectedIds.includes(req.id);
                  return (
                    <tr
                      key={req.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isSelected ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <td className='pl-4 py-3'>
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectOne(req.id, e.target.checked)
                          }
                          className='rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer'
                        />
                      </td>
                      <td className='px-3 py-3 text-sm text-slate-500'>
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}.
                      </td>
                      <td className='px-3 py-3'>
                        <div className='flex items-center gap-2'>
                          <div className='w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 text-xs'>
                            <User size={13} />
                          </div>
                          <div className='min-w-0'>
                            <p className='text-xs font-medium text-slate-800 truncate max-w-40'>
                              {req.user_email}
                            </p>
                            <p className='text-[10px] text-slate-400'>
                              UID: {req.user_id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-3 py-3'>
                        <span className='inline-flex items-center gap-1 text-sm font-bold text-slate-800'>
                          <DollarSign size={13} className='text-teal-500' />
                          {parseFloat(req.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className='px-3 py-3'>
                        <PaymentDetailCell req={req} />
                      </td>
                      <td className='px-3 py-3'>
                        <WithdrawalStatusBadge
                          status={req.status}
                          isPaid={req.is_paid}
                        />
                      </td>
                      <td className='px-3 py-3'>
                        <div className='flex items-center gap-1.5'>
                          <CalendarDays
                            size={12}
                            className='text-slate-400 shrink-0'
                          />
                          <span className='text-xs text-slate-600'>
                            {new Date(req.requested_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <p className='text-[10px] text-slate-400 mt-0.5 pl-4.5'>
                          {new Date(req.requested_at).toLocaleTimeString(
                            undefined,
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </td>
                      <td className='px-3 py-3 max-w-50'>
                        {req.note ? (
                          <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed'>
                            {req.note}
                          </p>
                        ) : (
                          <span className='text-xs text-slate-300 italic'>
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

              {!isLoading && !isFetching && allRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className='text-center py-12 text-slate-400 text-sm'
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <AlertTriangle size={24} className='text-slate-300' />
                      No withdrawal requests found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='border-t border-slate-100'>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Action Modal */}
      <ActionModal
        selected={selectedIds}
        action={pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirmAction}
        isLoading={actionLoading}
      />
    </>
  );
}
