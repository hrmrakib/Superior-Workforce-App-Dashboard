"use client";

import { MapPin, Users, DollarSign, Clock, Timer, Building2, Star, X, MessageSquare, Phone, FileText, Lightbulb, ChevronUp } from "lucide-react";
import Image from "next/image";

export default function JobDetailsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Job Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
              <Building2 className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">City Hospital</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-blue-600">CNA</span>
                <span className="text-sm text-slate-500">Ongoing</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              Los Angeles, CA
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-400 shrink-0" />
                Employees Assigned
              </div>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-bold">
                10
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-green-600">
              <DollarSign className="w-5 h-5 text-green-500 shrink-0" />
              $22 / hour
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Clock className="w-5 h-5 text-slate-400 shrink-0" />
              Night Shift • Full-time &nbsp; 12 March, 2026
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-500">
              <Timer className="w-5 h-5" />
              2h remaining
            </div>
          </div>
        </div>

        {/* Job Description Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Job Description</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            If this shift is canceled within 8 hours of the start time, it will not be paid out.
          </p>
        </div>

        {/* Reviews Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Review</h3>
              <div className="flex items-center gap-1.5 ml-2">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700">4.8</span>
                </div>
                <span className="text-xs text-slate-500">2 Reviews</span>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <ChevronUp size={20} />
            </button>
          </div>

          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <Image
                  src={`https://i.pravatar.cc/40?img=${i + 10}`}
                  alt="Reviewer"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover border border-slate-100 shrink-0"
                  unoptimized
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800">Mr. John</h4>
                      <p className="text-sm text-slate-500 mt-0.5">Great Experience</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star === 5 ? "fill-slate-200 text-slate-200" : "fill-yellow-400 text-yellow-400"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Employees List Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Employees List (2)</h3>
          </div>

          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://i.pravatar.cc/40?img=${i + 20}`}
                    alt="Employee"
                    width={36}
                    height={36}
                    className="rounded-full w-9 h-9 object-cover border border-slate-100 shrink-0"
                    unoptimized
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800">Mr. Rahan</h4>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">CNA</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center hover:bg-orange-100 transition-colors">
                    <X size={14} />
                  </button>
                  <button className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <MessageSquare size={14} />
                  </button>
                  <button className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <Phone size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Tips</h3>
          </div>
          <div className="p-4 border border-slate-100 rounded-xl text-sm text-slate-600 leading-relaxed bg-slate-50/50">
            Focus on cleanliness and sanitation. Use proper cleaning supplies and follow facility-specific hygiene protocols.
          </div>
        </div>

        <button className="w-full py-3 bg-teal-700 text-white font-semibold rounded-xl hover:bg-teal-800 transition-colors shadow-sm">
          Save Now
        </button>
      </div>
    </div>
  );
}
