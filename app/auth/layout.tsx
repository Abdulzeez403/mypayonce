"use client";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-[#f0f4ff] to-[#d4d8ff] flex items-center justify-center px-4">
      <main className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl  shadow-xl">
        {children}
      </main>
    </div>
  );
}
