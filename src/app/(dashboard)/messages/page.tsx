"use client";

import { Paperclip, Mic, Send, CheckCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  isActive?: boolean;
}

const mockContacts: ChatContact[] = Array.from({ length: 6 }, (_, i) => ({
  id: `C${i + 1}`,
  name: "MR. John",
  lastMessage: "We'd like to schedule an interview for the RN position",
  time: "1m ago",
  isActive: i === 0,
}));

export default function MessagePage() {
  const [messageText, setMessageText] = useState("");

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)]">
      {/* Left Column: Contact List */}
      <div className="w-full lg:w-[320px] xl:w-[380px] flex flex-col gap-3 overflow-y-auto pr-2 shrink-0">
        {mockContacts.map((contact) => (
          <div 
            key={contact.id} 
            className={`p-4 rounded-xl border transition-colors cursor-pointer ${
              contact.isActive 
                ? "bg-blue-50 border-blue-200" 
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <Image 
                  src={`https://i.pravatar.cc/40?img=${contact.id.replace('C', '')}`}
                  alt={contact.name}
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover border border-slate-100"
                  unoptimized
                />
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">{contact.name}</h4>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{contact.time}</span>
                </div>
                <p className={`text-xs truncate ${contact.isActive ? "text-slate-600" : "text-slate-500"}`}>
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column: Chat Window */}
      <div className="flex-1 bg-slate-50/50 border border-slate-200 rounded-xl flex flex-col overflow-hidden">
        
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-4">
          
          <div className="flex justify-center mb-2">
            <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 text-[11px] font-medium rounded-full">
              Today
            </span>
          </div>

          {/* Outgoing Message */}
          <div className="flex justify-start">
            <div className="max-w-[80%] lg:max-w-[60%]">
              <div className="bg-teal-700 text-white p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm leading-relaxed">
                Thank you so much! I would be happy to come in for an interview.
              </div>
              <div className="flex items-center justify-end gap-1 mt-1.5 text-[11px] text-slate-400">
                10:30 AM
                <CheckCheck size={14} className="text-blue-500" />
              </div>
            </div>
          </div>

          {/* Incoming Message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] lg:max-w-[60%]">
              <div className="bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed">
                Hello! Thank you for applying to our CNA position.
              </div>
              <div className="flex items-center justify-start gap-1 mt-1.5 text-[11px] text-slate-400">
                10:30 AM
              </div>
            </div>
          </div>

          {/* Incoming Message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] lg:max-w-[60%]">
              <div className="bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed">
                We reviewed your application and would like to schedule an interview.
              </div>
              <div className="flex items-center justify-start gap-1 mt-1.5 text-[11px] text-slate-400">
                10:30 AM
              </div>
            </div>
          </div>

          {/* Outgoing Message */}
          <div className="flex justify-start">
            <div className="max-w-[80%] lg:max-w-[60%]">
              <div className="bg-teal-700 text-white p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm leading-relaxed">
                Thank you so much! I would be happy to come in for an interview.
              </div>
              <div className="flex items-center justify-end gap-1 mt-1.5 text-[11px] text-slate-400">
                10:30 AM
                <CheckCheck size={14} className="text-blue-500" />
              </div>
            </div>
          </div>

          {/* Incoming Message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] lg:max-w-[60%]">
              <div className="bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed">
                How about this Thursday at 2:00 PM?
              </div>
              <div className="flex items-center justify-start gap-1 mt-1.5 text-[11px] text-slate-400">
                10:30 AM
              </div>
            </div>
          </div>

           {/* Incoming Message */}
           <div className="flex justify-end">
            <div className="max-w-[80%] lg:max-w-[60%]">
              <div className="bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed">
                Please bring your CNA certification and resume.
              </div>
              <div className="flex items-center justify-start gap-1 mt-1.5 text-[11px] text-slate-400">
                10:30 AM
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-slate-400"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <Mic size={18} />
            </button>
          </div>

          <button className="w-11 h-11 bg-teal-700 text-white rounded-full flex items-center justify-center hover:bg-teal-800 transition-colors shrink-0 shadow-sm">
            <Send size={18} className="ml-[-2px] mt-[1px]" />
          </button>
        </div>

      </div>
    </div>
  );
}
