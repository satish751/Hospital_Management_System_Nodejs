import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const initialPatientForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const initialAppointmentForm = {
  patient: "",
  doctor: "",
  appointmentDate: "",
  reason: "",
};

function ReceptionistWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bills, setBills] = useState([]);
  const [patientForm, setPatientForm] = useState(initialPatientForm);
  const [appointmentForm, setAppointmentForm] = useState(initialAppointmentForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeView, setActiveView] = useState(location.state?.activeView || "dashboard");
  const [message, setMessage] = useState(location.state?.message || "");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const results = await Promise.allSettled([
        api.get("/appointments"),
        api.get("/patients"),
        api.get("/doctors"),
        api.get("/bills"),
      ]);

      const [appointmentResult, patientResult, doctorResult, billResult] = results;

      if (appointmentResult.status === "fulfilled") {
        setAppointments(appointmentResult.value.data.appointments || []);
      }
      if (patientResult.status === "fulfilled") {
        setPatients(patientResult.value.data.patients || []);
      }
      if (doctorResult.status === "fulfilled") {
        setDoctors(doctorResult.value.data.doctors || []);
      }
      if (billResult.status === "fulfilled") {
        setBills(billResult.value.data.bills || []);
      }

      const failures = results.filter((result) => result.status === "rejected");
      if (failures.some((result) => result.reason.response?.status === 401)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (failures.length) {
        setErrorMessage("Some dashboard data could not be loaded.");
      }
      setLoading(false);
    };

    loadDashboard();
  }, [navigate]);

  const findBill = (appointmentId) =>
    bills.find((bill) =>
      (bill.appointment?._id || bill.appointment) === appointmentId
    );

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      setErrorMessage("");
      await api.put(`/appointments/${appointmentId}/status`, { status });
      setAppointments((items) => items.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, status }
          : appointment
      ));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to update appointment.");
    }
  };

  const registerPatient = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await api.post("/patients", patientForm);
      setPatients((items) => [response.data.patient, ...items]);
      setPatientForm(initialPatientForm);
      setMessage("Patient registered successfully.");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to register patient.");
    } finally {
      setSaving(false);
    }
  };

  const bookAppointment = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await api.post("/appointments", appointmentForm);
      setAppointments((items) => [
        { ...response.data.appointment, patient: patients.find((item) => item._id === appointmentForm.patient), doctor: doctors.find((item) => item._id === appointmentForm.doctor) },
        ...items,
      ]);
      setAppointmentForm(initialAppointmentForm);
      setMessage("Appointment created successfully.");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to create appointment.");
    } finally {
      setSaving(false);
    }
  };

  const updateBillStatus = async (billId, status) => {
    try {
      setErrorMessage("");
      await api.put(`/bills/${billId}/status`, { status });
      setBills((items) => items.map((bill) =>
        bill._id === billId ? { ...bill, status } : bill
      ));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to update bill.");
    }
  };

  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(
    (appointment) => new Date(appointment.appointmentDate).toDateString() === today
  ).length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length;
  const unpaidBills = bills.filter((bill) => bill.status === "pending").length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <p className="font-semibold text-teal-700">Loading receptionist workspace...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-green-50 px-5 pb-12 pt-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-semibold uppercase text-teal-700">Receptionist Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Clinic Operations</h1>
            <p className="mt-2 text-gray-600">Appointments, patient registration, and billing.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        {errorMessage && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}
        {message && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}

        <nav className="mb-6 flex flex-wrap gap-2" aria-label="Receptionist tasks">
          {[
            ["dashboard", "Dashboard"],
            ["appointments", "Appointments"],
            ["patients", "Register Patient"],
            ["billing", "Billing"],
          ].map(([view, label]) => (
            <button
              key={view}
              type="button"
              onClick={() => setActiveView(view)}
              aria-current={activeView === view ? "page" : undefined}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                activeView === view
                  ? "bg-teal-800 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {activeView === "dashboard" && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Clinic summary">
            <div className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Today's appointments</p><p className="mt-2 text-3xl font-bold">{todaysAppointments}</p></div>
            <div className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Registered patients</p><p className="mt-2 text-3xl font-bold">{patients.length}</p></div>
            <div className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Pending appointments</p><p className="mt-2 text-3xl font-bold text-amber-600">{pendingAppointments}</p></div>
            <div className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Unpaid bills</p><p className="mt-2 text-3xl font-bold text-teal-700">{unpaidBills}</p></div>
          </section>
        )}

        {(activeView === "appointments" || activeView === "billing") && (
        <section className="mt-8 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeView === "appointments" ? "Appointments" : "Billing"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {activeView === "appointments"
                  ? "Review bookings and update appointment status."
                  : "Create bills and record payments by appointment."}
              </p>
            </div>
            <span className="text-sm font-semibold text-gray-600">{appointments.length} total</span>
          </div>

          {appointments.length === 0 ? (
            <p className="py-8 text-sm text-gray-500">
              {activeView === "billing" ? "No appointments available for billing." : "No appointments yet."}
            </p>
          ) : (
            <div className="mt-5 divide-y divide-gray-100">
              {appointments.map((appointment) => {
                const bill = findBill(appointment._id);
                return (
                  <article key={appointment._id} className="grid gap-4 py-5 md:grid-cols-[1fr_1fr_1.2fr] md:items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{appointment.patient?.name || "Patient"}</p>
                      <p className="text-sm text-gray-500">{appointment.patient?.phone || appointment.patient?.email || "Contact unavailable"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{appointment.doctor?.name || "Doctor"}</p>
                      <p className="text-sm text-gray-500">{new Date(appointment.appointmentDate).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {activeView === "appointments" && (
                        <select
                          aria-label={`Appointment status for ${appointment.patient?.name || "patient"}`}
                          value={appointment.status}
                          onChange={(event) => updateAppointmentStatus(appointment._id, event.target.value)}
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm capitalize"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                      {activeView === "billing" && (bill ? (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold">₹{bill.amount}</span>
                          <select
                            aria-label={`Bill status ${bill.billNumber}`}
                            value={bill.status}
                            onChange={(event) => updateBillStatus(bill._id, event.target.value)}
                            className="rounded-lg border border-gray-300 px-2 py-2 capitalize"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {bill.status === "pending" && (
                            <button
                              type="button"
                              onClick={() => navigate(
                                `/receptionist/bills/${appointment._id}/edit/${bill._id}`,
                                { state: { appointment, bill } }
                              )}
                              className="rounded-lg border border-teal-800 px-3 py-2 font-semibold text-teal-900 hover:bg-teal-50"
                            >
                              Edit Bill
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(
                            `/receptionist/bills/${appointment._id}/new`,
                            { state: { appointment } }
                          )}
                          className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-900"
                        >
                          Create Bill
                        </button>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        )}

        {activeView === "appointments" && (
        <section id="appointment-booking" className="mt-8 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">Book an appointment</h2>
          <form onSubmit={bookAppointment} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <select required value={appointmentForm.patient} onChange={(event) => setAppointmentForm((form) => ({ ...form, patient: event.target.value }))} className="rounded-lg border border-gray-300 px-3 py-3">
              <option value="">Select patient</option>
              {patients.map((patient) => <option key={patient._id || patient.id} value={patient._id || patient.id}>{patient.name}</option>)}
            </select>
            <select required value={appointmentForm.doctor} onChange={(event) => setAppointmentForm((form) => ({ ...form, doctor: event.target.value }))} className="rounded-lg border border-gray-300 px-3 py-3">
              <option value="">Select doctor</option>
              {doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}</option>)}
            </select>
            <input required type="datetime-local" value={appointmentForm.appointmentDate} onChange={(event) => setAppointmentForm((form) => ({ ...form, appointmentDate: event.target.value }))} className="rounded-lg border border-gray-300 px-3 py-3" />
            <input required value={appointmentForm.reason} onChange={(event) => setAppointmentForm((form) => ({ ...form, reason: event.target.value }))} placeholder="Reason for visit" className="rounded-lg border border-gray-300 px-3 py-3" />
            <button disabled={saving || !patients.length || !doctors.length} className="rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white disabled:opacity-50 sm:col-span-2 lg:col-span-4">Book appointment</button>
          </form>
        </section>
        )}

        {activeView === "patients" && (
        <section id="patient-registration" className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-gray-900">Register patient</h2>
            <form onSubmit={registerPatient} className="mt-5 space-y-4">
              <input required value={patientForm.name} onChange={(event) => setPatientForm((form) => ({ ...form, name: event.target.value }))} placeholder="Full name" className="w-full rounded-lg border border-gray-300 px-3 py-3" />
              <input required type="email" value={patientForm.email} onChange={(event) => setPatientForm((form) => ({ ...form, email: event.target.value }))} placeholder="Email" className="w-full rounded-lg border border-gray-300 px-3 py-3" />
              <input required type="tel" value={patientForm.phone} onChange={(event) => setPatientForm((form) => ({ ...form, phone: event.target.value }))} placeholder="Phone" className="w-full rounded-lg border border-gray-300 px-3 py-3" />
              <input required type="password" minLength="6" value={patientForm.password} onChange={(event) => setPatientForm((form) => ({ ...form, password: event.target.value }))} placeholder="Temporary password" className="w-full rounded-lg border border-gray-300 px-3 py-3" />
              <button disabled={saving} className="rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white disabled:opacity-50">Register patient</button>
            </form>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-gray-900">Patients</h2>
            <div className="mt-4 max-h-80 divide-y divide-gray-100 overflow-y-auto">
              {patients.map((patient) => (
                <div key={patient._id || patient.id} className="flex flex-wrap justify-between gap-2 py-3">
                  <div><p className="font-semibold text-gray-900">{patient.name}</p><p className="text-sm text-gray-500">{patient.email}</p></div>
                  <p className="text-sm text-gray-600">{patient.phone}</p>
                </div>
              ))}
              {!patients.length && <p className="py-4 text-sm text-gray-500">No patients registered yet.</p>}
            </div>
          </div>
        </section>
        )}
      </div>
    </main>
  );
}

export default ReceptionistWorkspace;
