
import React from "react";

const services = [
  {
    icon: "🩺",
    title: "General Consultation",
    description:
      "Consult experienced doctors for regular health checkups, common illnesses, and medical advice.",
  },
  {
    icon: "❤️",
    title: "Cardiology",
    description:
      "Get specialized care for heart-related conditions with experienced cardiology specialists.",
  },
  {
    icon: "🦷",
    title: "Dental Care",
    description:
      "Complete dental care including regular checkups, cleaning, and treatment.",
  },
  {
    icon: "👶",
    title: "Pediatrics",
    description:
      "Professional healthcare services focused on the health and well-being of children.",
  },
  {
    icon: "🧠",
    title: "Neurology",
    description:
      "Specialized consultation and treatment for neurological and nervous system conditions.",
  },
  {
    icon: "🦴",
    title: "Orthopedic Care",
    description:
      "Expert care for bones, joints, muscles, injuries, and other orthopedic conditions.",
  },
];

function Services() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="bg-teal-600 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl text-center">

          <p className="font-semibold uppercase tracking-wider text-teal-100">
            Healthcare Services
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Our Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-teal-50">
            Quality healthcare services designed to make your healthcare
            experience simple, convenient, and reliable.
          </p>

        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                {/* Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl transition group-hover:bg-teal-600">
                  {service.icon}
                </div>

                {/* Title */}
                <h2 className="mt-6 text-xl font-bold text-gray-900">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="mt-3 leading-7 text-gray-500">
                  {service.description}
                </p>

                {/* Button */}
                <button className="mt-6 font-semibold text-teal-600 transition hover:text-teal-800">
                  Learn More →
                </button>

              </div>
            ))}

          </div>

        </div>
      </section>

    </div>
  );
}

export default Services;
