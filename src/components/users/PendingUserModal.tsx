"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Star,
  Shield,
  MapPin,
  Mail,
  Phone,
  Download,
  FileText,
  Check,
} from "lucide-react";
import type { UserDetail, Document } from "@/types";

interface PendingUserModalProps {
  user: UserDetail | null;
  onClose: () => void;
}

interface DocumentRowProps {
  doc: Document;
  onChange: (id: string, status: "valid" | "invalid") => void;
}

function DocumentRow({ doc, onChange }: DocumentRowProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white">
      <span className="text-xs text-slate-600 flex-1 leading-snug min-w-0 truncate">
        {doc.name}
      </span>
      {/* Invalid toggle */}
      <button
        onClick={() => onChange(doc.id, "invalid")}
        className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors ${
          doc.status === "invalid"
            ? "text-orange-500 bg-orange-50"
            : "text-slate-400 hover:bg-slate-50"
        }`}
      >
        Invalid
        {doc.status === "invalid" && <Check size={10} className="ml-0.5" />}
      </button>
      {/* Valid toggle */}
      <button
        onClick={() => onChange(doc.id, "valid")}
        className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors ${
          doc.status === "valid"
            ? "text-green-600 bg-green-50"
            : "text-slate-400 hover:bg-slate-50"
        }`}
      >
        Valid
        {doc.status === "valid" && <Check size={10} className="ml-0.5" />}
      </button>
      {/* Download */}
      <button className="shrink-0 w-6 h-6 rounded-full border border-teal-500 flex items-center justify-center text-teal-500 hover:bg-teal-50 transition-colors">
        <Download size={11} />
      </button>
    </div>
  );
}

export default function PendingUserModal({ user, onClose }: PendingUserModalProps) {
  const [docs, setDocs] = useState<Document[]>([]);

  useEffect(() => {
    if (user) {
      setDocs(user.documents);
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [user]);

  if (!user) return null;

  const handleDocChange = (id: string, status: "valid" | "invalid") => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  const leftDocs = docs.filter((_, i) => i % 2 === 0);
  const rightDocs = docs.filter((_, i) => i % 2 !== 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-start gap-4 p-5 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-slate-200 shrink-0">
            <Image
              src={user.avatar}
              alt={user.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={13} fill="currentColor" />
                <span className="text-sm font-semibold text-amber-500">{user.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield size={12} className="text-slate-400" />
              <span className="text-xs text-slate-500">{user.badge}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={12} className="text-slate-400" />
              <span className="text-xs text-slate-500">{user.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Contact Row */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Mail size={12} className="text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Email</p>
                <p className="text-xs text-slate-700 font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <Phone size={12} className="text-green-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Phone</p>
                <p className="text-xs text-slate-700 font-medium">{user.phone}</p>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
            <p className="text-sm font-semibold text-blue-700">
              <span className="text-blue-400 mr-1">*</span>
              {user.experience}
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{user.bio}</p>
          </div>

          {/* Documents with Valid/Invalid toggles */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5">
              Documents
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-2">
                {leftDocs.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} onChange={handleDocChange} />
                ))}
              </div>
              <div className="space-y-2">
                {rightDocs.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} onChange={handleDocChange} />
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5">
              Certifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.certifications.map((cert) => (
                <span
                  key={cert}
                  className="px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200 rounded-full bg-white"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200 rounded-full bg-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education - two columns for pending */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2.5">
              Educaiton
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.education.map((edu) => (
                <div
                  key={edu.id}
                  className="border border-slate-200 rounded-lg p-3 bg-slate-50"
                >
                  <p className="text-sm font-bold text-slate-800">{edu.institution}</p>
                  <p className="text-xs text-slate-500">{edu.school}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {edu.year} ·{" "}
                    <span className="text-green-600 font-medium">{edu.completionStatus}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">License: {edu.license}</p>
                  <button className="flex items-center gap-1 mt-1 text-xs text-blue-500 hover:underline">
                    <FileText size={11} />
                    {edu.certificate}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="py-2.5 px-4 rounded-lg border-2 border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Send Notification
            </button>
            <button className="py-2.5 px-4 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
              Save Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
