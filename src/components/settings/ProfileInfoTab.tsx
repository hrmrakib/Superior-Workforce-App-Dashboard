/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/lib/getImageUrl";
import { useUpdateProfileMutation } from "@/redux/features/setting/settingAPI";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ProfileInfoTab() {
  const { user } = useAuth();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [name, setName] = useState(user?.full_name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.full_name);
      //   setImagePreview(user.image || "");
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("full_name", name);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  console.log({ user, name });

  return (
    <div className='p-6'>
      <h2 className='text-base font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100'>
        Profile Information
      </h2>

      <div className='space-y-6'>
        {/* Profile Picture */}
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-3'>
            Profile Picture
          </label>
          <div className='flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl bg-white max-w-sm'>
            <div className='w-16 h-16 rounded-full overflow-hidden mb-4'>
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt='Profile'
                  width={64}
                  height={64}
                  className='w-full h-full object-cover'
                  unoptimized
                />
              ) : (
                <Image
                  src={getImageUrl(user?.image)}
                  alt='Profile'
                  width={64}
                  height={64}
                  className='w-full h-full object-cover'
                  unoptimized
                />
              )}
            </div>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleImageChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className='flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors'
            >
              <Upload size={16} />
              Upload Image
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Name
          </label>
          <input
            type='text'
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
            placeholder='Enter your name'
          />
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
