"use client";

import Image from "next/image";
import { Eye, Trash2 } from "lucide-react";
import type { User } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";

interface UsersTableProps {
  users: User[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onView: (user: User) => void;
  onDelete: (id: string) => void;
  showDeleteRed?: boolean;
}

export default function UsersTable({
  users,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onView,
  onDelete,
  showDeleteRed = false,
}: UsersTableProps) {
  const allSelected = users.length > 0 && selectedIds.length === users.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="w-10 pl-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
            </th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">
              Users
            </th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">
              Gmail
            </th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">
              Phone
            </th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">
              Role
            </th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">
              Joining Date
            </th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">
              Joining Date
            </th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">
              Status
            </th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => {
            const isSelected = selectedIds.includes(user.id);
            return (
              <tr
                key={user.id}
                className={`hover:bg-slate-50/60 transition-colors ${isSelected ? "bg-blue-50/30" : ""}`}
              >
                {/* Checkbox */}
                <td className="pl-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectOne(user.id, e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </td>

                {/* User */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.id}</p>
                    </div>
                  </div>
                </td>

                {/* Gmail */}
                <td className="px-3 py-3 text-sm text-slate-600">{user.gmail}</td>

                {/* Phone */}
                <td className="px-3 py-3 text-sm text-slate-600">{user.phone}</td>

                {/* Role */}
                <td className="px-3 py-3 text-sm text-slate-600">{user.role}</td>

                {/* Joining Date 1 */}
                <td className="px-3 py-3 text-sm text-slate-600">{user.joiningDate}</td>

                {/* Joining Date 2 */}
                <td className="px-3 py-3 text-sm text-slate-600">{user.joiningDate2}</td>

                {/* Status */}
                <td className="px-3 py-3">
                  <StatusBadge status={user.status} />
                </td>

                {/* Action */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(user)}
                      className={`p-1.5 rounded-md transition-colors ${
                        user.status === "Pending"
                          ? "text-orange-400 hover:bg-orange-50"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                      title="View user"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className={`p-1.5 rounded-md transition-colors ${
                        showDeleteRed || user.status === "Suspend"
                          ? "text-red-400 hover:bg-red-50"
                          : "text-slate-400 hover:bg-slate-100"
                      }`}
                      title="Delete user"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {users.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
