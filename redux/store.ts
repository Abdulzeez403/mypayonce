import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/user/userSlice";
import serviceReducer from "./features/services/serviceSlice";
import transactionReducer from "./features/transaction/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    service: serviceReducer,
    // modal: modalReducer,
    transactions: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
