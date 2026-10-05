import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function DoctorDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [doctorName, setDoctorName] = useState("Doctor");

  // Get logged-in doctor
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        setDoctorName(user.name || "Doctor");
      } catch (error) {
        console.log("User data error:", error);
      }
    }
  }, []);

  // Fetch doctor appointments
  const fetchDoctorAppointments = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/appointments/doctor"),
        api.get("/prescriptions/doctor"),
      ]);

      const [appointmentResult, prescriptionResult] = results;

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
      }

      failedRequests.forEach((result) => {
        console.log(
          "Doctor Dashboard Request Error:",
          result.reason.response?.data || result.reason.message
        );
      });
    } catch (error) {
      console.log(
        "Doctor Dashboard Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  // Appointment counts
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  );

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Update appointment status
  const updateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);

      const response = await api.put(
        `/appointments/${appointmentId}/status`,
        {
          status,
        }
      );

      console.log("STATUS UPDATED:", response.data);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status,
              }
            : appointment
        )
      );

      alert("Appointment status updated successfully");
    } catch (error) {
      console.log(
        "Update Status Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to update appointment status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Open prescription page
  const createPrescription = (appointment) => {
    navigate("/prescription", {
      state: {
        appointment,
        doctorName,
      },
    });
  };

  const editPrescription = (appointment, prescription) => {
    navigate("/prescription", {
      state: {
        appointment,
        doctorName,
        prescription,
      },
    });
  };

  // Status styles
  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "border-green-200 bg-green-50 text-green-700";

      case "completed":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "cancelled":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <p className="font-semibold text-teal-600">
          Loading doctor dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 px-6 pb-12 pt-28">
      <div className="mx-auto max-w-7xl">

        {/* Welcome */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-teal-600">
              Doctor Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Welcome, {doctorName} 👨‍⚕️
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your appointments and create patient prescriptions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Appointments
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {appointments.length}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                📅
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                  {pendingAppointments.length}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                ⏳
              </div>
            </div>
          </div>

          {/* Confirmed */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Confirmed
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {confirmedAppointments.length}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-2xl">
                ✅
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Completed
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-600">
                  {completedAppointments.length}
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                ✔️
              </div>
            </div>
          </div>

        </div>

        {/* Appointments */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                My Appointments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Appointments booked by your patients.
              </p>
            </div>

            <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-600">
              {appointments.length} Total
            </span>
          </div>

          {/* No appointments */}
          {appointments.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-5xl">
                📅
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                No Appointments
              </h3>

              <p className="mt-2 text-gray-500">
                You don't have any appointments yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">

              {appointments.map((appointment) => {
                const prescription = getPrescription(appointment._id);

                return (
                  <div
                    key={appointment._id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
                  >

                  {/* Appointment Information */}
                  <div className="grid gap-6 lg:grid-cols-3">

                    {/* Patient */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Patient
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-gray-900">
                        {appointment.patient?.name ||
                          "Patient"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {appointment.patient?.email ||
                          "Email not available"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {appointment.patient?.phone ||
                          "Phone not available"}
                      </p>
                    </div>

                    {/* Appointment */}
                    <div>
                      <p className="text-sm text-gray-500">
                        Appointment
                      </p>

                      <p className="mt-1 font-semibold text-gray-800">
                        {formatDate(
                          appointment.appointmentDate
                        )}
                      </p>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          Reason for Visit
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="mb-2 text-sm text-gray-500">
                        Appointment Status
                      </p>

                      <select
                        value={appointment.status}
                        disabled={
                          updatingId === appointment._id
                        }
                        onChange={(e) =>
                          updateStatus(
                            appointment._id,
                            e.target.value
                          )
                        }
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize outline-none ${getStatusStyle(
                          appointment.status
                        )} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="completed">
                          Completed
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>

                      {updatingId === appointment._id && (
                        <p className="mt-2 text-xs text-teal-600">
                          Updating status...
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Prescription */}
                  <div className="mt-6 border-t border-gray-200 pt-5">
                    <h3 className="text-lg font-bold text-gray-800">
                      Prescription
                    </h3>

                    {prescription ? (
                      <div className="mt-3 rounded-xl border border-teal-100 bg-white p-4">
                        <p className="font-semibold text-gray-900">
                          Prescription available
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatDate(
                            prescription.prescriptionDate ||
                              prescription.createdAt
                          )}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/prescriptions/${prescription._id}`)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            View Prescription
                          </button>
                          <button
                            type="button"
                            onClick={() => editPrescription(appointment, prescription)}
                            className="rounded-lg border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
                          >
                            Update Prescription
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => createPrescription(appointment)}
                        className="mt-3 w-full rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
                      >
                        Create Prescription
                      </button>
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

export default DoctorDashboard;