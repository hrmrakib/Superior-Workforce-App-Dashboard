"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { revenueChartData, monthlyChartData } from "@/data/mockData";

type Period = "Yearly" | "Monthly";

// Custom tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
        ${payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const [period, setPeriod] = useState<Period>("Yearly");
  const data = period === "Yearly" ? revenueChartData : monthlyChartData;

  // Find peak point
  const peak = data.reduce((max, d) => (d.value > max.value ? d : max), data[0]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-800">Revenue Analytics</h3>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
          {(["Yearly", "Monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 transition-colors ${
                period === p
                  ? "bg-slate-100 text-slate-800"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d7a75" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0d7a75" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0d7a75"
            strokeWidth={2.5}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#0d7a75", strokeWidth: 0 }}
          />
          {/* Peak dot */}
          <ReferenceDot
            x={peak.year}
            y={peak.value}
            r={7}
            fill="#ef4444"
            strokeWidth={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
