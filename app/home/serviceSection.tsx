"use client";
import { CheckCircle } from "lucide-react";

export function ServiceSection() {
  return (
    <div className="bg-white text-gray-800">
      <div className="py-16 px-6 md:px-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Affordable Data Plans
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Choose from the best data deals available for your network.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "MTN Data", price: "₦500", desc: "1.5GB for 30 Days" },
              {
                title: "Airtel Data",
                price: "₦450",
                desc: "1.5GB for 30 Days",
              },
              { title: "Glo Data", price: "₦400", desc: "1.5GB for 30 Days" },
            ].map((plan, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-gray-600 mb-4">{plan.desc}</p>
                <span className="text-indigo-600 font-bold text-2xl">
                  {plan.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 px-6 md:px-20 bg-indigo-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-800">
            Why Choose Us
          </h2>
          <p className="text-lg text-indigo-700 mb-12">
            We provide reliable, fast, and affordable data services 24/7.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Instant Recharge",
              "24/7 Customer Support",
              "Secure Payment Gateway",
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center space-x-4 p-4 rounded-xl bg-white shadow hover:shadow-md transition"
              >
                <CheckCircle className="text-green-500" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
