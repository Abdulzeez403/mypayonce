"use client";
import Link from "next/link";
import React from "react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Payonce</h3>
          <p className="text-gray-400 text-sm">
            Instant, reliable, and affordable mobile recharges at your
            fingertips.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-3">Links</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-white">
                Support
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>Email: support@quickrecharge.com</li>
            <li>Phone: +234 800 123 4567</li>
          </ul>
        </div>
      </div>
      {/* <p className="text-center text-gray-500 mt-10 text-sm">
        &copy; {new Date().getFullYear()} QuickRecharge. All rights reserved.
      </p> */}
    </footer>
  );
}
