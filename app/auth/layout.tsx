"use client";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <main className="w-full max-w-md bg-white/80 rounded-2xl  shadow-xl">
        {children}
      </main>
    </div>
  );
}
