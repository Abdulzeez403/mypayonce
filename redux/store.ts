import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/user/userSlice";
import serviceReducer from "./features/services/serviceSlice";
import transactionReducer from "./features/transaction/transactionSlice";
import walletReducer from "./features/wallet/walletSlice";
import notificationReducer from "./features/notifications/notificationSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  service: serviceReducer,
  transactions: transactionReducer,
  wallets: walletReducer,
  notifications: notificationReducer,
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
