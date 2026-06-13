import baseAPI from "@/redux/api/api";

const withdrawalAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createWithdrawalRequest: builder.mutation({
      query: (data) => ({
        url: "/withdrawal_requests/",
        method: "POST",
        body: data,
      }),
    }),

    getWithdrawalRequests: builder.query({
      query: (params) => ({
        url: "/admin_dashboard/withdrawal-requests/",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useCreateWithdrawalRequestMutation,
  useGetWithdrawalRequestsQuery,
} = withdrawalAPI;
