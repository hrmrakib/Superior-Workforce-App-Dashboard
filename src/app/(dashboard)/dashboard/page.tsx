"use client";

import { useState } from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RoleDistributionChart from "@/components/dashboard/RoleDistributionChart";
import UsersTable from "@/components/users/UsersTable";
import UserDetailModal from "@/components/users/UserDetailModal";
import PendingUserModal from "@/components/users/PendingUserModal";
import Pagination from "@/components/ui/Pagination";
import {
  statsData,
  allUsers,
  sarahJohnsonDetail,
  pendingUserDetail,
} from "@/data/mockData";
import type { User, UserDetail } from "@/types";
import { useGetProfileQuery } from "@/redux/features/setting/settingAPI";
import ManageUsersPage from "../manage-users/page";

const ITEMS_PER_PAGE = 6;

export default function DashboardPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<UserDetail | null>(null);
  const [pendingModal, setPendingModal] = useState<UserDetail | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // TODO: test

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const { data, isLoading } = useGetProfileQuery({}, { skip: !token });

  console.log(data?.data);

  const recentUsers = allUsers.slice(0, 6);

  const handleView = (user: User) => {
    if (user.status === "Pending") {
      setPendingModal(pendingUserDetail);
    } else {
      setActiveModal(sarahJohnsonDetail);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Delete user:", id);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? recentUsers.map((u) => u.id) : []);
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
        <h1 className='text-2xl font-bold text-slate-800'>Overview</h1>
        <p className='text-sm text-slate-500 mt-0.5'>
          Real-time monetization and user acquisition insights
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={statsData} />

      {/* Charts Row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5'>
        <div className='lg:col-span-2'>
          <RevenueChart />
        </div>
        <div>
          <RoleDistributionChart />
        </div>
      </div>

      {/* Recent Users */}
      <div className='mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden'>
        <div className='px-5 py-4 border-b border-slate-100'>
          <h3 className='text-base font-semibold text-slate-800'>
            Recent Users
          </h3>
        </div>

        <ManageUsersPage hasStats={false} />
        {/* <UsersTable
          users={recentUsers}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onView={handleView}
          onDelete={handleDelete}
        /> */}
        {/* <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        /> */}
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
