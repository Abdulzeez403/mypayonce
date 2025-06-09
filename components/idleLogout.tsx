"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const IdleLogout = ({ children }: { children: React.ReactNode }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoutDelay = 10 * 60 * 1000; // 10 minutes in milliseconds
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("userToken");
    router.push("/auth/signin");
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(logout, logoutDelay);
  };

  useEffect(() => {
    // Only set up event listeners in browser environment
    if (typeof window !== "undefined") {
      const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });

      resetTimer(); // Initialize the timer

      return () => {
        events.forEach((event) => {
          window.removeEventListener(event, resetTimer);
        });
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, []);

  return <>{children}</>;
};

export default IdleLogout;
