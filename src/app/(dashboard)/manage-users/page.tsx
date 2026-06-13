/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  Eye,
  Trash2,
  X,
  Star,
  Shield,
  MapPin,
  Mail,
  Phone,
  Download,
  FileText,
} from "lucide-react";

import StatsCards from "@/components/dashboard/StatsCards";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { statsData } from "@/data/mockData";
import {
  useGetAllUsersQuery,
  useLazyGetSingleUserQuery,
} from "@/redux/features/user/userAPI";
import useDebounce from "@/hooks/useDebounce";

// --- Types ---
export interface UserListItem {
  id: number;
  email: string;
  full_name: string;
  user_type: string;
  is_active: boolean;
  is_admin_approved: boolean;
  status: boolean;
  is_email_verified: boolean;
  created_at: string;
  profile_score: number | null;
  documents_count: number;
  educations_count: number;
}

export interface UserDetail {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  image: string;
  user_type: string;
  is_active: boolean;
  is_admin_approved: boolean;
  status: boolean;
  is_email_verified: boolean;
  location: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  profile: {
    professional_role: { id: number; title: string };
    years_of_experience: number;
    skills: string;
    certifications: string;
    bio: string;
    profile_score: number;
    documents: any[];
  };
  documents: any[];
  educations: any[];
}

// --- User Detail Modal Component ---
interface UserDetailModalProps {
  user: UserDetail | null;
  onClose: () => void;
}

