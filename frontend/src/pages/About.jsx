
import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="bg-teal-600 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl text-center">

          <p className="font-semibold uppercase tracking-wider text-teal-100">
            About MediCare
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Caring For Your Health
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-teal-50">
            We make healthcare simple, accessible, and convenient for
            everyone.
          </p>

        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

          {/* Left */}
          <div>
            <p className="font-semibold uppercase tracking-wider text-teal-600">
              Who We Are
            </p>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              Your Trusted Healthcare Partner
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              MediCare is a healthcare management platform designed to
              connect patients with doctors and make healthcare services
              easier to access.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              From finding the right doctor to booking appointments,
              MediCare helps patients manage their healthcare journey
              from one convenient platform.
            </p>

            <button className="mt-8 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700">
              Get Started
            </button>
          </div>

          {/* Right */}
          <div className="rounded-3xl bg-teal-50 p-8">

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <h3 className="text-3xl font-bold text-teal-600">
                  50+
                </h3>
                <p className="mt-2 text-gray-500">
                  Expert Doctors
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <h3 className="text-3xl font-bold text-teal-600">
                  20+
                </h3>
                <p className="mt-2 text-gray-500">
                  Specialties
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <h3 className="text-3xl font-bold text-teal-600">
                  10K+
                </h3>
                <p className="mt-2 text-gray-500">
                  Patients
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <h3 className="text-3xl font-bold text-teal-600">
                  24/7
                </h3>
                <p className="mt-2 text-gray-500">
                  Support
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">

          <p className="font-semibold uppercase tracking-wider text-teal-600">
            Why MediCare
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Healthcare Designed Around You
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="text-4xl">👨‍⚕️</div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Experienced Doctors
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Connect with qualified healthcare professionals across
                different specialties.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="text-4xl">📅</div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Easy Appointments
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Find doctors and manage appointments through a simple
                and convenient experience.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="text-4xl">🔒</div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Secure Platform
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                Your healthcare information is managed through a secure
                and reliable platform.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default About;
