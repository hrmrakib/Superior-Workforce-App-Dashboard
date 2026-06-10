"use client";

import { ChevronDown, ChevronUp, Calendar, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type TargetMode = "All Users" | "Specific Users";

const mockUsers = ["John", "Smith", "Sarah", "Mike", "Emma", "David", "Habib"];

export default function CreateEventPage() {
  const [targetMode, setTargetMode] = useState<TargetMode>("All Users");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddUser = (user: string) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setInputValue("");
  };

  const handleRemoveUser = (user: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddUser(inputValue.trim());
    }
  };

  return (
    <div className='max-w-3xl'>
      <div className='space-y-6'>
        {/* Target Selection */}
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Select Target
          </label>
          <div className='relative' ref={dropdownRef}>
            {/* Dropdown Header / Trigger */}
            <div
              className='flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer'
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {targetMode === "All Users" ? (
                <span>All Users</span>
              ) : (
                <div className='flex flex-wrap items-center gap-2'>
                  {selectedUsers.length === 0 ? (
                    <span className='text-slate-400'>Select Users...</span>
                  ) : (
                    <>
                      <span className='text-slate-700'>{selectedUsers[0]}</span>
                      {selectedUsers.length > 1 && (
                        <span className='text-slate-700'>
                          +{selectedUsers.length - 1}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
              {dropdownOpen ? (
                <ChevronUp className='w-4 h-4 text-slate-400 shrink-0 ml-2' />
              ) : (
                <ChevronDown className='w-4 h-4 text-slate-400 shrink-0 ml-2' />
              )}
            </div>

            {/* Dropdown Body */}
            {dropdownOpen && (
              <div className='absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 p-2 overflow-hidden'>
                <button
                  type='button'
                  onClick={() => {
                    setTargetMode("All Users");
                    setDropdownOpen(false);
                  }}
                  className='w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors'
                >
                  All Users
                </button>

                <div className='mt-1'>
                  <button
                    type='button'
                    onClick={() => setTargetMode("Specific Users")}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      targetMode === "Specific Users"
                        ? "text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Specific Users
                  </button>

                  {targetMode === "Specific Users" && (
                    <div className='mt-2 px-2 pb-2'>
                      <div className='bg-slate-50 border border-slate-100 rounded-xl p-4'>
                        {/* Selected Pills */}
                        {selectedUsers.length > 0 && (
                          <div className='flex flex-wrap gap-2 mb-3'>
                            {selectedUsers.map((u) => (
                              <div
                                key={u}
                                className='flex items-center gap-1.5 px-3 py-1 bg-teal-700 text-white text-xs font-medium rounded-full'
                              >
                                {u}
                                <button
                                  onClick={() => handleRemoveUser(u)}
                                  className='hover:text-teal-200'
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Input Area */}
                        <input
                          type='text'
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder='Type name and press Enter'
                          className='w-full px-4 py-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30'
                        />

                        {/* Suggestions */}
                        <div className='flex flex-wrap gap-2 mt-4'>
                          {mockUsers
                            .filter((u) => !selectedUsers.includes(u))
                            .map((u) => (
                              <button
                                key={u}
                                type='button'
                                onClick={() => handleAddUser(u)}
                                className='px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors'
                              >
                                {u}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Event Title */}
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Event Title
          </label>
          <input
            type='text'
            placeholder='Write here'
            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400'
          />
        </div>

        {/* Event Date */}
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Event Date
          </label>
          <div className='relative'>
            <input
              type='text'
              placeholder='12 March, 2026'
              className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 pr-10'
            />
            <Calendar className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none' />
          </div>
        </div>

        {/* Event Description */}
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Event Description
          </label>
          <textarea
            placeholder='Write here'
            rows={6}
            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 resize-none'
          />
        </div>

        {/* Submit */}
        <button className='w-full py-3.5 bg-teal-700 text-white text-sm font-bold rounded-lg hover:bg-teal-800 transition-colors'>
          CREATE NOW
        </button>
      </div>
    </div>
  );
}
