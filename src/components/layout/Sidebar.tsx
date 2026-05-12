"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Bell,
  Calendar,
  FileText,
  Settings,
  LogOut,
  X,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manage-users", label: "Manage Users", icon: Users },
  { href: "/manage-jobs", label: "Manage Jobs", icon: Briefcase },
  { href: "/send-notification", label: "Send Notification", icon: Bell },
  { href: "/event", label: "Event", icon: Calendar },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/support-report", label: "Support/Report", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-white border-r border-slate-200 z-40
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 px-5 shrink-0">
          <div className="flex items-center justify-center h-full py-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={500}
              height={250}
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-slate-100 text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(href)) ||
                (href === "/send-notification" && pathname === "/create-notification");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-colors duration-150
                      ${isActive
                        ? "bg-[#E5F1FF] text-[#3E4955"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      className={isActive ? "text-[#3E4955]" : "text-[#5E6670]"}
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-200 shrink-0">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-orange-500 hover:bg-orange-50 transition-colors">
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
