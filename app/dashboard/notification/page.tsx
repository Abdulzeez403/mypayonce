"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Bell, Check } from "lucide-react";
import ApHeader from "@/components/Apheader";
import { demoNotifications } from "@/constants/data";
import { EmptyTransaction } from "@/components/empty";

export default function NotificationPage() {
  // const notifications = useSelector(
  //   (state: RootState) => state.notifications.items
  // );

  return (
    <div>
      <ApHeader title="Notifications" />
      <div className="py-4 px-2 space-y-4">
        {demoNotifications.length === 0 ? (
          <EmptyTransaction />
        ) : (
          demoNotifications.map((notification) => (
            <div
              key={notification?.id}
              className={`p-4 rounded-md shadow-md border transition-all duration-300 ${
                notification?.read ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{notification?.title}</p>
                  <p className="text-sm text-gray-600">
                    {notification?.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification?.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification?.read && <Check className="text-green-500" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
