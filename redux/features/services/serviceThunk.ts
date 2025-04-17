import axiosInstance from "@/redux/apis/common/aixosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Purchase Data
export const purchaseData = createAsyncThunk(
  "services/purchaseData",
  async ({ payload }: { payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/vtpass/purchase-data",
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Data purchase failed"
      );
    }
  }
);

// Purchase Airtime
export const purchaseAirtime = createAsyncThunk(
  "services/purchaseAirtime",
  async ({ payload }: { payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/vtpass/purchase-airtime",
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Airtime purchase failed"
      );
    }
  }
);

// Pay Electricity
export const payElectricity = createAsyncThunk(
  "services/payElectricity",
  async ({ payload }: { payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/vtpass/pay-electricity",
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Electricity payment failed"
      );
    }
  }
);

// Subscribe Cable
export const subscribeCable = createAsyncThunk(
  "services/subscribeCable",
  async ({ payload }: { payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/vtpass/subscribe-cable",
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Cable subscription failed"
      );
    }
  }
);

// Pay Exam
export const payExam = createAsyncThunk(
  "services/payExam",
  async ({ payload }: { payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/vtpass/pay-exam", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Exam payment failed"
      );
    }
  }
);

// Get Service Variations
export const getServiceVariations = createAsyncThunk(
  "services/getServiceVariations",
  async (
    {
      serviceType,
      useDataSuffix,
    }: { serviceType: string; useDataSuffix?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/vtpass/service-variations/${serviceType}${
          useDataSuffix ? "-data" : ""
        }`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch service variations"
      );
    }
  }
);

// Verify Meter
export const handleVerifyMeter = createAsyncThunk(
  "services/handleVerifyMeter",
  async (
    {
      meter_number,
      provider,
      type,
    }: { meter_number: string; provider: string; type: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/vtpass/verifymeter", {
        meter_number,
        provider,
        type,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Meter verification failed"
      );
    }
  }
);

// Verify Smartcard
export const handleVerifySmartcard = createAsyncThunk(
  "services/handleVerifySmartcard",
  async ({ payload }: { payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/vtpass/verifysmartcard",
        payload
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || "Smartcard verification failed"
      );
    }
  }
);
