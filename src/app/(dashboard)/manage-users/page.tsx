"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import UsersTable from "@/components/users/UsersTable";
import UserDetailModal from "@/components/users/UserDetailModal";
import PendingUserModal from "@/components/users/PendingUserModal";
import Pagination from "@/components/ui/Pagination";
import {
  statsData,
  allUsers,
  activeUsers,
  pendingUsers,
  sarahJohnsonDetail,
  pendingUserDetail,
} from "@/data/mockData";
import type { User, UserDetail } from "@/types";

type TabKey = "all" | "active" | "pending";

const ITEMS_PER_PAGE = 11;

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: "all", label: "All Users", count: 72 },
  { key: "active", label: "Active Users", count: 25 },
  { key: "pending", label: "Pending Users", count: 12 },
];

export default function ManageUsersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<UserDetail | null>(null);
  const [pendingModal, setPendingModal] = useState<UserDetail | null>(null);

  // Source list by tab
  const sourceList = useMemo(() => {
    if (activeTab === "active") return activeUsers;
    if (activeTab === "pending") return pendingUsers;
    return allUsers;
  }, [activeTab]);

  // Filter by search + role
  const filtered = useMemo(() => {
    return sourceList.filter((u) => {
      const matchSearch =
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.gmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole =
        filterRole === "All" || u.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [sourceList, searchQuery, filterRole]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleView = (user: User) => {
    if (user.status === "Pending") {
      setPendingModal(pendingUserDetail);
    } else {
      setActiveModal(sarahJohnsonDetail);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map((u) => u.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          From here you can manage your all user
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={statsData} />

      {/* Table Card */}
      <div className="mt-5 bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Tab bar + search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-slate-100">
          {/* Tabs */}
          <div className="flex items-center gap-1">
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
                {tab.label}{" "}
                <span
                  className={`text-xs ${
                    activeTab === tab.key ? "text-teal-100" : "text-slate-400"
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search users"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 w-full sm:w-44"
              />
            </div>
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 bg-white cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Job Seeker">Job Seeker</option>
                <option value="Employer">Employer</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <UsersTable
          users={paginated}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onView={handleView}
          onDelete={(id) => console.log("Delete:", id)}
        />

        {/* Pagination */}
        <div className="border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modals */}
      <UserDetailModal
        user={activeModal}
        onClose={() => setActiveModal(null)}
      />
      <PendingUserModal
        user={pendingModal}
        onClose={() => setPendingModal(null)}
      />
    </>
  );
}
