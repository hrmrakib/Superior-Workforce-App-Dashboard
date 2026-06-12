"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  ChevronDown,
} from "lucide-react";

type TabType =
  | "Profile Info"
  | "Change Password"
  | "Edit Terms & Policies"
  | "Edit About Us";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Profile Info");

  const tabs: TabType[] = [
    "Profile Info",
    "Change Password",
    "Edit Terms & Policies",
    "Edit About Us",
  ];

  return (
    <div className='flex flex-col lg:flex-row gap-6'>
      {/* Left Sidebar (Tabs) */}
      <div className='w-full lg:w-70 shrink-0 space-y-3'>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-5 py-3.5 rounded-lg text-sm font-medium transition-colors border ${
              activeTab === tab
                ? "bg-blue-50/60 border-blue-100 text-blue-600"
                : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Right Content Area */}
      <div className='flex-1 bg-white border border-slate-200 rounded-xl'>
        {activeTab === "Profile Info" && <ProfileInfoTab />}
        {activeTab === "Change Password" && <ChangePasswordTab />}
        {activeTab === "Edit Terms & Policies" && <EditTermsTab />}
        {activeTab === "Edit About Us" && <EditAboutUsTab />}
      </div>
    </div>
  );
}

// --- Tab Components ---

function ProfileInfoTab() {
  return (
    <div className='p-6'>
      <h2 className='text-base font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100'>
        Profile Information
      </h2>

      <div className='space-y-6'>
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-3'>
            Profile Picture
          </label>
          <div className='flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl bg-white max-w-sm'>
            <div className='w-16 h-16 rounded-full overflow-hidden mb-4'>
              <Image
                src='https://i.pravatar.cc/150?img=11'
                alt='Profile'
                width={64}
                height={64}
                className='w-full h-full object-cover'
                unoptimized
              />
            </div>
            <button className='flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors'>
              <Upload size={16} />
              Upload Image
            </button>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Name
          </label>
          <div className='relative'>
            <select className='w-full appearance-none px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'>
              <option>Aiden Max</option>
            </select>
            <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none' />
          </div>
        </div>

        <button className='w-full py-3 bg-teal-700 text-white text-sm font-bold rounded-lg hover:bg-teal-800 transition-colors mt-8'>
          Save Changes
        </button>
      </div>
    </div>
  );
}

function ChangePasswordTab() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className='p-6'>
      <h2 className='text-base font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100'>
        Change Password
      </h2>

      <div className='space-y-5'>
        <div>
          <label className='block text-xs font-medium text-slate-700 mb-2'>
            Old Password
          </label>
          <div className='relative'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
            <input
              type={showOld ? "text" : "password"}
              defaultValue='password123'
              className='w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
            />
            <button
              onClick={() => setShowOld(!showOld)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
            >
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className='block text-xs font-medium text-slate-700 mb-2'>
            New Password
          </label>
          <div className='relative'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
            <input
              type={showNew ? "text" : "password"}
              defaultValue='password123'
              className='w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
            />
            <button
              onClick={() => setShowNew(!showNew)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className='block text-xs font-medium text-slate-700 mb-2'>
            Confirm Password
          </label>
          <div className='relative'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
            <input
              type={showConfirm ? "text" : "password"}
              defaultValue='password123'
              className='w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button className='w-full py-3 bg-teal-700 text-white text-sm font-bold rounded-lg hover:bg-teal-800 transition-colors mt-8'>
          Save Changes
        </button>
      </div>
    </div>
  );
}

function EditTermsTab() {
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

function EditAboutUsTab() {
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
