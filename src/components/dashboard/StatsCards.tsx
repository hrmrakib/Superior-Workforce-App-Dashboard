import type { StatCard } from "@/types";
import {
  Users,
  Briefcase,
  UserSearch,
  DollarSign,
  ClipboardList,
} from "lucide-react";

interface StatsCardsProps {
  stats: StatCard[];
}

const iconMap = {
  users: { Icon: Users, bg: "bg-blue-50", color: "text-blue-500" },
  employer: { Icon: Briefcase, bg: "bg-green-50", color: "text-green-500" },
  jobseeker: { Icon: UserSearch, bg: "bg-orange-50", color: "text-orange-400" },
  earning: { Icon: DollarSign, bg: "bg-purple-50", color: "text-purple-500" },
  activejob: { Icon: ClipboardList, bg: "bg-slate-100", color: "text-slate-500" },
};

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => {
        const { Icon, bg, color } = iconMap[stat.iconType];
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2"
          >
            <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center`}>
              <Icon size={17} className={color} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
