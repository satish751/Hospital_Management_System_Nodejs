
import React from "react";

function FeatureCard() {
  return (
    <section className="px-6 py-20">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 text-center">

          <p className="font-semibold uppercase tracking-wider text-teal-600">
            Why Choose MediCare
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            Healthcare Made Simple
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Everything you need to manage your healthcare
            conveniently and securely.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Emergency */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-2xl">
              🚑
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              24/7 Emergency
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              Get quick access to emergency healthcare services
              whenever you need them.
            </p>

          </div>

          {/* Doctors */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-2xl">
              👨‍⚕️
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Expert Doctors
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              Connect with experienced doctors across multiple
              medical specialties.
            </p>

          </div>

          {/* Booking */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-2xl">
              📅
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Easy Booking
            </h3>

            <p className="mt-3 leading-7 text-gray-500">
              Book and manage your doctor appointments quickly
              from anywhere.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default FeatureCard;
