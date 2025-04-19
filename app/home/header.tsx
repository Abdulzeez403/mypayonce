"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import logo from "@/public/images/logo.png"; // Adjust the path to your logo image

export function Header() {
  return (
    // <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <header className="flex justify-between items-center px-6 md:px-20 py-4">
      <div className="flex items-center space-x-2">
        <Image src={logo} alt="Payonce" width={40} height={30} />
      </div>
      <nav className="hidden md:flex space-x-6">
        <Link href="/about" className="hover:text-gray-300 text-white">
          Home
        </Link>
        <Link href="/about" className="hover:text-gray-300">
          About
        </Link>
        <Link href="/services" className="hover:text-gray-300">
          Services
        </Link>
        <Link href="/contact" className="hover:text-gray-300">
          Contact Us
        </Link>
        <Link href="/auth/signup" className="hover:text-gray-300">
          Create Account
        </Link>
      </nav>
      <Link
        href="/auth/signin"
        className="bg-purple-600 px-6 py-2 rounded-md text-white font-semibold hover:bg-purple-700"
      >
        Login
      </Link>
    </header>
    // </header>
  );
}
