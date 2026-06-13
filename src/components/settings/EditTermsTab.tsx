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

export default function EditTermsTab() {
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
        <h2 className='text-base font-semibold text-slate-800'>
          Edit Terms & Policies{" "}
        </h2>
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
