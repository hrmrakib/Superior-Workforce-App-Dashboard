import baseAPI from "@/redux/api/api";

const reportAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getReport: build.query({
      query: () => ({
        url: "/admin_dashboard/admin/support-reports/",
        method: "GET",
      }),
      providesTags: ["Report"],
    }),

    updateReportStatus: build.mutation({
      query: ({ reportId, status }) => ({
        url: `/admin_dashboard/admin/support-reports/${reportId}/status/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Report"],
    }),
  }),
});

export const { useGetReportQuery, useUpdateReportStatusMutation } = reportAPI;
export default reportAPI;
