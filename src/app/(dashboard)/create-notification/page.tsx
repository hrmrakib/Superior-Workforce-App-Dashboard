"use client";

import { ChevronDown } from "lucide-react";

export default function CreateNotificationPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Job Seeker Column */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full">
        <h2 className="text-sm font-semibold text-green-500 mb-6">Job Seeker</h2>
        
        <div className="space-y-5 flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Name
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500">
                <option>Mr. John</option>
                <option>Ms. Sarah</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500">
                <option>Normal</option>
                <option>Alert</option>
                <option>Urgent</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input 
              type="text" 
              placeholder="Write here" 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Messages
            </label>
            <textarea 
              placeholder="Write here" 
              rows={6}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        <button className="w-full mt-8 py-2.5 bg-white border border-blue-500 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors">
          SEND NOW
        </button>
      </div>

      {/* Employers Column */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full">
        <h2 className="text-sm font-semibold text-blue-500 mb-6">Employers</h2>
        
        <div className="space-y-5 flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Name
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500">
                <option>Mr. John</option>
                <option>City Hospital</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500">
                <option>Normal</option>
                <option>Alert</option>
                <option>Urgent</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input 
              type="text" 
              placeholder="Write here" 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Messages
            </label>
            <textarea 
              placeholder="Write here" 
              rows={6}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        <button className="w-full mt-8 py-2.5 bg-white border border-blue-500 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors">
          SEND NOW
        </button>
      </div>

      {/* All Users Column */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full">
        <h2 className="text-sm font-semibold text-orange-500 mb-6">All Users</h2>
        
        <div className="space-y-5 flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type
            </label>
            <div className="relative">
              <select className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500">
                <option>Normal</option>
                <option>Alert</option>
                <option>Urgent</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input 
              type="text" 
              placeholder="Write here" 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Messages
            </label>
            <textarea 
              placeholder="Write here" 
              rows={6}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        <button className="w-full mt-8 py-2.5 bg-white border border-blue-500 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors">
          SEND NOW
        </button>
      </div>

    </div>
  );
}
