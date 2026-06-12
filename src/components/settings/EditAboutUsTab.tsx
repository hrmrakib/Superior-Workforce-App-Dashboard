"use client";

import { Users } from "lucide-react";

export default function EditAboutUsTab() {
  const defaultText =
    "We are a dedicated healthcare job marketplace designed to connect skilled professionals—doctors, nurses, and CNAs—with trusted hospitals and clinics. Our platform simplifies the hiring process by providing a fast, transparent, and reliable way to discover opportunities and fill urgent staffing needs. Whether you're seeking your next role or looking to hire qualified talent, we ensure a seamless experience with verified profiles, real-time communication, and smart matching. Our mission is to support the healthcare community by making staffing more efficient, accessible, and dependable for everyone.";

  return (
    <div className='p-6'>
      <h2 className='text-base font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100'>
        Edit About Us
      </h2>

      <div className='space-y-6'>
        <div className='border border-slate-200 rounded-xl p-5 bg-white'>
          <div className='w-10 h-10 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-4'>
            <Users size={20} />
          </div>
          <textarea
            defaultValue={defaultText}
            rows={8}
            className='w-full text-sm text-slate-600 leading-relaxed bg-transparent resize-y focus:outline-none focus:ring-2 focus:ring-blue-100 rounded-lg p-2 -ml-2'
          />
        </div>

        <button className='w-full py-3 bg-teal-700 text-white text-sm font-bold rounded-lg hover:bg-teal-800 transition-colors'>
          Save Changes
        </button>
      </div>
    </div>
  );
}
