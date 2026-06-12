"use client";

import { ShieldCheck } from "lucide-react";

export default function EditTermsTab() {
  const defaultText =
    "We value your privacy and are committed to protecting your personal information. Our platform collects essential data such as your profile details, professional credentials, and communication activity to provide a secure and efficient job-matching experience. All information is stored securely and used only to improve our services, verify user authenticity, and facilitate connections between healthcare professionals and employers. We do not sell or share your personal data with third parties without your consent, except when required by law. By using our app, you agree to our data practices designed to ensure safety, transparency, and trust.";

  return (
    <div className='p-6'>
      <h2 className='text-base font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100'>
        Edit Terms & Policies
      </h2>

      <div className='space-y-6'>
        <div className='border border-slate-200 rounded-xl p-5 bg-white'>
          <div className='w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4'>
            <ShieldCheck size={20} />
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
