import baseAPI from "@/redux/api/api";

const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: () => ({
        url: "/admin_dashboard/users/",
        method: "GET",
      }),
    }),

    getSingleUser: build.query({
      query: (userId: string) => ({
        url: `/admin_dashboard/users/${userId}/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useLazyGetSingleUserQuery,
} = userAPI;
export default userAPI;
