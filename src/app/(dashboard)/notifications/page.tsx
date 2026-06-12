"use client";

import { useState, useCallback } from "react";
import {
  Clock,
  Trash2,
  Bell,
  BellOff,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import { useGetNotificationsQuery } from "@/redux/features/notification/notificationAPI";

// ─── Types ───────────────────────────────────────────────────────────────────

type NoteType = "success" | "normal" | "warning" | "error";

interface Notification {
  id: number;
  title: string;
  content: string;
  note_type: NoteType;
}

interface Meta {
  total_items: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  per_page: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NoteType,
  { bar: string; dot: string; badge: string; label: string }
> = {
  success: {
    bar: "bg-teal-500",
    dot: "bg-teal-400",
    badge: "bg-teal-50 text-teal-700 border-teal-200",
    label: "Success",
  },
  normal: {
    bar: "bg-indigo-400",
    dot: "bg-indigo-400",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    label: "Info",
  },
  warning: {
    bar: "bg-amber-400",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Warning",
  },
  error: {
    bar: "bg-rose-500",
    dot: "bg-rose-400",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    label: "Alert",
  },
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className='flex rounded-xl border border-slate-100 overflow-hidden bg-white animate-pulse'>
      <div className='w-1 bg-slate-200 flex-shrink-0' />
      <div className='flex-1 px-4 py-4 space-y-2.5'>
        <div className='flex items-center gap-2'>
          <div className='w-2.5 h-2.5 rounded-full bg-slate-200 flex-shrink-0' />
          <div className='h-3.5 bg-slate-200 rounded w-2/3' />
          <div className='h-4 bg-slate-100 rounded-full w-12 ml-auto' />
        </div>
        <div className='h-3 bg-slate-100 rounded w-full' />
        <div className='h-3 bg-slate-100 rounded w-4/5' />
        <div className='h-2.5 bg-slate-100 rounded w-28 mt-1' />
      </div>
    </div>
  );
}

// ─── Notification Card ────────────────────────────────────────────────────────

interface CardProps {
  notification: Notification;
  isRead: boolean;
  onDelete: (id: number) => void;
  onMarkRead: (id: number) => void;
}

function NotificationCard({
  notification,
  isRead,
  onDelete,
  onMarkRead,
}: CardProps) {
  const { bar, dot, badge, label } =
    TYPE_CONFIG[notification.note_type] ?? TYPE_CONFIG.normal;

  return (
    <div
      className={`
        group relative flex items-start rounded-xl border overflow-hidden
        transition-all duration-200 hover:shadow-md cursor-pointer
        ${
          isRead
            ? "bg-slate-50/60 border-slate-100"
            : "bg-white border-slate-200 shadow-sm"
        }
      `}
      onClick={() => onMarkRead(notification.id)}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onMarkRead(notification.id)}
      aria-label={`Notification: ${notification.title}`}
    >
      {/* Left accent bar */}
      <div className={`w-1 self-stretch flex-shrink-0 ${bar}`} />

      {/* Body */}
      <div className='flex flex-1 items-start gap-3 px-4 py-4 min-w-0'>
        {/* Dot indicator */}
        <div className='mt-1 flex-shrink-0'>
          <span
            className={`
              inline-block w-2.5 h-2.5 rounded-full transition-all duration-300
              ${!isRead ? `${dot} ring-2 ring-offset-1 ring-current` : "bg-slate-300"}
            `}
          />
        </div>

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex flex-wrap items-center gap-2 mb-1'>
            <p
              className={`text-sm font-semibold truncate leading-snug
                ${!isRead ? "text-slate-800" : "text-slate-500"}`}
            >
              {notification.title}
            </p>
            <span
              className={`flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${badge}`}
            >
              {label}
            </span>
            {!isRead && (
              <span className='flex-shrink-0 text-[10px] font-bold text-white bg-teal-500 px-1.5 py-0.5 rounded-full'>
                NEW
              </span>
            )}
          </div>
          <p
            className={`text-xs leading-relaxed line-clamp-2 ${!isRead ? "text-slate-600" : "text-slate-400"}`}
          >
            {notification.content}
          </p>
        </div>
      </div>

      {/* Delete action */}
      <div className='flex items-center px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className='p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors'
          title='Delete notification'
          aria-label='Delete notification'
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  // Real API data
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetNotificationsQuery(undefined);

  // Client-side read state (Set of read IDs)
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  // Client-side deleted IDs
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const allNotifications: Notification[] = (apiResponse?.data ?? []).filter(
    (n: Notification) => !deletedIds.has(n.id),
  );

  const unreadCount = allNotifications.filter((n) => !readIds.has(n.id)).length;

  const displayed =
    filter === "unread"
      ? allNotifications.filter((n) => !readIds.has(n.id))
      : allNotifications;

  const meta: Meta | undefined = apiResponse?.meta;

  const handleDelete = useCallback((id: number) => {
    setDeletedIds((prev) => new Set(prev).add(id));
  }, []);

  const handleMarkRead = useCallback((id: number) => {
    setReadIds((prev) => new Set(prev).add(id));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      allNotifications.forEach((n) => next.add(n.id));
      return next;
    });
  }, [allNotifications]);

  const handleClearAll = useCallback(() => {
    setDeletedIds(new Set(allNotifications.map((n) => n.id)));
  }, [allNotifications]);

  const handleRefresh = useCallback(() => {
    setReadIds(new Set());
    setDeletedIds(new Set());
    refetch();
  }, [refetch]);

  // ── Loading skeleton ──
  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-3'>
          <div className='h-8 bg-slate-200 rounded w-40 animate-pulse mb-6' />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (isError) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <div className='text-center space-y-3'>
          <div className='w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto'>
            <BellOff size={24} className='text-rose-400' />
          </div>
          <p className='text-sm font-semibold text-slate-600'>
            Failed to load notifications
          </p>
          <button
            onClick={() => refetch()}
            className='text-xs font-medium text-teal-600 hover:underline flex items-center gap-1 mx-auto'
          >
            <RefreshCw size={11} /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans'>
      {/* Header */}
      <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center flex-shrink-0'>
              <Bell size={18} className='text-white' />
            </div>
            <div className='min-w-0'>
              <h1 className='text-base sm:text-lg font-bold text-slate-800 leading-tight'>
                Notifications
              </h1>
              <p className='text-xs text-slate-400 leading-tight'>
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2 flex-shrink-0'>
            <button
              onClick={handleRefresh}
              className='p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors'
              title='Refresh'
              aria-label='Refresh notifications'
            >
              <RefreshCw
                size={15}
                className={isFetching ? "animate-spin" : ""}
              />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className='hidden sm:flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors'
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
            {allNotifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className='hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors'
              >
                <Trash2 size={13} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className='max-w-4xl mx-auto px-4 sm:px-6 pb-3 flex items-center justify-between gap-2'>
          <div className='flex gap-1 bg-slate-100 rounded-lg p-0.5'>
            {(["all", "unread"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`
                  px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all duration-150
                  ${
                    filter === tab
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }
                `}
              >
                {tab}
                {tab === "unread" && unreadCount > 0 && (
                  <span className='ml-1.5 bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {meta && (
            <div className='flex items-center gap-1.5 text-xs text-slate-500'>
              <span className='font-semibold text-slate-700'>
                {allNotifications.length}
              </span>
              <span>/ {meta.total_items} total</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='max-w-4xl mx-auto px-4 sm:px-6 py-5'>
        {/* Mobile actions */}
        {(unreadCount > 0 || allNotifications.length > 0) && (
          <div className='flex sm:hidden gap-2 mb-4'>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className='flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-lg transition-colors'
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
            {allNotifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className='flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors'
              >
                <Trash2 size={13} />
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Grid / empty state */}
        {displayed.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center gap-4'>
            <div className='w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center'>
              <BellOff size={28} className='text-slate-300' />
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-500'>
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </p>
              <p className='text-xs text-slate-400 mt-1'>
                {filter === "unread"
                  ? "Switch to 'All' to see past notifications."
                  : "You're all caught up — nothing to show here."}
              </p>
            </div>
            {filter === "unread" && (
              <button
                onClick={() => setFilter("all")}
                className='text-xs font-medium text-teal-600 hover:underline'
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {displayed.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                isRead={readIds.has(notif.id)}
                onDelete={handleDelete}
                onMarkRead={handleMarkRead}
              />
            ))}
          </div>
        )}

        {/* Load more — only shown when API says there's a next page */}
        {displayed.length > 0 && meta?.next && (
          <div className='flex justify-center mt-8'>
            <button
              onClick={() => {
                /* wire to your paginated RTK query here */
              }}
              className='flex items-center gap-2 px-6 py-2.5 rounded-full border border-teal-300 text-teal-600 text-sm font-medium hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all duration-200'
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
