
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Appointments() {
  const location = useLocation();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const [formData, setFormData] = useState({
    doctor: location.state?.doctorId || "",
    appointmentDate: "",
    reason: "",
  });

  // =====================================
  // Get Doctors
  // =====================================
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");

        console.log("DOCTORS:", response.data);

        setDoctors(response.data.doctors || []);
      } catch (error) {
        console.log(
          "Doctor API Error:",
          error.response?.data || error.message
        );

        alert("Unable to load doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // =====================================
  // Handle Input
  // =====================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // Book Appointment
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctor) {
      alert("Please select a doctor");
      return;
    }

    if (!formData.appointmentDate) {
      alert("Please select appointment date and time");
      return;
    }

    if (!formData.reason.trim()) {
      alert("Please enter reason for visit");
      return;
    }

    try {
      setLoadingBooking(true);

      const response = await api.post("/appointments", {
        doctor: formData.doctor,
        appointmentDate: formData.appointmentDate,
        reason: formData.reason,
      });

      console.log("Appointment Response:", response.data);

      alert(
        response.data.message ||
          "Appointment booked successfully!"
      );

      setFormData({
        doctor: "",
        appointmentDate: "",
        reason: "",
      });

      navigate("/patient-dashboard");

    } catch (error) {
      console.log(
        "Appointment Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to book appointment"
      );
    } finally {
      setLoadingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 px-6 pb-12 pt-28">

      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <p className="font-semibold uppercase tracking-wider text-teal-600">
            MediCare
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Book Appointment
          </h1>

          <p className="mt-3 text-gray-500">
            Select a doctor and schedule your appointment.
          </p>

        </div>

        {/* Form */}
        <div className="rounded-3xl bg-white p-8 shadow-xl md:p-10">

          <form onSubmit={handleSubmit}>

            {/* Doctor */}
            <div>

              <label className="mb-2 block font-semibold text-gray-700">
                Select Doctor
              </label>

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                disabled={loadingDoctors}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-gray-100"
              >

                <option value="">
                  {loadingDoctors
                    ? "Loading doctors..."
                    : "Select a doctor"}
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor._id}
                    value={doctor._id}
                  >
                    {doctor.name}
                  </option>
                ))}

              </select>

            </div>

            {/* Date */}
            <div className="mt-6">

              <label className="mb-2 block font-semibold text-gray-700">
                Appointment Date & Time
              </label>

              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />

            </div>

            {/* Reason */}
            <div className="mt-6">

              <label className="mb-2 block font-semibold text-gray-700">
                Reason for Visit
              </label>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your symptoms or reason for appointment"
                rows="5"
                required
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loadingBooking || loadingDoctors}
              className="mt-8 w-full rounded-xl bg-teal-600 py-3.5 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingBooking
                ? "Booking Appointment..."
                : "Book Appointment"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Appointments;
