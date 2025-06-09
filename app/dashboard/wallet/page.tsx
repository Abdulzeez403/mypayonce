"use client";
import { Clipboard, Banknote } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ApHomeHeader from "@/components/homeHeader";
import { createAccount } from "@/redux/features/wallet/walletSlice";
import { updateProfile } from "@/redux/features/user/userThunk";

export default function WalletCard() {
  const [copied, setCopied] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  // useEffect(() => {
  //   const createAlternateVirtualAccount = async () => {
  //     if (!user?.account || user.account.length !== 1) return;

  //     try {
  //       const primaryAccount = user.account[0];

  //       // Skip if user already has both account types
  //       if (
  //         primaryAccount.bankName === "PalmPay" &&
  //         user.account.some((acc) => acc.bankName === "9PSB")
  //       ) {
  //         return;
  //       }
  //       if (
  //         primaryAccount.bankName === "9PSB" &&
  //         user.account.some((acc) => acc.bankName === "PalmPay")
  //       ) {
  //         return;
  //       }

  //       const reference = `VA-${Date.now()}`;
  //       const payload = {
  //         email: user.email,
  //         reference,
  //         firstName: user.firstName,
  //         lastName: user.lastName,
  //         phone: user.phone,
  //         bank: primaryAccount.bankName === "PalmPay" ? "9PSB" : "PalmPay",
  //       };

  //       dispatch(updateProfile(payload as any));
  //     } catch (error) {
  //       console.error("Failed to create alternate virtual account:", error);
  //       // Consider adding error handling (e.g., toast notification)
  //     }
  //   };

  //   createAlternateVirtualAccount();
  // }, [user, dispatch]);

  return (
    <div>
      <ApHomeHeader />
      <div className="flex flex-wrap gap-4 min-h-screen bg-gray-100 p-4">
        {user?.account?.map((acc, index) => (
          <div
            key={index}
            className="relative w-96 h-56 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-xl p-6 text-white"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{acc.bankName}</h2>
              <Banknote size={24} />
            </div>

            {/* Account Holder */}
            <div className="mt-6">
              <p className="text-sm text-gray-200">Account Holder</p>
              <h3 className="text-xl font-semibold">{acc.accountName}</h3>
            </div>

            {/* Account Number with Copy Button */}
            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-200">Account Number</p>
                <h3 className="text-lg font-medium tracking-wider">
                  {acc.accountNumber}
                </h3>
              </div>
              <button
                onClick={() => copyToClipboard(acc.accountNumber)}
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
        ))}
      </div>
    </div>
  );
}
