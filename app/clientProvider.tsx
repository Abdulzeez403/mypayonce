"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastProvider } from "@/components/common/toast";


export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider />

      {children}

    </Provider>
  );
}
