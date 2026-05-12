"use client";

import Link from "next/link";

interface EventItem {
  id: string;
  title: string;
  date: string;
  features: string[];
}

const mockEvents: EventItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: `EV${i + 1}`,
  title: "Employee Appreciation Week 2026",
  date: "Date: May 15-21, 2026",
  features: [
    "Special rewards for top performers",
    "Announcement of raffle draw winners",
    "Free training sessions for skill development",
    "Fun games and engagement activities",
  ],
}));

export default function EventPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Event</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm">
          <span className="text-sm font-medium text-slate-500">Total</span>
          <span className="text-xl font-bold text-slate-800">10</span>
        </div>
        
        <Link 
          href="/event/create"
          className="px-5 py-2.5 bg-teal-700 text-white text-sm font-semibold rounded-lg hover:bg-teal-800 transition-colors shadow-sm"
        >
          CREATE EVENT
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockEvents.map((ev) => (
          <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-[15px] font-bold text-orange-500 mb-1.5">{ev.title}</h3>
            <p className="text-sm font-semibold text-blue-500 mb-4">{ev.date}</p>
            
            <ul className="space-y-1.5">
              {ev.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-xs font-medium text-slate-500">
                  <span className="text-slate-400 shrink-0 mt-0.5">&gt;</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
