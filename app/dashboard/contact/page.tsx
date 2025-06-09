import React from "react";
import { Mail, Phone, Instagram, Twitter, Facebook } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Contact Us</h2>

      <div className="flex flex-col gap-4 text-gray-700 text-base">
        <div className="flex items-center gap-3">
          <Phone className="text-blue-600" size={20} />
          <span>+234 8063249490</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="text-blue-600" size={20} />
          <span>support@payonce.com.ng</span>
        </div>

        <div className="flex items-center gap-3">
          <Instagram className="text-pink-500" size={20} />
          <a
            href="https://instagram.com/payonce.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            @payonce.com.ng
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Twitter className="text-blue-400" size={20} />
          <a
            href="https://twitter.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            @payonce.com.ng
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Facebook className="text-blue-700" size={20} />
          <a
            href="https://facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            YourPage
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
