import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function PrescriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dashboardPath =
    JSON.parse(localStorage.getItem("user") || "null")?.role === "doctor"
      ? "/doctor-dashboard"
      : "/patient-dashboard";
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await api.get(`/prescriptions/${id}`);
        setPrescription(response.data.prescription);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }
        setErrorMessage(
          error.response?.data?.message || "Unable to load this prescription."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id, navigate]);

  const formatDate = (value) => {
    if (!value) return "Not recorded";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-green-50 px-5 pt-20">
        <p className="font-semibold text-teal-700">Loading prescription...</p>
      </main>
    );
  }

  if (errorMessage || !prescription) {
    return (
      <main className="min-h-screen bg-green-50 px-5 pb-12 pt-28">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Prescription unavailable</h1>
          <p role="alert" className="mt-2 text-gray-600">
            {errorMessage || "This prescription could not be found."}
          </p>
          <button
            type="button"
            onClick={() => navigate(dashboardPath, { replace: true })}
            className="mt-6 rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white"
          >
            Back
          </button>
        </div>
      </main>
    );
  }

  const appointment = prescription.appointment;

  return (
    <main className="min-h-screen bg-green-50 px-5 pb-12 pt-28 sm:px-8">
      <article className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-sm sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <p className="font-semibold uppercase text-teal-700">MediCare</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Prescription</h1>
            <p className="mt-2 text-sm text-gray-500">
              Prescribed on {formatDate(prescription.prescriptionDate || prescription.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(dashboardPath, { replace: true })}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
        </div>

        <section className="grid gap-5 border-b border-gray-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Patient</p>
            <p className="mt-1 font-semibold text-gray-900">{prescription.patient?.name || "Patient"}</p>
            <p className="text-sm text-gray-600">{prescription.patient?.email}</p>
            <p className="text-sm text-gray-600">{prescription.patient?.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Doctor</p>
            <p className="mt-1 font-semibold text-gray-900">{prescription.doctor?.name || "Doctor"}</p>
            <p className="text-sm text-gray-600">{prescription.doctor?.email}</p>
          </div>
          {appointment && (
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500">Appointment</p>
              <p className="mt-1 font-medium text-gray-800">
                {formatDate(appointment.appointmentDate)} · {appointment.reason}
              </p>
            </div>
          )}
        </section>

        <section className="border-b border-gray-200 py-6">
          <h2 className="text-lg font-bold text-gray-900">Diagnosis</h2>
          <p className="mt-2 whitespace-pre-line text-gray-700">{prescription.diagnosis}</p>
        </section>

        <section className="border-b border-gray-200 py-6">
          <h2 className="text-lg font-bold text-gray-900">Medicines</h2>
          <div className="mt-4 divide-y divide-gray-100">
            {prescription.medicines?.map((medicine, index) => (
              <div key={`${medicine.name}-${index}`} className="grid gap-2 py-4 sm:grid-cols-4">
                <p className="font-semibold text-gray-900">{medicine.name}</p>
                <p className="text-sm text-gray-700">Dosage: {medicine.dosage}</p>
                <p className="text-sm text-gray-700">Frequency: {medicine.frequency}</p>
                <p className="text-sm text-gray-700">Duration: {medicine.duration}</p>
                {medicine.instructions && (
                  <p className="text-sm text-gray-600 sm:col-span-4">{medicine.instructions}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {prescription.notes && (
          <section className="pt-6">
            <h2 className="text-lg font-bold text-gray-900">Additional instructions</h2>
            <p className="mt-2 whitespace-pre-line text-gray-700">{prescription.notes}</p>
          </section>
        )}
      </article>
    </main>
  );
}

export default PrescriptionDetails;
