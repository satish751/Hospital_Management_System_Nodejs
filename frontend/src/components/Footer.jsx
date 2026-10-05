import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">

        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-2xl font-bold">
              +
            </div>

            <span className="text-2xl font-bold">
              Medi<span className="text-teal-400">Care</span>
            </span>
          </div>

          <p className="mt-4 leading-7 text-gray-400">
            Your trusted healthcare platform for finding doctors,
            booking appointments, and managing your healthcare.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Quick Links
          </h3>

          <div className="space-y-3 text-gray-400">
            <Link
              to="/"
              className="block hover:text-teal-400"
            >
              Home
            </Link>

            <Link
              to="/doctors"
              className="block hover:text-teal-400"
            >
              Doctors
            </Link>

            <Link
              to="/services"
              className="block hover:text-teal-400"
            >
              Services
            </Link>

            <Link
              to="/about"
              className="block hover:text-teal-400"
            >
              About
            </Link>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Services
          </h3>

          <div className="space-y-3 text-gray-400">
            <p>Doctor Consultation</p>
            <p>Online Appointment</p>
            <p>Emergency Care</p>
            <p>Health Management</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Contact Us
          </h3>

          <div className="space-y-3 text-gray-400">
            <p>📍 Mumbai, India</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ support@medicare.com</p>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="mx-auto mt-10 max-w-7xl border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © 2026 MediCare. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;