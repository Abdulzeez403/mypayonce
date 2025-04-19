"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ApHomeHeader from "@/components/homeHeader";

export default function Profile() {
  const [referralCode] = useState("VTU12345");
  const referralLink = `https://yourvtuwebsite.com/register?ref=${referralCode}`;
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    router.push("/auth/signin");
  };

  const menuItems = [
    {
      id: "1",
      icon: "🔑",
      label: "Password Update",
      href: "/settings/password",
    },
    { id: "2", icon: "📞", label: "Contacts", href: "/contacts" },
    { id: "3", icon: "⚙️", label: "Settings", href: "/settings" },
    { id: "4", icon: "🚪", label: "Logout", action: handleLogout },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4 mb-20">
      <ApHomeHeader />

      {/* Menu */}
      <div className="bg-white shadow-lg rounded-xl p-4 mt-6 w-full max-w-md">
        {menuItems.map((item) =>
          item.action ? (
            <div
              key={item.id}
              className="flex items-center py-3 border-b last:border-none cursor-pointer"
              onClick={item.action}
            >
              <span className="text-xl">{item.icon}</span>
              <p className="ml-4 text-lg"> {item.label} </p>
            </div>
          ) : (
            // Handle Normal Navigation
            <Link
              key={item.id}
              href={item.href!}
              className="flex items-center py-3 border-b last:border-none"
            >
              <span className="text-xl">{item.icon}</span>
              <p className="ml-4 text-lg">{item.label}</p>
            </Link>
          )
        )}
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 mt-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800">Refer & Earn</h2>
        <p className="text-gray-600 mt-1">Invite friends & earn rewards.</p>

        {/* Referral Code */}
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-4">
          <span className="text-gray-800 font-semibold">{referralCode}</span>
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg"
          >
            Copy
          </button>
        </div>

        {/* Invite Link */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">Your Invite Link:</p>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-1">
            <span className="text-sm text-gray-700 truncate">
              {referralLink}
            </span>
            <button
              onClick={copyToClipboard}
              className="bg-blue-500 text-white px-3 py-1 text-sm rounded-lg"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Earnings */}
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
          Earn up to <span className="font-bold">₦500</span> per referral!
        </div>

        {/* Share Button */}
        <button
          className="mt-4 bg-blue-600 text-white w-full py-2 rounded-lg font-semibold"
          onClick={() => alert("Share feature coming soon!")}
        >
          Share Invite
        </button>
      </div>
    </div>
  );
}
