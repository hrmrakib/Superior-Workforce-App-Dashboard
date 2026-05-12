"use client";

import { X, Reply, Clock, Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface SupportRequest {
  id: string;
  name: string;
  email: string;
  title: string;
  message: string;
  attachment?: string;
  date: string;
}

const mockRequests: SupportRequest[] = Array.from({ length: 6 }, (_, i) => ({
  id: `REQ${i + 1}`,
  name: "Mr. John Smith",
  email: "bulbulxyz@gmail.com",
  title: "The Title",
  message: "Hello Admin, we are unable to log into the dashboard. It shows an \"Invalid credentials\" error even after resetting the password.",
  attachment: "xyz.pdf",
  date: "2024-03-09 - 10:30 AM",
}));

export default function SupportPage() {
  const [requests, setRequests] = useState(mockRequests);

  const handleRemove = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm">
        <span className="text-sm font-medium text-slate-500">Total Support Request</span>
        <span className="text-xl font-bold text-slate-800">120</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-5 relative group transition-shadow hover:shadow-md">
            
            <button 
              onClick={() => handleRemove(req.id)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <Image 
                src={`https://i.pravatar.cc/40?img=${req.id.replace('REQ', '')}`}
                alt={req.name}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover border border-slate-100"
                unoptimized
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-md">
                  {req.name}
                </span>
                <span className="text-xs text-slate-500">{req.email}</span>
                <button className="text-slate-400 hover:text-blue-500 transition-colors">
                  <Reply size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-2">{req.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {req.message}
            </p>

            {req.attachment && (
              <div className="mb-4">
                <button className="flex flex-col items-center justify-center gap-1 w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                  <Download size={20} className="text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-medium">{req.attachment}</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {req.date}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          LOAD MORE
        </button>
      </div>
    </div>
  );
}
