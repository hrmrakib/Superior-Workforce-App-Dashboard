import baseAPI from "@/redux/api/api";

const jobsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: (params) => ({
        url: "/admin_dashboard/admin/jobs/",
        method: "GET",
        params,
      }),
      providesTags: ["Job"],
    }),

    getSingleJob: builder.query({
      query: (jobId) => ({
        url: `/admin_dashboard/admin/jobs/${jobId}/`,
        method: "GET",
      }),
      providesTags: ["Job"],
    }),

    updateJob: builder.mutation({
      query: ({ jobId, updatedData }) => ({
        url: `/admin_dashboard/admin/jobs/${jobId}/patch/`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Job"],
    }),
  }),
});

export const { useGetJobsQuery, useGetSingleJobQuery, useUpdateJobMutation } =
  jobsAPI;

export default jobsAPI;
