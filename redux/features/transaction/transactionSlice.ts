import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/redux/apis/common/aixosInstance";

// ✅ Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/transactions/transactions");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch");
    }
  }
);

// ✅ Fetch a single transaction by request ID
export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchById",
  async ({ request_id }: { request_id: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/transactions/transactions/${request_id}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Transaction not found");
    }
  }
);

// ✅ Fetch transactions for a specific user by phone number
export const fetchUserTransactions = createAsyncThunk(
  "transactions/fetchByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/transactions/user");
      return response.data.transactions;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch user transactions"
      );
    }
  }
);

interface Transaction {
  _id: string;
  product_name: string;
  unique_element: string;
  unit_price: string;
  quantity: number;
  amount: number;
  email: string;
  phone: string;
  transaction_date: string;
  request_id: string;
  token: string;
  dataName: string;
  status: string;
}

interface TransactionState {
  transactions: Transaction[];
  transaction: Transaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  transaction: null,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
