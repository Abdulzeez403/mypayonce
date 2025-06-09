"use client";
import React from "react";

export function CtaSection() {
  return (
    <div className="py-16 px-6 md:px-20 bg-indigo-600 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="mb-6 text-lg">
          Create an account in seconds and enjoy seamless data recharges.
        </p>
        <a
          href="/auth/signup"
          className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full hover:bg-indigo-100 transition"
        >
          Join Now
        </a>
      </div>
    </div>
  );
}
