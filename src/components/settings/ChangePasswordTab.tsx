/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useChangePasswordMutation } from "@/redux/features/auth/authAPI";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordTab() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      }).unwrap();

      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className='p-6'>
      <h2 className='text-base font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100'>
        Change Password
      </h2>

      <div className='space-y-5'>
        {/* Old Password */}
        <div>
          <label className='block text-xs font-medium text-slate-700 mb-2'>
            Old Password
          </label>
          <div className='relative'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder='Enter old password'
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

        {/* New Password */}
        <div>
          <label className='block text-xs font-medium text-slate-700 mb-2'>
            New Password
          </label>
          <div className='relative'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter new password'
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

        {/* Confirm Password */}
        <div>
          <label className='block text-xs font-medium text-slate-700 mb-2'>
            Confirm Password
          </label>
          <div className='relative'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm new password'
              className='w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Inline mismatch hint */}
          {confirmPassword && newPassword !== confirmPassword && (
            <p className='mt-1.5 text-xs text-red-500'>
              Passwords do not match
            </p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className='w-full py-3 bg-teal-700 text-white text-sm font-bold rounded-lg hover:bg-teal-800 transition-colors mt-8 disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
