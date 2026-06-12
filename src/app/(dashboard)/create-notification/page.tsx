/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useCreateNotificationMutation } from "@/redux/features/notification/notificationAPI";
import { useGetAllUsersQuery } from "@/redux/features/user/userAPI";
import { ChevronDown, X } from "lucide-react";

type NotificationType = "success" | "warning" | "normal";

interface UserOption {
  id: number;
  full_name: string;
  email: string;
}

interface NotificationForm {
  user_ids: number[];
  title: string;
  description: string;
  notification_type: NotificationType;
}

const INITIAL_FORM: NotificationForm = {
  user_ids: [],
  title: "",
  description: "",
  notification_type: "normal",
};

const PAGE_SIZE = 15;

function UserSelectColumn({
  label,
  color,
  userType,
}: {
  label: string;
  color: string;
  userType: "employee" | "employer";
}) {
  const [form, setForm] = useState<NotificationForm>(INITIAL_FORM);
  const [page, setPage] = useState(1);
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data, isFetching } = useGetAllUsersQuery(
    { user_type: userType, page, per_page: PAGE_SIZE },
    {
      selectFromResult: (result) => {
        if (result.data?.data) {
          setAllUsers((prev) => {
            const ids = new Set(prev.map((u) => u.id));
            const next = result.data.data.filter((u: any) => !ids.has(u.id));
            return next.length ? [...prev, ...next] : prev;
          });
        }
        return result;
      },
    },
  );

  const hasMore = data?.meta ? page < data.meta.total_pages : false;

  const [createNotification, { isLoading }] = useCreateNotificationMutation();

  const toggleUser = (id: number) => {
    setForm((f) => ({
      ...f,
      user_ids: f.user_ids.includes(id)
        ? f.user_ids.filter((uid) => uid !== id)
        : [...f.user_ids, id],
    }));
  };

  const toggleSelectAll = () => {
    const allIds = allUsers.map((u) => u.id);
    const allSelected = allIds.every((id) => form.user_ids.includes(id));
    setForm((f) => ({
      ...f,
      user_ids: allSelected ? [] : allIds,
    }));
  };

  const removeUser = (id: number) => {
    setForm((f) => ({
      ...f,
      user_ids: f.user_ids.filter((uid) => uid !== id),
    }));
  };

  const selectedUsers = allUsers.filter((u) => form.user_ids.includes(u.id));
  const allSelected =
    allUsers.length > 0 && allUsers.every((u) => form.user_ids.includes(u.id));

  const handleSend = async () => {
    if (!form.title || !form.description || form.user_ids.length === 0) return;
    await createNotification(form);
    setForm(INITIAL_FORM);
  };

  return (
    <div className='bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full'>
      <h2 className={`text-sm font-semibold ${color} mb-6`}>{label}</h2>

      <div className='space-y-5 flex-1'>
        {/* Multi-select dropdown */}
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Select Name
          </label>

          {/* Selected tags */}
          {selectedUsers.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mb-2'>
              {selectedUsers.map((u) => (
                <span
                  key={u.id}
                  className='inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-md border border-teal-200'
                >
                  {u.full_name}
                  <button
                    type='button'
                    onClick={() => removeUser(u.id)}
                    className='hover:text-teal-900'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Dropdown trigger */}
          <div className='relative'>
            <button
              type='button'
              onClick={() => setDropdownOpen((o) => !o)}
              className='w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
            >
              <span className='text-slate-400'>
                {selectedUsers.length > 0
                  ? `${selectedUsers.length} selected`
                  : "Select users"}
              </span>
              <ChevronDown className='text-slate-400 w-4 h-4' />
            </button>

            {dropdownOpen && (
              <div className='absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto'>
                {/* Select all */}
                <label className='flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-100'>
                  <input
                    type='checkbox'
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className='accent-teal-500 w-4 h-4'
                  />
                  <span className='text-sm font-medium text-slate-700'>
                    Select all
                  </span>
                </label>

                {allUsers.map((u) => (
                  <label
                    key={u.id}
                    className='flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      checked={form.user_ids.includes(u.id)}
                      onChange={() => toggleUser(u.id)}
                      className='accent-teal-500 w-4 h-4 shrink-0'
                    />
                    <span className='text-sm text-slate-700 truncate'>
                      {u.full_name}
                      <span className='text-slate-400 ml-1 text-xs'>
                        {u.email}
                      </span>
                    </span>
                  </label>
                ))}

                {hasMore && (
                  <button
                    type='button'
                    disabled={isFetching}
                    onClick={() => setPage((p) => p + 1)}
                    className='w-full px-4 py-2.5 text-xs text-teal-600 hover:bg-teal-50 disabled:opacity-50 border-t border-slate-100'
                  >
                    {isFetching ? "Loading..." : "Load more"}
                  </button>
                )}

                {allUsers.length === 0 && !isFetching && (
                  <p className='px-4 py-3 text-sm text-slate-400'>
                    No users found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Type
          </label>
          <div className='relative'>
            <select
              className='w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
              value={form.notification_type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  notification_type: e.target.value as NotificationType,
                }))
              }
            >
              <option value='normal'>Normal</option>
              <option value='success'>Success</option>
              <option value='warning'>Warning</option>
            </select>
            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none' />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Title
          </label>
          <input
            type='text'
            placeholder='Write here'
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className='w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400'
          />
        </div>

        {/* Message */}
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Messages
          </label>
          <textarea
            placeholder='Write here'
            rows={6}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 resize-none'
          />
        </div>
      </div>

      <button
        type='button'
        disabled={
          isLoading ||
          !form.title ||
          !form.description ||
          form.user_ids.length === 0
        }
        onClick={handleSend}
        className='w-full mt-8 py-2.5 bg-white border border-blue-500 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? "SENDING..." : "SEND NOW"}
      </button>
    </div>
  );
}

// ─── All Users Column ────────────────────────────────────────────────────────

function AllUsersColumn() {
  const [form, setForm] = useState<Omit<NotificationForm, "user_ids">>({
    title: "",
    description: "",
    notification_type: "normal",
  });

  const [createNotification, { isLoading }] = useCreateNotificationMutation();

  const handleSend = async () => {
    if (!form.title || !form.description) return;
    await createNotification({ ...form, user_ids: [] });
    setForm({ title: "", description: "", notification_type: "normal" });
  };

  return (
    <div className='bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full'>
      <h2 className='text-sm font-semibold text-orange-500 mb-6'>All Users</h2>

      <div className='space-y-5 flex-1'>
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Type
          </label>
          <div className='relative'>
            <select
              className='w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
              value={form.notification_type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  notification_type: e.target.value as NotificationType,
                }))
              }
            >
              <option value='normal'>Normal</option>
              <option value='success'>Success</option>
              <option value='warning'>Warning</option>
            </select>
            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none' />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Title
          </label>
          <input
            type='text'
            placeholder='Write here'
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className='w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Messages
          </label>
          <textarea
            placeholder='Write here'
            rows={6}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 resize-none'
          />
        </div>
      </div>

      <button
        type='button'
        disabled={isLoading || !form.title || !form.description}
        onClick={handleSend}
        className='w-full mt-8 py-2.5 bg-white border border-blue-500 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? "SENDING..." : "SEND NOW"}
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CreateNotificationPage() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      <UserSelectColumn
        label='Job Seeker'
        color='text-green-500'
        userType='employee'
      />
      <UserSelectColumn
        label='Employers'
        color='text-blue-500'
        userType='employer'
      />
      <AllUsersColumn />
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { useCreateNotificationMutation } from "@/redux/features/notification/notificationAPI";
// import { useGetAllUsersQuery } from "@/redux/features/user/userAPI";
// import { ChevronDown } from "lucide-react";

// type NotificationType = "success" | "warning" | "normal";

// interface NotificationForm {
//   user_ids: number[];
//   title: string;
//   description: string;
//   notification_type: NotificationType;
// }

// const INITIAL_FORM: NotificationForm = {
//   user_ids: [],
//   title: "",
//   description: "",
//   notification_type: "normal",
// };

// const PAGE_SIZE = 15;

// function UserSelectColumn({
//   label,
//   color,
//   userType,
// }: {
//   label: string;
//   color: string;
//   userType: "employee" | "employer";
// }) {
//   const [form, setForm] = useState<NotificationForm>(INITIAL_FORM);
//   const [page, setPage] = useState(1);
//   const [allUsers, setAllUsers] = useState<
//     { id: number; full_name: string; email: string }[]
//   >([]);

//   const { data, isFetching } = useGetAllUsersQuery(
//     { user_type: userType, page, per_page: PAGE_SIZE },
//     {
//       selectFromResult: (result) => {
//         if (result.data?.data) {
//           setAllUsers((prev) => {
//             const ids = new Set(prev.map((u) => u.id));
//             const next = result.data.data.filter((u: any) => !ids.has(u.id));
//             return [...prev, ...next];
//           });
//         }
//         return result;
//       },
//     },
//   );

//   const hasMore = data?.meta ? page < data.meta.total_pages : false;

//   const [createNotification, { isLoading }] = useCreateNotificationMutation();

//   const handleSend = async () => {
//     console.log({ form });

//     if (!form.title || !form.description || form.user_ids.length === 0) return;
//     await createNotification(form);
//     setForm(INITIAL_FORM);
//   };

//   return (
//     <div className='bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full'>
//       <h2 className={`text-sm font-semibold ${color} mb-6`}>{label}</h2>

//       <div className='space-y-5 flex-1'>
//         {/* Select Name */}
//         <div>
//           <label className='block text-sm font-medium text-slate-700 mb-2'>
//             Select Name
//           </label>
//           <div className='relative'>
//             <select
//               className='w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
//               value={form.user_ids[0] ?? ""}
//               onChange={(e) =>
//                 setForm((f) => ({
//                   ...f,
//                   user_ids: e.target.value ? [Number(e.target.value)] : [],
//                 }))
//               }
//             >
//               <option value=''>Select a user</option>
//               {allUsers.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.full_name} — {u.email}
//                 </option>
//               ))}
//               {hasMore && (
//                 <option disabled value=''>
//                   — Load more below —
//                 </option>
//               )}
//             </select>
//             <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none' />
//           </div>

//           {hasMore && (
//             <button
//               type='button'
//               disabled={isFetching}
//               onClick={() => setPage((p) => p + 1)}
//               className='mt-2 text-xs text-teal-600 hover:underline disabled:opacity-50'
//             >
//               {isFetching ? "Loading..." : "Load more"}
//             </button>
//           )}
//         </div>

//         {/* Type */}
//         <div>
//           <label className='block text-sm font-medium text-slate-700 mb-2'>
//             Type
//           </label>
//           <div className='relative'>
//             <select
//               className='w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
//               value={form.notification_type}
//               onChange={(e) =>
//                 setForm((f) => ({
//                   ...f,
//                   notification_type: e.target.value as NotificationType,
//                 }))
//               }
//             >
//               <option value='normal'>Normal</option>
//               <option value='success'>Success</option>
//               <option value='warning'>Warning</option>
//             </select>
//             <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none' />
//           </div>
//         </div>

//         {/* Title */}
//         <div>
//           <label className='block text-sm font-medium text-slate-700 mb-2'>
//             Title
//           </label>
//           <input
//             type='text'
//             placeholder='Write here'
//             value={form.title}
//             onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
//             className='w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400'
//           />
//         </div>

//         {/* Message */}
//         <div>
//           <label className='block text-sm font-medium text-slate-700 mb-2'>
//             Messages
//           </label>
//           <textarea
//             placeholder='Write here'
//             rows={6}
//             value={form.description}
//             onChange={(e) =>
//               setForm((f) => ({ ...f, description: e.target.value }))
//             }
//             className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 resize-none'
//           />
//         </div>
//       </div>

//       <button
//         type='button'
//         disabled={
//           isLoading ||
//           !form.title ||
//           !form.description ||
//           form.user_ids.length === 0
//         }
//         onClick={handleSend}
//         className='w-full mt-8 py-2.5 bg-white border border-blue-500 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
//       >
//         {isLoading ? "SENDING..." : "SEND NOW"}
//       </button>
//     </div>
//   );
// }

// // ─── All Users Column ────────────────────────────────────────────────────────

// function AllUsersColumn() {
//   const [form, setForm] = useState<Omit<NotificationForm, "user_ids">>({
//     title: "",
//     description: "",
//     notification_type: "normal",
//   });

//   const [createNotification, { isLoading }] = useCreateNotificationMutation();

//   const handleSend = async () => {
//     if (!form.title || !form.description) return;
//     await createNotification({ ...form, user_ids: [] });
//     setForm({ title: "", description: "", notification_type: "normal" });
//   };

//   return (
//     <div className='bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full'>
//       <h2 className='text-sm font-semibold text-orange-500 mb-6'>All Users</h2>

//       <div className='space-y-5 flex-1'>
//         <div>
//           <label className='block text-sm font-medium text-slate-700 mb-2'>
//             Type
//           </label>
//           <div className='relative'>
//             <select
//               className='w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500'
//               value={form.notification_type}
//               onChange={(e) =>
//                 setForm((f) => ({
//                   ...f,
//                   notification_type: e.target.value as NotificationType,
//                 }))
//               }
//             >
//               <option value='normal'>Normal</option>
//               <option value='success'>Success</option>
//               <option value='warning'>Warning</option>
//             </select>
//             <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none' />
//           </div>
//         </div>

//         <div>
//           <label className='block text-sm font-medium text-slate-700 mb-2'>
//             Title
//           </label>
//           <input
//             type='text'
//             placeholder='Write here'
//             value={form.title}
//             onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
//             className='w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400'
//           />
//         </div>

//         <div>
//           <label className='block text-sm font-medium text-slate-700 mb-2'>
//             Messages
//           </label>
//           <textarea
//             placeholder='Write here'
//             rows={6}
//             value={form.description}
//             onChange={(e) =>
//               setForm((f) => ({ ...f, description: e.target.value }))
//             }
//             className='w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 placeholder:text-slate-400 resize-none'
//           />
//         </div>
//       </div>

//       <button
//         type='button'
//         disabled={isLoading || !form.title || !form.description}
//         onClick={handleSend}
//         className='w-full mt-8 py-2.5 bg-white border border-blue-500 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
//       >
//         {isLoading ? "SENDING..." : "SEND NOW"}
//       </button>
//     </div>
//   );
// }

// // ─── Page ────────────────────────────────────────────────────────────────────

// export default function CreateNotificationPage() {
//   return (
//     <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
//       <UserSelectColumn
//         label='Job Seeker'
//         color='text-green-500'
//         userType='employee'
//       />
//       <UserSelectColumn
//         label='Employers'
//         color='text-blue-500'
//         userType='employer'
//       />
//       <AllUsersColumn />
//     </div>
//   );
// }
