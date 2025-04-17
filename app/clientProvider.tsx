"use client";

import { Provider } from "react-redux";
import dynamic from "next/dynamic";
import { store } from "@/redux/store";

// Dynamically import ToastContainer (no SSR)
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <ToastContainer />
    </Provider>
  );
}