function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  useEffect(() => {
    if (user) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [user]);

  if (!user) return null;

  const leftDocs = user.documents?.filter((_, i) => i % 2 === 0) || [];
  const rightDocs = user.documents?.filter((_, i) => i % 2 !== 0) || [];
  const skillsList =
    user.profile?.skills?.split(",").map((s) => s.trim()) || [];
  const certsList =
    user.profile?.certifications?.split(",").map((s) => s.trim()) || [];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10'>
        {/* Header */}
        <div className='flex items-start gap-4 p-5 pb-4 border-b border-slate-100'>
          <div className='w-16 h-16 rounded-full bg-slate-100 overflow-hidden ring-2 ring-slate-200 shrink-0'>
            {user.image && (
              <Image
                src={user.image}
                alt={user.full_name}
                width={64}
                height={64}
                className='w-full h-full object-cover'
                unoptimized
              />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <h2 className='text-lg font-bold text-slate-800'>
                {user.full_name}
              </h2>
              <div className='flex items-center gap-1 text-amber-400'>
                <Star size={14} fill='currentColor' />
                <span className='text-sm font-semibold text-amber-500'>
                  {user.profile?.profile_score || 0}
                </span>
              </div>
            </div>
            <div className='flex items-center gap-1.5 mt-1'>
              <Shield size={13} className='text-slate-400' />
              <span className='text-sm text-slate-500 capitalize'>
                {user.user_type}
              </span>
            </div>
            {user.location && (
              <div className='flex items-center gap-1.5 mt-0.5'>
                <MapPin size={13} className='text-slate-400' />
                <span className='text-sm text-slate-500'>{user.location}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors shrink-0'
          >
            <X size={14} />
          </button>
        </div>

        <div className='p-5 space-y-5'>
          {/* Contact Info Row */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            <div className='flex items-center gap-2 sm:col-span-2'>
              <div className='w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0'>
                <Mail size={13} className='text-blue-500' />
              </div>
              <div className='min-w-0'>
                <p className='text-[10px] text-slate-400 font-medium'>Email</p>
                <p
                  className='text-xs text-slate-700 font-medium truncate'
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2 sm:col-span-2'>
              <div className='w-7 h-7 rounded-full bg-green-50 flex items-center justify-center shrink-0'>
                <Phone size={13} className='text-green-500' />
              </div>
              <div>
                <p className='text-[10px] text-slate-400 font-medium'>Phone</p>
                <p className='text-xs text-slate-700 font-medium'>
                  {user.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Experience / Bio */}
          {user.profile && (
            <div className='bg-blue-50 rounded-lg px-4 py-3 border border-blue-100'>
              <p className='text-sm font-semibold text-blue-700 flex items-center gap-1.5'>
                <span className='text-blue-400'>•</span>
                {user.profile.professional_role?.title} (
                {user.profile.years_of_experience} Years Exp.)
              </p>
              <p className='text-xs text-slate-500 mt-1 leading-relaxed'>
                {user.profile.bio}
              </p>
            </div>
          )}

          {/* Documents */}
          {user.documents && user.documents.length > 0 && (
            <div>
              <h4 className='text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5'>
                Documents
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div className='space-y-2'>
                  {leftDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className='flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-slate-50'
                    >
                      <span className='text-xs text-slate-600 leading-snug pr-2 truncate'>
                        {doc.doc_type?.title || doc.doc_title}
                      </span>
                      <a
                        href={doc.docs}
                        target='_blank'
                        rel='noreferrer'
                        className='shrink-0 w-6 h-6 rounded-full border border-teal-500 flex items-center justify-center text-teal-500 hover:bg-teal-50 transition-colors'
                      >
                        <Download size={11} />
                      </a>
                    </div>
                  ))}
                </div>
                <div className='space-y-2'>
                  {rightDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className='flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-slate-50'
                    >
                      <span className='text-xs text-slate-600 leading-snug pr-2 truncate'>
                        {doc.doc_type?.title || doc.doc_title}
                      </span>
                      <a
                        href={doc.docs}
                        target='_blank'
                        rel='noreferrer'
                        className='shrink-0 w-6 h-6 rounded-full border border-teal-500 flex items-center justify-center text-teal-500 hover:bg-teal-50 transition-colors'
                      >
                        <Download size={11} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certifications */}
          {certsList.length > 0 && certsList[0] !== "" && (
            <div>
              <h4 className='text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5'>
                Certifications
              </h4>
              <div className='flex flex-wrap gap-2'>
                {certsList.map((cert) => (
                  <span
                    key={cert}
                    className='px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200 rounded-full bg-white'
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skillsList.length > 0 && skillsList[0] !== "" && (
            <div>
              <h4 className='text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5'>
                Skills
              </h4>
              <div className='flex flex-wrap gap-2'>
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className='px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200 rounded-full bg-white'
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {user.educations && user.educations.length > 0 && (
            <div>
              <h4 className='text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5'>
                Education
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {user.educations.map((edu) => (
                  <div
                    key={edu.id}
                    className='border border-slate-200 rounded-lg p-3 bg-slate-50'
                  >
                    <div className='flex items-center gap-2 mb-1.5'>
                      <div className='w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0'>
                        <FileText size={12} className='text-orange-500' />
                      </div>
                      <p className='text-sm font-bold text-slate-800 line-clamp-1'>
                        {edu.institution_name}
                      </p>
                    </div>
                    <p className='text-xs text-slate-500'>
                      {edu.certification_name}
                    </p>
                    <p className='text-xs text-slate-500 mt-0.5'>
                      Completed:{" "}
                      <span className='text-green-600 font-medium'>
                        {edu.year_of_completion}
                      </span>
                    </p>
                    <p className='text-xs text-slate-500 mt-0.5'>
                      License: {edu.license_number || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='grid grid-cols-2 gap-3 pt-2'>
            <button className='py-2.5 px-4 rounded-lg border-2 border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors'>
              Suspend
            </button>
            <button className='py-2.5 px-4 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors'>
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
type TabKey = "all" | "active" | "pending";
const ITEMS_PER_PAGE = 10;

export default function ManageUsersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<UserDetail | null>(null);
  const [fetchingId, setFetchingId] = useState<number | null>(null);

  // Adjusted debounce from 5500 to 500 for normal backend response behavior
  const debounceQuery = useDebounce(searchQuery, 500);

  // RTK Query hook passing parameters dynamically to the backend API endpoint
  const { data: responseData } = useGetAllUsersQuery({
    page: currentPage,
    page_size: ITEMS_PER_PAGE,
    search: debounceQuery,
    is_active:
      activeTab === "active"
        ? true
        : activeTab === "pending"
          ? false
          : undefined,
    user_type: filterRole === "All" ? undefined : filterRole,
  });
  const [triggerGetSingleUser] = useLazyGetSingleUserQuery();

  // Extract pure server-delivered data array securely
  const allUsers: UserListItem[] = responseData?.data || [];
  const totalPages = responseData?.meta?.total_pages || 1;

  const TABS: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Users" },
    { key: "active", label: "Active Users" },
    { key: "pending", label: "Pending Users" },
  ];

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleView = async (user: UserListItem) => {
    setFetchingId(user.id);
    try {
      const res = await triggerGetSingleUser(user.id.toString()).unwrap();
      if (res?.success && res?.data) {
        setActiveModal(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setFetchingId(null);
    }
  };

  const handleDelete = (id: number) => {
    console.log("Delete user:", id);
  };

  return (
    <>
      <StatsCards stats={statsData} />

      <div className='mt-5 bg-white rounded-xl border border-slate-200 overflow-hidden'>
        {/* Toolbar */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-slate-100'>
          <div className='flex items-center gap-1'>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-teal-600 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-2 sm:ml-auto'>
            <div className='relative flex-1 sm:flex-none'>
              <Search
                size={14}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
              />
              <input
                type='text'
                placeholder='Search users'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className='pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 w-full sm:w-44'
              />
            </div>
            <div className='relative'>
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
                className='appearance-none pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 bg-white cursor-pointer'
              >
                <option value='All'>All Roles</option>
                <option value='employee'>Employee</option>
                <option value='employer'>Employer</option>
                <option value='admin'>Admin</option>
              </select>
              <ChevronDown
                size={13}
                className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-175'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50'>
                <th className='w-10 pl-4 text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  #
                  {/* <input
                    type='checkbox'
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className='rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer'
                  /> */}
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  User
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Email
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Role
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Joining Date
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Status
                </th>
                <th className='text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {allUsers.map((user, index) => {
                const isSelected = selectedIds.includes(user.id);
                const isButtonLoading = fetchingId === user.id;

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      isSelected ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <td className='pl-4 py-3'>
                      {index + 1}.
                      {/* <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={(e) =>
                          handleSelectOne(user.id, e.target.checked)
                        }
                        className='rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer'
                      /> */}
                    </td>
                    <td className='px-3 py-3'>
                      <div className='flex items-center gap-2.5'>
                        <div className='w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold overflow-hidden shrink-0'>
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className='text-sm font-medium text-slate-800'>
                            {user.full_name}
                          </p>
                          <p className='text-xs text-slate-400'>
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-3 text-sm text-slate-600'>
                      {user.email}
                    </td>
                    <td className='px-3 py-3 text-sm text-slate-600 capitalize'>
                      {user.user_type}
                    </td>
                    <td className='px-3 py-3 text-sm text-slate-600'>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className='px-3 py-3'>
                      <StatusBadge
                        status={user.is_active ? "Active" : "Inactive"}
                      />
                    </td>
                    <td className='px-3 py-3'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => handleView(user)}
                          disabled={isButtonLoading}
                          className='p-1.5 rounded-md transition-colors text-slate-400 hover:bg-slate-100 hover:text-teal-600 disabled:opacity-60'
                          title='View user'
                        >
                          {isButtonLoading ? (
                            <div className='w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin' />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className='p-1.5 rounded-md transition-colors text-slate-400 hover:bg-red-50 hover:text-red-500'
                          title='Delete user'
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {allUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className='text-center py-12 text-slate-400 text-sm'
                  >
                    No users found matching your criteria.
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

      <UserDetailModal
        user={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
