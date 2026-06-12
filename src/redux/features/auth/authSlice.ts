/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Updated to accurately match the backend response keys
type TUser = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  user_type: "admin" | "user" | string; // maps to your backend 'user_type'
  image: string | null;
  location: string | null;
  profile: null;

  // Kept these from your original type but made them optional
  // just in case they come from a different endpoint.
  bio?: string | null;
  agency_name?: string | null;
  company?: string;
  website?: string;
  is_active?: boolean;
  date_joined?: string;
};

type TAuthState = {
  userToggle: boolean;
  user: TUser | null;
  token: string | null;
  profileLoading?: boolean;
};

const initialState: TAuthState = {
  userToggle: false,
  user: null,
  token: null,
  profileLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userTrack: (state) => {
      state.userToggle = !state.userToggle;
    },

    // 2. Added explicit PayloadAction typing for better Type-safety
    setUser: (
      state,
      action: PayloadAction<{ user: TUser; token: string | null }>,
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
    },

    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.profileLoading = action.payload;
    },
  },
});

export const { userTrack, setUser, logout, setProfileLoading } =
  authSlice.actions;
export default authSlice.reducer;
