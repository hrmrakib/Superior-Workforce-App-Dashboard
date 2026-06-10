import baseAPI from "@/redux/api/api";

const eventAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query({
      query: () => ({
        url: "/admin_dashboard/admin/events/",
        method: "GET",
      }),
      providesTags: ["Event"],
    }),

    getSingleEvent: build.query({
      query: (eventId: string) => ({
        url: `/admin_dashboard/admin/events/${eventId}/`,
        method: "GET",
      }),
      providesTags: ["Event"],
    }),

    createEvent: build.mutation({
      query: (data) => ({
        url: "/admin_dashboard/admin/events/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),

    updateEvent: build.mutation({
      query: ({ eventId, data }) => ({
        url: `/admin_dashboard/admin/events/${eventId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),

    deleteEvent: build.mutation({
      query: (eventId) => ({
        url: `/admin_dashboard/admin/events/${eventId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetSingleEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventAPI;

export default eventAPI;
