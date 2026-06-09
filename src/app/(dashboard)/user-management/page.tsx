"use client";

import { useState, useMemo } from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import UsersTable from "@/components/users/UsersTable";
import PendingUserModal from "@/components/users/PendingUserModal";
import UserDetailModal from "@/components/users/UserDetailModal";
import Pagination from "@/components/ui/Pagination";
import {
  statsData,
  allUsers,
  sarahJohnsonDetail,
  pendingUserDetail,
} from "@/data/mockData";
import type { User, UserDetail } from "@/types";

type TabKey = "active" | "pending";

const ITEMS_PER_PAGE = 11;

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<UserDetail | null>(null);
  const [pendingModal, setPendingModal] = useState<UserDetail | null>(null);

  const sourceList = useMemo(
    () =>
      allUsers.filter((u) =>
        activeTab === "active" ? u.status === "Active" : u.status === "Pending",
      ),
    [activeTab],
  );

  const totalPages = Math.max(1, Math.ceil(sourceList.length / ITEMS_PER_PAGE));
  const paginated = sourceList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleView = (user: User) => {
    if (user.status === "Pending") {
      setPendingModal(pendingUserDetail);
    } else {
      setActiveModal(sarahJohnsonDetail);
    }
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginated.map((u) => u.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id),
    );
  };

  return (
    <>
      {/* Page Title */}
      <div className='mb-5'>
        <h1 className='text-2xl font-bold text-slate-800'>User Management</h1>
        <p className='text-sm text-slate-500 mt-0.5'>
          From here you can manage your all user
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={statsData} />

      {/* Table Card */}
      <div className='mt-5 bg-white rounded-xl border border-slate-200 overflow-hidden'>
        {/* Tabs */}
        <div className='flex items-center gap-4 px-5 py-3 border-b border-slate-100'>
          <button
            onClick={() => handleTabChange("active")}
            className={`pb-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "active"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Active Users
          </button>
          <button
            onClick={() => handleTabChange("pending")}
            className={`pb-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "pending"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Pending Users
          </button>
        </div>

        {/* Table */}
        <UsersTable
          users={paginated}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onView={handleView}
          onDelete={(id) => console.log("Delete:", id)}
          showDeleteRed={activeTab === "pending"}
        />

        {/* Pagination */}
        <div className='border-t border-slate-100'>
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
