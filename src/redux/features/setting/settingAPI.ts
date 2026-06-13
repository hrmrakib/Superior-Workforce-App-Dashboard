import baseAPI from "@/redux/api/api";

const settingAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/profiles/me/",
      }),
      providesTags: ["Settings"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/profiles/me/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    getTermsAndConditions: builder.query({
      query: () => ({
        url: "/settings/terms_conditions/",
      }),
      providesTags: ["Settings"],
    }),

    updateTermsAndConditions: builder.mutation({
      query: (data) => ({
        url: "/settings/terms_conditions/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    getCMS: builder.query({
      query: () => ({
        url: "/admin_dashboard/cms/",
      }),
      providesTags: ["Settings"],
    }),

    updateCMS: builder.mutation({
      query: (data) => ({
        url: "/admin_dashboard/admin/cms/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
  useGetCMSQuery,
  useUpdateCMSMutation,
} = settingAPI;
export default settingAPI;
