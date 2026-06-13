/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetCMSQuery,
  useUpdateCMSMutation,
} from "@/redux/features/setting/settingAPI";

export default function EditAboutUsTab() {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [content, setContent] = useState<string>("");

  const { data: aboutUsData, isLoading } = useGetCMSQuery({});
  const terms = aboutUsData?.data?.about_us;

  console.log(aboutUsData?.data?.about_us);

  const [updateCMSMutation, { isLoading: isSaving }] = useUpdateCMSMutation();

  useEffect(() => {
    let initialized = false;

    const init = async () => {
      if (initialized || quillRef.current) return;
      initialized = true;

      const Quill = (await import("quill")).default;

      if (editorRef.current && !editorRef.current.querySelector(".ql-editor")) {
        const quill = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Enter your about us...",
        });

        quillRef.current = quill;

        if (aboutUsData?.data?.about_us) {
          quill.root.innerHTML = aboutUsData?.data?.about_us;
          setContent(aboutUsData?.data?.about_us);
        }

        quill.on("text-change", () => {
          setContent(quill.root.innerHTML);
        });
      }
    };

    if (typeof window !== "undefined") {
      init();
    }

    return () => {
      initialized = true;
    };
  }, [aboutUsData?.data?.about_us]);

  if (isLoading && !terms && !quillRef.current) return <div>Loading...</div>;

  const handleSubmit = async () => {
    if (!content || content === "<p><br></p>") {
      toast.error("Description cannot be empty");
      return;
    }

    try {
      const res = await updateCMSMutation({
        about_us: content,
      }).unwrap();

      if (res) {
        toast.success("Community Guidelines updated successfully!");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to update community guidelines",
      );
    }
  };

  return (
    <div className='min-h-[75vh] w-[96%] mx-auto flex flex-col justify-between gap-6 p-5'>
      <div className='space-y-6'>
        <div className='h-auto'>
          <div
            ref={editorRef}
            className='h-[50vh] bg-white text-base text-primary'
            id='quill-editor'
          />
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className='w-full h-12! py-3 bg-teal-700 text-white text-sm font-bold rounded-lg hover:bg-teal-800 transition-colors'
        >
          {isSaving ? "Saving..." : "Save Content"}
        </Button>
      </div>
    </div>
  );
}

// "use client";
// import { Users } from "lucide-react";

// export default function EditAboutUsTab() {
//   const defaultText =
//     "We are a dedicated healthcare job marketplace designed to connect skilled professionals—doctors, nurses, and CNAs—with trusted hospitals and clinics. Our platform simplifies the hiring process by providing a fast, transparent, and reliable way to discover opportunities and fill urgent staffing needs. Whether you're seeking your next role or looking to hire qualified talent, we ensure a seamless experience with verified profiles, real-time communication, and smart matching. Our mission is to support the healthcare community by making staffing more efficient, accessible, and dependable for everyone.";

//   return (
//     <div className='p-6'>
//       <h2 className='text-base font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100'>
//         Edit About Us
//       </h2>

//       <div className='space-y-6'>
//         <div className='border border-slate-200 rounded-xl p-5 bg-white'>
//           <div className='w-10 h-10 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-4'>
//             <Users size={20} />
//           </div>
//           <textarea
//             defaultValue={defaultText}
//             rows={8}
//             className='w-full text-sm text-slate-600 leading-relaxed bg-transparent resize-y focus:outline-none focus:ring-2 focus:ring-blue-100 rounded-lg p-2 -ml-2'
//           />
//         </div>

//         <button className='w-full py-3 bg-teal-700 text-white text-sm font-bold rounded-lg hover:bg-teal-800 transition-colors'>
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }
