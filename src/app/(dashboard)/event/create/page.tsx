"use client";

import { useCreateEventMutation } from "@/redux/features/event/eventAPI";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateEventPage() {
  // Form State
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isPublic, setIsPublic] = useState(false); // New boolean field state

  // Validation Error State
  const [errors, setErrors] = useState({
    title: "",
    eventDate: "",
    description: "",
    link: "",
  });

  console.log({ isPublic });

  const [createEventMutation, { isLoading }] = useCreateEventMutation();

  const handleCreateEvent = async () => {
    // Reset previous errors
    const localErrors = { title: "", eventDate: "", description: "", link: "" };
    let hasError = false;

    if (!title.trim()) {
      localErrors.title = "Title is required.";
      hasError = true;
    }

    if (!eventDate) {
      localErrors.eventDate = "Event date is required.";
      hasError = true;
    }

    if (!description.trim()) {
      localErrors.description = "Description is required.";
      hasError = true;
    }

    // Optional Link Validation (Only runs if the user typed something)
    if (link.trim()) {
      const urlRegex =
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

      if (!urlRegex.test(link.trim())) {
        localErrors.link =
          "Please enter a valid URL (e.g., https://example.com).";
        hasError = true;
      }
    }

    // If there are validation errors, update state and halt submission
    if (hasError) {
      setErrors(localErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({ title: "", eventDate: "", description: "", link: "" });

    try {
      await createEventMutation({
        title: title.trim(),
        event_date: eventDate,
        discription: description.trim(), // Matches the key from your payload requirement
        link: link.trim() || null,
        is_public: isPublic, // Passing the boolean value here
      }).unwrap();

      // Clear form after successful creation
      setTitle("");
      setEventDate("");
      setDescription("");
      setLink("");
      setIsPublic(false); // Reset toggle to default

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
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            placeholder='Write here'
            className={`w-full px-4 py-3 bg-white border ${
              errors.title
                ? "border-red-500 focus:border-red-500"
                : "border-slate-200 focus:border-teal-500"
            } rounded-lg text-sm text-slate-600 focus:outline-none placeholder:text-slate-400`}
            required
          />
          {errors.title && (
            <p className='mt-1.5 text-xs text-red-500 font-medium'>
              {errors.title}
            </p>
          )}
        </div>

        {/* Event Date */}
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Event Date
          </label>
          <div
            onClick={() =>
              (
                document.getElementById("date") as HTMLInputElement
              )?.showPicker()
            }
          >
            <input
              id='date'
              type='date'
              value={eventDate}
              onChange={(e) => {
                setEventDate(e.target.value);
                if (errors.eventDate)
                  setErrors((prev) => ({ ...prev, eventDate: "" }));
              }}
              className={`w-full px-4 py-3 bg-white border ${
                errors.eventDate
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-200 focus:border-teal-500"
              } rounded-lg text-sm text-slate-600 focus:outline-none`}
              required
            />
          </div>
          {errors.eventDate && (
            <p className='mt-1.5 text-xs text-red-500 font-medium'>
              {errors.eventDate}
            </p>
          )}
        </div>

        {/* Event Description */}
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Event Description
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors((prev) => ({ ...prev, description: "" }));
            }}
            placeholder='Write here'
            rows={6}
            className={`w-full px-4 py-3 bg-white border ${
              errors.description
                ? "border-red-500 focus:border-red-500"
                : "border-slate-200 focus:border-teal-500"
            } rounded-lg text-sm text-slate-600 focus:outline-none placeholder:text-slate-400 resize-none`}
          />
          {errors.description && (
            <p className='mt-1.5 text-xs text-red-500 font-medium'>
              {errors.description}
            </p>
          )}
        </div>

        {/* Event Link */}
        <div>
          <label className='block text-sm font-semibold text-slate-700 mb-2'>
            Event Link{" "}
            <span className='text-xs text-slate-400'>(Optional)</span>
          </label>
          <input
            type='text'
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              if (errors.link) setErrors((prev) => ({ ...prev, link: "" }));
            }}
            placeholder='https://example.com'
            className={`w-full px-4 py-3 bg-white border ${
              errors.link
                ? "border-red-500 focus:border-red-500"
                : "border-slate-200 focus:border-teal-500"
            } rounded-lg text-sm text-slate-600 focus:outline-none placeholder:text-slate-400`}
          />
          {errors.link && (
            <p className='mt-1.5 text-xs text-red-500 font-medium'>
              {errors.link}
            </p>
          )}
        </div>

        {/* Is Public Toggle */}
        <div className='flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg'>
          <div>
            <label
              htmlFor='is-public-toggle'
              className='block text-sm font-semibold text-slate-700 cursor-pointer'
            >
              Make Event Public
            </label>
            <p className='text-xs text-slate-400 mt-0.5'>
              Visible to everyone on the platform if enabled.
            </p>
          </div>
          <button
            id='is-public-toggle'
            type='button'
            onClick={() => setIsPublic(!isPublic)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isPublic ? "bg-teal-700" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isPublic ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
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
