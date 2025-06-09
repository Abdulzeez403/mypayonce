import axiosInstance from "@/redux/apis/common/aixosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Account {
  id: string;
  name: string;
  email: string;
}

interface WalletSliceState {
  account: Account | null;
  loading: boolean;
  error: string | null;
}

// Async thunk for creating account
export const createAccount = createAsyncThunk(
  "wallet/createAccount",
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/billstack/create-account",
        accountData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create account"
      );
    }
  }
);

const initialState: WalletSliceState = {
  account: null,
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAccount.fulfilled,
        (state, action: PayloadAction<Account>) => {
          state.loading = false;
          state.account = action.payload;
        }
      )
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any) ?? "An unknown error occurred";
      });
  },
});

export default walletSlice.reducer;
