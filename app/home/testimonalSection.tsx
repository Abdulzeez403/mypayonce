"use client";
import React from "react";

export function TestimonialsSection() {
  return (
    <div className="py-20 px-6 md:px-20 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What Our Customers Say
        </h2>

        {/* Subheader */}
        <p className="text-lg text-gray-600 mb-12">
          Don’t take our word for it – here’s what our users have to say.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sodiq A.",
              comment: "Fast and reliable data recharge. I use it every week!",
            },
            {
              name: "Ada O.",
              comment: "Customer support was amazing when I had an issue.",
            },
            {
              name: "Chuka I.",
              comment:
                "Cheapest Airtel bundles I’ve seen online. Highly recommend!",
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <p className="text-gray-700 italic mb-4">“{t.comment}”</p>
              <h4 className="text-indigo-600 font-semibold">{t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
