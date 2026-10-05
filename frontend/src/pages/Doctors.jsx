
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =====================================
  // Get Doctors From Backend
  // =====================================
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");

        console.log("DOCTORS API RESPONSE:", response.data);

        setDoctors(response.data.doctors || []);
      } catch (error) {
        console.log(
          "Doctors API Error:",
          error.response?.data || error.message
        );

        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // =====================================
  // Filter Doctors
  // =====================================
  const filteredDoctors = doctors.filter((doctor) => {
    return doctor.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="bg-teal-600 px-6 py-16 text-white">

        <div className="mx-auto max-w-7xl text-center">

          <p className="font-semibold uppercase tracking-wider text-teal-100">
            MediCare Specialists
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Our Doctors
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-teal-50">
            Meet our experienced healthcare professionals dedicated to
            providing quality care.
          </p>

        </div>

      </section>

      {/* Search */}
      <section className="px-6 py-10">

        <div className="mx-auto max-w-7xl">

          <input
            type="text"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-teal-500 md:w-1/2"
          />

        </div>

      </section>

      {/* Doctors */}
      <section className="px-6 pb-20">

        <div className="mx-auto max-w-7xl">

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center">

              <p className="text-lg text-gray-500">
                Loading doctors...
              </p>

            </div>
          )}

          {/* No Doctors */}
          {!loading && filteredDoctors.length === 0 && (
            <div className="py-20 text-center">

              <h2 className="text-2xl font-bold text-gray-800">
                No doctors found
              </h2>

              <p className="mt-2 text-gray-500">
                Try another doctor name.
              </p>

            </div>
          )}

          {/* Doctor Cards */}
          {!loading && filteredDoctors.length > 0 && (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredDoctors.map((doctor) => (

                <div
                  key={doctor._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* Doctor Image */}
                  <div className="bg-teal-50 p-6 text-center">

                    <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-teal-100 text-4xl shadow-md">
                      👨‍⚕️
                    </div>

                  </div>

                  {/* Doctor Info */}
                  <div className="p-6">

                    <h2 className="text-xl font-bold text-gray-900">
                      {doctor.name}
                    </h2>

                    <p className="mt-1 font-semibold text-teal-600">
                      Doctor
                    </p>

                    <p className="mt-3 text-sm text-gray-500">
                      {doctor.email}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {doctor.phone}
                    </p>

                    <div className="mt-4 flex items-center gap-2">

                      <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>

                      <span className="text-sm text-gray-600">
                        Available
                      </span>

                    </div>

                    {/* Book Appointment */}
                    <Link
                      to="/appointments"
                      state={{ doctorId: doctor._id }}
                      className="mt-6 block rounded-xl bg-teal-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-teal-700"
                    >
                      Book Appointment
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Doctors;