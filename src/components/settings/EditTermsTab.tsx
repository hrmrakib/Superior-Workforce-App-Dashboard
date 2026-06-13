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
  const terms = aboutUsData?.data?.terms_condition;

  console.log(aboutUsData?.data?.terms_condition);

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
          placeholder: "Enter your terms and conditions...",
        });

        quillRef.current = quill;

        if (aboutUsData?.data?.terms_condition) {
          quill.root.innerHTML = aboutUsData?.data?.terms_condition;
          setContent(aboutUsData?.data?.terms_condition);
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
  }, [aboutUsData?.data?.terms_condition]);

  if (isLoading && !terms && !quillRef.current) return <div>Loading...</div>;

  const handleSubmit = async () => {
    if (!content || content === "<p><br></p>") {
      toast.error("Description cannot be empty");
      return;
    }

    try {
      const res = await updateCMSMutation({
        terms_condition: content,
      }).unwrap();

      if (res) {
        toast.success("Terms and conditions updated successfully!");
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

// import { ShieldCheck } from "lucide-react";

// export default function EditTermsTab() {
//   const defaultText =
//     "We value your privacy and are committed to protecting your personal information. Our platform collects essential data such as your profile details, professional credentials, and communication activity to provide a secure and efficient job-matching experience. All information is stored securely and used only to improve our services, verify user authenticity, and facilitate connections between healthcare professionals and employers. We do not sell or share your personal data with third parties without your consent, except when required by law. By using our app, you agree to our data practices designed to ensure safety, transparency, and trust.";

//   return (
//     <div className='p-6'>
//       <h2 className='text-base font-semibold text-slate-800 mb-6 pb-4 border-b border-slate-100'>
//         Edit Terms & Policies
//       </h2>

//       <div className='space-y-6'>
//         <div className='border border-slate-200 rounded-xl p-5 bg-white'>
//           <div className='w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4'>
//             <ShieldCheck size={20} />
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
