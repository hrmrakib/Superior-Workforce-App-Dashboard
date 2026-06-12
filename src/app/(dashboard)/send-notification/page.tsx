"use client";

import { useGetNotificationsQuery } from "@/redux/features/notification/notificationAPI";
import { Trash2, Clock, Users, User, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type NotificationGroup = "All Users" | "Employers" | "Employee";

interface NotificationItem {
  id: string;
  group: NotificationGroup;
  name?: string;
  roleOrCompany?: string;
  title: string;
  message: string;
  date: string;
  isRead?: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "N1",
    group: "All Users",
    title: "The Title",
    message:
      "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    date: "2024-03-09 - 10:30 AM",
  },
  {
    id: "N2",
    group: "Employers",
    name: "Mr. John",
    roleOrCompany: "Registered Nurse",
    title: "The Title",
    message:
      "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    date: "2024-03-09 - 10:30 AM",
  },
  {
    id: "N3",
    group: "Employers",
    name: "Mr. John",
    roleOrCompany: "Registered Nurse",
    title: "The Title",
    message:
      "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    date: "2024-03-09 - 10:30 AM",
  },
  {
    id: "N4",
    group: "Employers",
    name: "Mr. John",
    roleOrCompany: "Registered Nurse",
    title: "The Title",
    message:
      "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    date: "2024-03-09 - 10:30 AM",
  },
  {
    id: "N5",
    group: "Employee",
    name: "Mr. John",
    roleOrCompany: "City Hospital",
    title: "The Title",
    message:
      "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    date: "2024-03-09 - 10:30 AM",
    isRead: true,
  },
  {
    id: "N6",
    group: "Employee",
    name: "Mr. John",
    roleOrCompany: "City Hospital",
    title: "The Title",
    message:
      "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    date: "2024-03-09 - 10:30 AM",
    isRead: true,
  },
  {
    id: "N7",
    group: "All Users",
    title: "The Title",
    message:
      "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    date: "2024-03-09 - 10:30 AM",
  },
  {
    id: "N8",
    group: "Employee",
    name: "Mr. John",
    roleOrCompany: "City Hospital",
    title: "The Title",
    message:
      "Dear users, the platform will undergo scheduled maintenance tonight from 2:00 AM to 3:00 AM. During this time, some features may be temporarily unavailable.",
    date: "2024-03-09 - 10:30 AM",
    isRead: true,
  },
];

export default function SendNotificationPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const { data } = useGetNotificationsQuery(undefined);
  console.log(data);

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getGroupIcon = (group: NotificationGroup) => {
    switch (group) {
      case "All Users":
        return <Users className='w-5 h-5 text-white' />;
      case "Employers":
        return <UserCircle className='w-5 h-5 text-white' />;
      case "Employee":
        return <User className='w-5 h-5 text-white' />;
    }
  };

  const getGroupStyle = (group: NotificationGroup) => {
    switch (group) {
      case "All Users":
        return {
          bg: "bg-blue-600",
          tagBg: "bg-blue-600",
          tagText: "text-white",
          border: "border-blue-200",
        };
      case "Employers":
        return {
          bg: "bg-green-500",
          tagBg: "bg-green-500",
          tagText: "text-white",
          border: "border-green-200",
        };
      case "Employee":
        return {
          bg: "bg-orange-400",
          tagBg: "bg-orange-400",
          tagText: "text-white",
          border: "border-orange-200",
        };
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header Area */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm'>
          <span className='text-sm font-medium text-slate-500'>
            Total Notifications
          </span>
          <span className='text-xl font-bold text-slate-800'>120</span>
        </div>

        <Link
          href='/create-notification'
          className='px-5 py-2.5 bg-teal-700 text-white text-sm font-semibold rounded-lg hover:bg-teal-800 transition-colors shadow-sm self-start sm:self-auto'
        >
          CREATE NEW NOTIFICATION
        </Link>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {notifications.map((notif) => {
          const styles = getGroupStyle(notif.group);

          return (
            <div
              key={notif.id}
              className={`bg-white rounded-xl border p-5 relative group transition-shadow hover:shadow-md ${styles.border}`}
            >
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-3 flex-wrap'>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${styles.bg}`}
                  >
                    {getGroupIcon(notif.group)}
                  </div>

                  <div className='flex items-center gap-2 text-xs font-semibold'>
                    {notif.group === "All Users" ? (
                      <span
                        className={`px-2 py-0.5 rounded-md ${styles.tagBg} ${styles.tagText}`}
                      >
                        All Users
                      </span>
                    ) : (
                      <>
                        <span
                          className={`px-2 py-0.5 rounded-md ${styles.tagBg} ${styles.tagText}`}
                        >
                          {notif.name}
                        </span>
                        <span className='text-slate-400'>•</span>
                        <span className='text-slate-500'>{notif.group}</span>
                        <span className='text-slate-400'>•</span>
                        <span className='text-slate-500'>
                          {notif.roleOrCompany}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(notif.id)}
                  className='text-slate-300 hover:text-red-500 transition-colors p-1'
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className='text-base font-bold text-slate-800 mb-2'>
                {notif.title}
              </h3>
              <p className='text-sm text-slate-600 leading-relaxed mb-4'>
                {notif.message}
              </p>

              <div className='flex items-center gap-2 text-xs font-medium text-slate-500'>
                <Clock className='w-3.5 h-3.5' />
                {notif.date}
                {notif.isRead && (
                  <>
                    <span className='mx-1'>•</span>
                    <span className='text-green-600'>Read</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className='flex justify-center mt-8'>
        <button className='px-6 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm'>
          LOAD MORE
        </button>
      </div>
    </div>
  );
}
