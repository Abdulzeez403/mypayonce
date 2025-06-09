"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { JSX, useEffect, useState } from "react";
import { Sun, Moon, CloudSun, Bell } from "lucide-react";
import Link from "next/link";

const ApHomeHeader = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [greeting, setGreeting] = useState<{
    text: string;
    icon: JSX.Element;
  } | null>(null); // Initially null to avoid mismatch

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12)
        return {
          text: "Good Morning",
          icon: <Sun className="text-yellow-500" size={24} />,
        };
      if (hour < 18)
        return {
          text: "Good Afternoon",
          icon: <CloudSun className="text-orange-500" size={24} />,
        };
      return {
        text: "Good Evening",
        icon: <Moon className="text-blue-500" size={24} />,
      };
    };

    setGreeting(getGreeting());

    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const hasNewNotification = true;

  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center">
        <div className="p-2 rounded-full">{greeting?.icon}</div>
        <h2 className="text-md font-semibold text-gray-900">
          {greeting?.text}, {user?.firstName || "User"}!
        </h2>
      </div>
      <Link
        href="/dashboard/notification"
        className="relative inline-block p-2 m-2"
      >
        <div className="bg-slate-200 rounded-full p-1">
          <Bell className="text-gray-800" size={20} />
        </div>

        {hasNewNotification && (
          <span className="absolute top-2 right-2 inline-flex h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
        )}
      </Link>
    </div>
  );
};

export default ApHomeHeader;
