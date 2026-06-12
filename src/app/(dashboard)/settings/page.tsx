"use client";

import { useState } from "react";

import ProfileInfoTab from "@/components/settings/ProfileInfoTab";
import ChangePasswordTab from "@/components/settings/ChangePasswordTab";
import EditAboutUsTab from "@/components/settings/EditAboutUsTab";
import EditTermsTab from "@/components/settings/EditTermsTab";

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
