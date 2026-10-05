import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <section className="bg-green-50 px-6 pb-20 pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

        {/* Left Content */}
        <div>

          <p className="mb-4 font-semibold uppercase tracking-wider text-teal-600">
            Your Health, Our Priority
          </p>

          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            Quality Healthcare
            <span className="block text-teal-600">
              Made Simple
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Connect with trusted doctors, book appointments, and manage
            your healthcare journey from one simple platform.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/doctors"
              className="rounded-lg bg-teal-600 px-7 py-3 font-semibold text-white transition hover:bg-teal-700"
            >
              Find a Doctor
            </Link>

            <Link
              to={isAuthenticated ? "/appointments" : "/login"}
              state={!isAuthenticated ? { from: { pathname: "/appointments" } } : undefined}
              className="rounded-lg border border-teal-600 px-7 py-3 font-semibold text-teal-600 transition hover:bg-teal-50"
            >
              {isAuthenticated ? "Book Appointment" : "Login to Book"}
            </Link>

          </div>

        </div>

        {/* Right Side */}
        <div className="flex justify-center">

          <div className="relative flex h-80 w-full max-w-md items-center justify-center rounded-3xl bg-white shadow-xl">

            <div className="text-center">

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-teal-50 text-6xl">
                🩺
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-800">
                Trusted Healthcare
              </h2>

              <p className="mt-2 text-gray-500">
                Care you can rely on
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;