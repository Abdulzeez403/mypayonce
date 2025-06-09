"use client";
import React from "react";
import { Header } from "./home/header";
import { Footer } from "./home/footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
