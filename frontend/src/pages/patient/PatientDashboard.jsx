import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function PatientDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          try {
            setPatient(JSON.parse(storedUser));
          } catch (error) {
            console.log("Patient data error:", error);
          }
        }

        const results = await Promise.allSettled([
          api.get("/patients/dashboard"),
          api.get("/appointments/my"),
          api.get("/prescriptions/my"),
          api.get("/bills/my"),
        ]);

        const [patientResult, appointmentResult, prescriptionResult, billResult] = results;

        if (patientResult.status === "fulfilled") {
          setPatient(patientResult.value.data.patient);
        }

        if (appointmentResult.status === "fulfilled") {
          setAppointments(
            appointmentResult.value.data.appointments || []
          );
        }

        if (prescriptionResult.status === "fulfilled") {
          setPrescriptions(
            prescriptionResult.value.data.prescriptions || []
          );
        }

        if (billResult.status === "fulfilled") {
          setBills(billResult.value.data.bills || []);
        }

        const failedRequests = results.filter(
          (result) => result.status === "rejected"
        );
        const authError = failedRequests.find(
          (result) => result.reason.response?.status === 401
        );

        if (authError) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        failedRequests.forEach((result) => {
          console.log(
            "Patient Dashboard Request Error:",
            result.reason.response?.data || result.reason.message
          );
        });
      } catch (error) {
        console.log(
          "Patient Dashboard Error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [navigate]);

  // Find prescription for appointment
  const getPrescription = (appointmentId) => {
    return prescriptions.find(
      (prescription) => {
        const linkedAppointment = prescription.appointment;
        const linkedAppointmentId =
          typeof linkedAppointment === "string"
            ? linkedAppointment
            : linkedAppointment?._id;

        return String(linkedAppointmentId) === String(appointmentId);
      }
    );
  };

  // Find bill for appointment
  const getBill = (appointmentId) => {
    return bills.find(
      (bill) =>
        bill.appointment?._id === appointmentId
    );
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <p className="font-semibold text-teal-600">
          Loading patient dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 px-6 pb-12 pt-28">
      <div className="mx-auto max-w-6xl">

        {/* Patient Profile */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {patient?.name || "Patient"}
              </h1>

              <p className="mt-2 text-gray-500">
                Patient Dashboard
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/appointments")}
                className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Book Appointment
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {patient?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {patient?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {patient?.phone || "-"}
              </p>
            </div>

          </div>
        </div>

        {/* Appointments */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-800">
            My Appointments
          </h2>

          <p className="mt-1 text-gray-500">
            Your appointments, prescriptions and bills.
          </p>

          {appointments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                No appointments found.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">

              {appointments.map((appointment) => {
                const prescription = getPrescription(
                  appointment._id
                );

                const bill = getBill(
                  appointment._id
                );

                return (
                  <div
                    key={appointment._id}
                    className="rounded-2xl border border-gray-200 p-6"
                  >

                    {/* Appointment */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Appointment
                      </h3>

                      <div className="mt-4 grid gap-4 md:grid-cols-3">

                        <div>
                          <p className="text-sm text-gray-500">
                            Doctor
                          </p>

                          <p className="mt-1 font-semibold text-gray-800">
                            {appointment.doctor?.name ||
                              "Doctor"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Date & Time
                          </p>

                          <p className="mt-1 font-semibold text-gray-800">
                            {formatDate(
                              appointment.appointmentDate
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Status
                          </p>

                          <p className="mt-1 font-semibold capitalize text-teal-600">
                            {appointment.status}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Prescription */}
                    <div className="mt-6 border-t pt-6">

                      <h3 className="text-lg font-bold text-gray-800">
                        Prescription
                      </h3>

                      {!prescription ? (
                        <p className="mt-2 text-sm text-gray-500">
                          Prescription not created yet.
                        </p>
                      ) : (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/prescriptions/${prescription._id}`)}
                            className="rounded-lg border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
                          >
                            View Prescription
                          </button>
                        </div>
                      )}

                    </div>

                    {/* Bill */}
                    <div className="mt-6 border-t pt-6">

                      <h3 className="text-lg font-bold text-gray-800">
                        Bill
                      </h3>

                      {!bill ? (
                        <p className="mt-2 text-sm text-gray-500">
                          Bill not created yet.
                        </p>
                      ) : (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/bills/${bill._id}`)}
                            className="rounded-lg border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
                          >
                            View Bill
                          </button>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;