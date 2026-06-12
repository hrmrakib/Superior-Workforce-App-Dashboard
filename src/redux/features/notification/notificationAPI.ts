import baseAPI from "@/redux/api/api";

const notificationAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query({
      query: () => ({
        url: "/notifications/",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    getCustomNotifications: build.query({
      query: (params) => ({
        url: "/admin_dashboard/user-custom_notification/",
        method: "GET",
        params,
      }),
      providesTags: ["Notification"],
    }),

    createNotification: build.mutation({
      query: (notificationData) => ({
        url: "/notifications/custom/send/",
        method: "POST",
        body: notificationData,
      }),
      invalidatesTags: ["Notification"],
    }),

    markAsRead: build.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: build.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetCustomNotificationsQuery,
  useCreateNotificationMutation,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} = notificationAPI;
export default notificationAPI;
