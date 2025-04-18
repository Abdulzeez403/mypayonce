import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./type";
import axiosInstance from "@/redux/apis/common/aixosInstance";

export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || "Sign up failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      localStorage.setItem("userToken", response?.data?.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || "Login failed");
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (
    data: { email: string; verificationCode: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/auth/verify", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Email verification failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    profileData: { firstName: string; lastName: string; phone: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        profileData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Profile update failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { email: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Password reset failed"
      );
    }
  }
);

export const currentUser = createAsyncThunk(
  "auth/currentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/user");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch user"
      );
    }
  }
);

export const resendVerificationCode = createAsyncThunk(
  "auth/resendVerificationCode",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/resend-verification", {
        email,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to resend verification code"
      );
    }
  }
);
