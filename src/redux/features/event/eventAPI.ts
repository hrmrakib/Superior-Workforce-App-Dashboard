import baseAPI from "@/redux/api/api";

const eventAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query({
      query: () => ({
        url: "/admin_dashboard/admin/events/",
        method: "GET",
      }),
    }),

    getSingleEvent: build.query({
      query: (eventId: string) => ({
        url: `/admin_dashboard/events/${eventId}/`,
        method: "GET",
      }),
    }),

    createEvent: build.mutation({
      query: (data) => ({
        url: "/admin_dashboard/admin/events/",
        method: "POST",
        body: data,
      }),
    }),

    updateEvent: build.mutation({
      query: ({ eventId, data }) => ({
        url: `/admin_dashboard/events/${eventId}/`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteEvent: build.mutation({
      query: (eventId) => ({
        url: `/admin_dashboard/events/${eventId}/`,
        method: "DELETE",
      }),
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
