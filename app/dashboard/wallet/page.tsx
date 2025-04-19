"use client";
import { Clipboard, Banknote } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ApHomeHeader from "@/components/homeHeader";

export default function WalletCard() {
  const [copied, setCopied] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const copyToClipboard = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <ApHomeHeader />
      <div className="flex  min-h-screen bg-gray-100 p-4">
        <div className="relative w-96 h-56 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-xl p-6 text-white">
          {/* Bank Logo and Name */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{user?.account?.bankName}</h2>
            <Banknote size={24} />
          </div>

          {/* Account Holder */}
          <div className="mt-6">
            <p className="text-sm text-gray-200">Account Holder</p>
            <h3 className="text-xl font-semibold">
              {user?.account?.accountName}
            </h3>
          </div>

          {/* Account Number with Copy Button */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-200">Account Number</p>
              <h3 className="text-lg font-medium tracking-wider">
                {user?.account?.accountNumber}
              </h3>
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
            >
              <Clipboard size={20} />
            </button>
          </div>

          {/* Copied Message */}
          {copied && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-md">
              Copied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
