"use client";
import { BottomNav } from "@/components/bottomNav";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full max-w-[420px] mx-auto shadow-lg border">
      <main className="flex-1 p-4">{children}</main>
      <BottomNav />
    </div>
  );
}
