"use client";

import { Bell, MessageSquare, Menu, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/lib/getImageUrl";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useAuth();

  const renderLeftContent = () => {
    if (pathname.startsWith("/manage-jobs/") && pathname !== "/manage-jobs") {
      return (
        <div className='flex flex-col'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => router.back()}
              className='text-slate-600 hover:text-slate-900 transition-colors'
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className='text-xl lg:text-2xl font-bold text-slate-800 leading-none'>
              Jobs Details
            </h1>
          </div>
          <p className='text-xs lg:text-sm text-slate-500 ml-8 mt-1 leading-none'>
            Upcoming
          </p>
        </div>
      );
    }
    if (pathname === "/create-notification") {
      return (
        <div className='flex flex-col'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => router.back()}
              className='text-slate-600 hover:text-slate-900 transition-colors'
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className='text-xl lg:text-2xl font-bold text-slate-800 leading-none'>
              Create Notifications
            </h1>
          </div>
          <p className='text-xs lg:text-sm text-slate-500 ml-8 mt-1 leading-none'>
            You can create a new notifications
          </p>
        </div>
      );
    }
    if (pathname === "/send-notification") {
      return (
        <div className='flex flex-col'>
          <div className='flex items-center gap-3'>
            <h1 className='text-xl lg:text-2xl font-bold text-slate-800 leading-none'>
              Send Notifications
            </h1>
          </div>
          <p className='text-xs lg:text-sm text-slate-500 mt-1 leading-none'>
            You can send and create a new notifications
          </p>
        </div>
      );
    }
    if (pathname === "/support-report") {
      return (
        <div className='flex flex-col'>
          <div className='flex items-center gap-3'>
            <h1 className='text-xl lg:text-2xl font-bold text-slate-800 leading-none'>
              Support
            </h1>
          </div>
          <p className='text-xs lg:text-sm text-slate-500 mt-1 leading-none'>
            Some support requests have come to you. Please reply to them.
          </p>
        </div>
      );
    }
    if (pathname === "/event/create") {
      return (
        <div className='flex flex-col'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => router.back()}
              className='text-slate-600 hover:text-slate-900 transition-colors'
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className='text-xl lg:text-2xl font-bold text-slate-800 leading-none'>
              Create New Event
            </h1>
          </div>
        </div>
      );
    }
    if (pathname === "/messages") {
      return (
        <div className='flex flex-col'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => router.back()}
              className='text-slate-600 hover:text-slate-900 transition-colors'
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className='text-xl lg:text-2xl font-bold text-slate-800 leading-none'>
              Messages
            </h1>
          </div>
        </div>
      );
    }
    if (pathname === "/settings") {
      return (
        <div className='flex flex-col'>
          <div className='flex items-center gap-3'>
            <h1 className='text-xl lg:text-2xl font-bold text-slate-800 leading-none'>
              Settings
            </h1>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <header className='h-24 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0 m-6 rounded-lg'>
      {/* Left: hamburger for mobile */}
      <button
        onClick={onMenuClick}
        className='lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600'
        aria-label='Open menu'
      >
        <Menu size={20} />
      </button>

      {/* Left content desktop/mobile */}
      <div className='hidden lg:flex flex-1 ml-4 items-center'>
        {renderLeftContent()}
      </div>

      {/* Right: actions + user */}
      <div className='flex items-center gap-2 lg:gap-3'>
        {/* Message icon */}
        <Link
          href='/messages'
          className='relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors block'
        >
          <MessageSquare size={19} />
          <span className='absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full' />
        </Link>

        {/* Notification bell */}
        <button className='relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors'>
          <Bell size={19} />
          <span className='absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full' />
        </button>

        {/* Divider */}
        <div className='h-6 w-px bg-slate-200 mx-1' />

        {/* User info */}
        <div className='flex items-center gap-2.5'>
          <div className='text-right hidden sm:block'>
            <p className='text-sm font-semibold text-slate-800 leading-none'>
              {user?.full_name}
            </p>
          </div>
          <div className='w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-200'>
            <Image
              src={getImageUrl(user?.image) || "/placeholder.png"}
              alt={user?.full_name || "Admin"}
              width={36}
              height={36}
              className='w-full h-full object-cover'
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Mobile Title */}
      <div className='lg:hidden flex-1 ml-3 flex items-center overflow-hidden'>
        {renderLeftContent()}
      </div>
    </header>
  );
}
