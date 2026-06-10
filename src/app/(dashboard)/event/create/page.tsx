"use client";

import { useCreateEventMutation } from "@/redux/features/event/eventAPI";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateEventPage() {
  // Form State
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");

  const [createEventMutation, { isLoading }] = useCreateEventMutation();

  const handleCreateEvent = async () => {
    if (!title || !eventDate || !description) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await createEventMutation({
        title: title,
        event_date: eventDate,
        discription: description, // Matches the key from your payload requirement
      }).unwrap();

      // Clear form after successful creation
      setTitle("");
      setEventDate("");
      setDescription("");
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <div className='max-w-3xl'>
      <div className='space-y-6'>
        {/* Event Title */}
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Event Title
          </label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Write here'
            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400'
          />
        </div>

        {/* Event Date */}
        <div
          onClick={() =>
            (document.getElementById("date") as HTMLInputElement)?.showPicker()
          }
        >
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Event Date
          </label>
          {/* Using type="date" invokes the native browser calendar picker */}
          <input
            id='date'
            type='date'
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
          />
        </div>

        {/* Event Description */}
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Event Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Write here'
            rows={6}
            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 resize-none'
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleCreateEvent}
          disabled={isLoading}
          className='w-full py-3.5 bg-teal-700 text-white text-sm font-bold rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? "CREATING..." : "CREATE NOW"}
        </button>
      </div>
    </div>
  );
}
