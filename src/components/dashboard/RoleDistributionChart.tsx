"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Job Seeker", value: 60, color: "#f97316" },
  { name: "Job Employer", value: 40, color: "#2563eb" },
];

export default function RoleDistributionChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Role Distribution</h3>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-slate-500 font-medium">Total</p>
            <p className="text-2xl font-bold text-slate-800">12540</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-500">{item.name}</span>
              <span
                className="text-xs font-semibold"
                style={{ color: item.color }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
