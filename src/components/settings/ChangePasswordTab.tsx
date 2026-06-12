"use client";

import { useChangePasswordMutation } from "@/redux/features/setting/settingAPI";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

export default function ChangePasswordTab() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changePasswordMutation] = useChangePasswordMutation;

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
