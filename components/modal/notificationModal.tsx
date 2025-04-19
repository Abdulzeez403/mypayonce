"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { demoNotifications } from "@/constants/data";

export function NotificationModal() {
  const latest = demoNotifications[0];
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!latest || !show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full relative transform transition-transform duration-300 scale-100">
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <p className="text-lg font-bold mb-2 text-center">{latest.title}</p>
        <p className="text-sm text-gray-600 text-center">{latest.message}</p>
      </div>
    </div>
  );
}
