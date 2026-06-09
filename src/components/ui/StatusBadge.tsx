import type { UserStatus } from "@/types";

interface StatusBadgeProps {
  status: UserStatus;
  className?: string;
}

const statusConfig: Record<UserStatus, { label: string; classes: string }> = {
  Active: {
    label: "Active",
    classes: "bg-green-50 text-green-600 border border-green-200",
  },
  Inactive: {
    label: "Inactive",
    classes: "bg-red-50 text-red-600 border border-red-200",
  },
  Suspend: {
    label: "Suspend",
    classes: "bg-orange-50 text-orange-500 border border-orange-200",
  },
  Pending: {
    label: "Pending",
    classes: "bg-orange-50 text-orange-500 border border-orange-200",
  },
};

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
}
