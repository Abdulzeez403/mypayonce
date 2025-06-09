"use client";
import { BottomNav } from "@/components/bottomNav";
import IdleLogout from "@/components/idleLogout";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.replace("/auth/signin");
    }
  }, [router]);

  return (
    <IdleLogout>
      <div className="flex flex-col min-h-screen bg-gray-100 w-full max-w-[420px] mx-auto shadow-lg border">
        <main className="flex-1 p-4">{children}</main>
        <BottomNav />
      </div>
    </IdleLogout>
  );
}
