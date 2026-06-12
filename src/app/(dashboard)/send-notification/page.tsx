"use client";

import { useGetCustomNotificationsQuery } from "@/redux/features/notification/notificationAPI";
import { Trash2, Clock, Users, User, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ApiUser {
  id: number;
  full_name: string;
  image: string | null;
  user_type: string;
}

interface ApiNotification {
  id: number;
  users: ApiUser[];
  note_title: string;
  notification_type: string;
  note_description: string;
  created_at: string;
  updated_at: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) +
    " - " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

const getUserTypeStyle = (userType: string) => {
  switch (userType) {
    case "employer":
      return { bg: "bg-green-500", border: "border-green-200" };
    case "employee":
      return { bg: "bg-orange-400", border: "border-orange-200" };
    case "admin":
      return { bg: "bg-purple-500", border: "border-purple-200" };
    default:
      return { bg: "bg-slate-400", border: "border-slate-200" };
  }
};

const getUserTypeIcon = (userType: string) => {
  switch (userType) {
    case "employer":
      return <UserCircle className='w-5 h-5 text-white' />;
    case "admin":
      return <UserCircle className='w-5 h-5 text-white' />;
    default:
      return <User className='w-5 h-5 text-white' />;
  }
};

export default function SendNotificationPage() {
  const [limit, setLimit] = useState(10);
  const { data, isLoading, isError } = useGetCustomNotificationsQuery({
    page: 1,
    page_size: limit,
  });

  const notifications: ApiNotification[] = data?.data ?? [];
  const totalItems: number = data?.meta?.total_items ?? 0;

  const isAllUsers = (notif: ApiNotification) => notif.users.length === 0;

  // Derive card border color: all-users → blue, mixed/specific → first user's type style
  const getCardBorder = (notif: ApiNotification) => {
    if (isAllUsers(notif)) return "border-blue-200";
    const style = getUserTypeStyle(notif.users[0].user_type);
    return style.border;
  };

  const handleLoadMore = () => {
    setLimit(limit + 2);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm'>
          <span className='text-sm font-medium text-slate-500'>
            Total Notifications
          </span>
          <span className='text-xl font-bold text-slate-800'>{totalItems}</span>
        </div>

        <Link
          href='/create-notification'
          className='px-5 py-2.5 bg-teal-700 text-white text-sm font-semibold rounded-lg hover:bg-teal-800 transition-colors shadow-sm self-start sm:self-auto'
        >
          CREATE NEW NOTIFICATION
        </Link>
      </div>

      {/* States */}
      {isLoading && (
        <div className='text-center py-16 text-slate-400 text-sm'>
          Loading notifications...
        </div>
      )}
      {isError && (
        <div className='text-center py-16 text-red-400 text-sm'>
          Failed to load notifications.
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {notifications.map((notif) => {
            const allUsers = isAllUsers(notif);
            const borderClass = getCardBorder(notif);

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-xl border p-5 relative group transition-shadow hover:shadow-md ${borderClass}`}
              >
                {/* Top row */}
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-start gap-3 flex-wrap flex-1 min-w-0'>
                    {allUsers ? (
                      /* All Users badge */
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-600'>
                          <Users className='w-5 h-5 text-white' />
                        </div>
                        <span className='px-2 py-0.5 rounded-md bg-blue-600 text-white text-xs font-semibold'>
                          All Users
                        </span>
                      </div>
                    ) : (
                      /* Per-user badges */
                      <div className='flex flex-wrap gap-2'>
                        {notif.users.map((user) => {
                          const style = getUserTypeStyle(user.user_type);
                          return (
                            <div
                              key={user.id}
                              className='flex items-center gap-1.5'
                            >
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${style.bg}`}
                              >
                                {getUserTypeIcon(user.user_type)}
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-md text-white text-xs font-semibold ${style.bg}`}
                              >
                                {user.full_name}
                              </span>
                              <span className='text-slate-400 text-xs'>•</span>
                              <span className='text-slate-500 text-xs capitalize'>
                                {user.user_type}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <button className='text-slate-300 hover:text-red-500 transition-colors p-1 shrink-0 ml-2'>
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Content */}
                <h3 className='text-base font-bold text-slate-800 mb-2'>
                  {notif.note_title}
                </h3>
                <p className='text-sm text-slate-600 leading-relaxed mb-4'>
                  {notif.note_description}
                </p>

                {/* Footer */}
                <div className='flex items-center gap-2 text-xs font-medium text-slate-500'>
                  <Clock className='w-3.5 h-3.5' />
                  {formatDate(notif.created_at)}
                  <span className='mx-1'>•</span>
                  <span
                    className={`capitalize font-semibold ${
                      notif.notification_type === "success"
                        ? "text-green-600"
                        : notif.notification_type === "error"
                          ? "text-red-500"
                          : "text-blue-500"
                    }`}
                  >
                    {notif.notification_type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {!isLoading && notifications.length < totalItems && (
        <div className='flex justify-center mt-8'>
          <button
            onClick={handleLoadMore}
            className='px-6 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm'
          >
            LOAD MORE
          </button>
        </div>
      )}
    </div>
  );
}
