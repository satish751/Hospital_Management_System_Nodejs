import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const emptyMedicine = {
  medicine: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

function Prescription() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const appointment = state?.appointment;
  const existingPrescription = state?.prescription;
  const patient = appointment?.patient;

  const patientId =
    typeof patient === "string"
      ? patient
      : patient?._id || patient?.id || "";

  const doctorName = state?.doctorName || "Doctor";

  const [medicines, setMedicines] = useState(() =>
    existingPrescription?.medicines?.length
      ? existingPrescription.medicines.map((medicine) => ({
          medicine: medicine.name || "",
          dosage: medicine.dosage || "",
          frequency: medicine.frequency || "",
          duration: medicine.duration || "",
          instructions: medicine.instructions || "",
        }))
        : []
  );
      const [medicineDraft, setMedicineDraft] = useState(emptyMedicine);
      const [editingMedicineIndex, setEditingMedicineIndex] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const saveMedicineEntry = () => {
    const entry = {
      medicine: medicineDraft.medicine.trim(),
      dosage: medicineDraft.dosage.trim(),
      frequency: medicineDraft.frequency,
      duration: medicineDraft.duration.trim(),
      instructions: medicineDraft.instructions.trim(),
    };

    if (!entry.medicine || !entry.dosage || !entry.frequency || !entry.duration) {
      setSaveError("Complete the medicine, dosage, frequency, and duration fields.");
      return;
    }

    setMedicines((currentMedicines) => editingMedicineIndex === null
      ? [...currentMedicines, entry]
      : currentMedicines.map((medicine, index) =>
          index === editingMedicineIndex ? entry : medicine
        )
    );
    setMedicineDraft(emptyMedicine);
    setEditingMedicineIndex(null);
    setSaveError("");
  };

  const editMedicineEntry = (index) => {
    setMedicineDraft({ ...medicines[index] });
    setEditingMedicineIndex(index);
    setSaveError("");
  };

  const cancelMedicineEdit = () => {
    setMedicineDraft(emptyMedicine);
    setEditingMedicineIndex(null);
    setSaveError("");
  };

  const deleteMedicineEntry = (index) => {
    setMedicines((currentMedicines) => currentMedicines.filter((_, itemIndex) => itemIndex !== index));
    if (editingMedicineIndex === index) {
      cancelMedicineEdit();
    } else if (editingMedicineIndex !== null && editingMedicineIndex > index) {
      setEditingMedicineIndex(editingMedicineIndex - 1);
    }
  };

  // Create prescription
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaveError("");
    setSaveSuccess("");

    if (!appointment?._id) {
      setSaveError(
        "Appointment information is missing."
      );
      return;
    }

    if (!patientId) {
      setSaveError(
        "Patient information is missing."
      );
      return;
    }

    const formData = new FormData(e.target);

    const diagnosis =
      formData.get("diagnosis")?.trim();

    const prescriptionDate =
      formData.get("date");

    const notes =
      formData.get("notes")?.trim();

    if (!diagnosis) {
      setSaveError("Please enter diagnosis.");
      return;
    }

    // Prepare medicines according to Prescription model
    const validMedicines = medicines
      .filter(
        (medicine) =>
          medicine.medicine.trim() !== ""
      )
      .map((medicine) => ({
        name: medicine.medicine.trim(),
        dosage: medicine.dosage.trim(),
        frequency: medicine.frequency,
        duration: medicine.duration.trim(),
        instructions:
          medicine.instructions.trim(),
      }));

    if (validMedicines.length === 0) {
      setSaveError(
        "Please add at least one medicine."
      );
      return;
    }

    // Check required medicine fields
    const invalidMedicine = validMedicines.some(
      (medicine) =>
        !medicine.name ||
        !medicine.dosage ||
        !medicine.frequency ||
        !medicine.duration
    );

    if (invalidMedicine) {
      setSaveError(
        "Please complete all required medicine fields."
      );
      return;
    }

    const prescriptionData = {
      patient: patientId,
      appointment: appointment._id,
      diagnosis,
      prescriptionDate,
      medicines: validMedicines,
      notes,
    };

    console.log(
      "PRESCRIPTION DATA:",
      prescriptionData
    );

    try {
      setIsSaving(true);

      const response = existingPrescription
        ? await api.put(
            `/prescriptions/${existingPrescription._id}`,
            prescriptionData
          )
        : await api.post("/prescriptions", prescriptionData);

      console.log(
        "PRESCRIPTION RESPONSE:",
        response.data
      );

      setSaveSuccess(
        response.data.message ||
          (existingPrescription
            ? "Prescription updated successfully."
            : "Prescription created successfully.")
      );

      if (!existingPrescription) {
        setMedicines([
          {
            medicine: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
          },
        ]);

        e.target.reset();
      }
    } catch (error) {
      console.log(
        "Prescription Error:",
        error.response?.data || error.message
      );

      setSaveError(
        error.response?.data?.message ||
          "Unable to create prescription."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // If page opened directly without appointment
  if (!appointment?._id) {
    return (
      <div className="min-h-screen bg-green-50 px-6 pb-12 pt-28">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">

            <div className="text-5xl">
              📋
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              No Appointment Selected
            </h1>

            <p className="mt-2 text-gray-500">
              Please create a prescription from a
              patient appointment.
            </p>

            <button
              onClick={() =>
                navigate("/doctor-dashboard")
              }
              className="mt-6 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
            >
              Back to Dashboard
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 px-6 pb-12 pt-28">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">

          <p className="font-semibold uppercase tracking-wider text-teal-600">
            MediCare
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            {existingPrescription ? "Update Prescription" : "Create Prescription"}
          </h1>

          <p className="mt-2 text-gray-500">
            {existingPrescription
              ? "Update the prescription for this appointment."
              : "Create a prescription for this appointment."}
          </p>

        </div>

        {/* Appointment Information */}
        <div className="mb-6 rounded-2xl border border-teal-100 bg-teal-50 p-6">

          <h2 className="text-xl font-bold text-gray-900">
            Appointment Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            {/* Patient */}
            <div>
              <p className="text-sm text-gray-500">
                Patient
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {patient?.name || "Patient"}
              </p>
            </div>

            {/* Appointment Date */}
            <div>
              <p className="text-sm text-gray-500">
                Appointment Date
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {new Date(
                  appointment.appointmentDate
                ).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Doctor */}
            <div>
              <p className="text-sm text-gray-500">
                Doctor
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {doctorName}
              </p>
            </div>

          </div>

          {/* Reason */}
          <div className="mt-5">
            <p className="text-sm text-gray-500">
              Reason for Visit
            </p>

            <p className="mt-1 font-semibold text-gray-800">
              {appointment.reason}
            </p>
          </div>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-8 shadow-xl md:p-10"
        >

          {/* Patient Information */}
          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Patient Information
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* Patient Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Patient Name
                </label>

                <input
                  type="text"
                  value={patient?.name || ""}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none"
                />
              </div>

              {/* Patient ID */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Patient ID
                </label>

                <input
                  type="text"
                  value={patientId}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Patient Email
                </label>

                <input
                  type="email"
                  value={patient?.email || ""}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Patient Phone
                </label>

                <input
                  type="text"
                  value={patient?.phone || ""}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none"
                />
              </div>

              {/* Doctor */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Doctor Name
                </label>

                <input
                  type="text"
                  value={doctorName}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none"
                />
              </div>

              {/* Prescription Date */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Prescription Date
                </label>

                <input
                  name="date"
                  type="date"
                  defaultValue={
                    existingPrescription?.prescriptionDate
                      ? new Date(existingPrescription.prescriptionDate)
                          .toISOString()
                          .split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

            </div>

          </div>

          {/* Diagnosis */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold text-gray-900">
              Diagnosis
            </h2>

            <textarea
              name="diagnosis"
              defaultValue={existingPrescription?.diagnosis || ""}
              required
              rows="4"
              placeholder="Enter diagnosis / medical condition"
              className="mt-5 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

          </div>

          {/* Medicines */}
          <div className="mt-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Medicines</h2>
              <p className="mt-1 text-sm text-gray-500">Enter one medicine, save it, then add the next row.</p>
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="grid min-w-[1000px] grid-cols-[1.2fr_0.8fr_1fr_0.8fr_1.2fr_auto] items-end gap-3">
                <div>
                  <label htmlFor="medicine-draft-name" className="mb-2 block text-sm font-semibold text-gray-700">Medicine</label>
                  <input
                    id="medicine-draft-name"
                    value={medicineDraft.medicine}
                    onChange={(event) => setMedicineDraft((draft) => ({ ...draft, medicine: event.target.value }))}
                    placeholder="e.g. Paracetamol"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="medicine-draft-dosage" className="mb-2 block text-sm font-semibold text-gray-700">Dosage</label>
                  <input
                    id="medicine-draft-dosage"
                    value={medicineDraft.dosage}
                    onChange={(event) => setMedicineDraft((draft) => ({ ...draft, dosage: event.target.value }))}
                    placeholder="e.g. 500mg"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="medicine-draft-frequency" className="mb-2 block text-sm font-semibold text-gray-700">Frequency</label>
                  <select
                    id="medicine-draft-frequency"
                    value={medicineDraft.frequency}
                    onChange={(event) => setMedicineDraft((draft) => ({ ...draft, frequency: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="">Select frequency</option>
                    <option value="Once a day">Once a day</option>
                    <option value="Twice a day">Twice a day</option>
                    <option value="Thrice a day">Thrice a day</option>
                    <option value="Before meals">Before meals</option>
                    <option value="After meals">After meals</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="medicine-draft-duration" className="mb-2 block text-sm font-semibold text-gray-700">Duration</label>
                  <input
                    id="medicine-draft-duration"
                    value={medicineDraft.duration}
                    onChange={(event) => setMedicineDraft((draft) => ({ ...draft, duration: event.target.value }))}
                    placeholder="e.g. 5 days"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="medicine-draft-instructions" className="mb-2 block text-sm font-semibold text-gray-700">Instructions</label>
                  <input
                    id="medicine-draft-instructions"
                    value={medicineDraft.instructions}
                    onChange={(event) => setMedicineDraft((draft) => ({ ...draft, instructions: event.target.value }))}
                    placeholder="After food"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveMedicineEntry}
                    className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
                  >
                    {editingMedicineIndex === null ? "Save" : "Update"}
                  </button>
                  {editingMedicineIndex !== null && (
                    <button
                      type="button"
                      onClick={cancelMedicineEdit}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left text-sm text-gray-600">
                    <th className="px-3 py-3 font-semibold">#</th>
                    <th className="px-3 py-3 font-semibold">Medicine</th>
                    <th className="px-3 py-3 font-semibold">Dosage</th>
                    <th className="px-3 py-3 font-semibold">Frequency</th>
                    <th className="px-3 py-3 font-semibold">Duration</th>
                    <th className="px-3 py-3 font-semibold">Instructions</th>
                    <th className="px-3 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.length === 0 ? (
                    <tr className="border-t border-gray-200">
                      <td colSpan="7" className="px-4 py-5 text-sm text-gray-500">No medicines added yet.</td>
                    </tr>
                  ) : medicines.map((medicine, index) => (
                    <tr key={`${medicine.medicine}-${index}`} className="border-t border-gray-200 text-sm">
                      <td className="px-3 py-3">{index + 1}</td>
                      <td className="px-3 py-3 font-semibold text-gray-900">{medicine.medicine}</td>
                      <td className="px-3 py-3">{medicine.dosage}</td>
                      <td className="px-3 py-3">{medicine.frequency}</td>
                      <td className="px-3 py-3">{medicine.duration}</td>
                      <td className="px-3 py-3">{medicine.instructions || "—"}</td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => editMedicineEntry(index)}
                            className="font-semibold text-teal-800 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMedicineEntry(index)}
                            className="font-semibold text-red-700 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Notes */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold text-gray-900">
              Notes
            </h2>

            <textarea
              name="notes"
              defaultValue={existingPrescription?.notes || ""}
              rows="4"
              placeholder="Enter additional notes"
              className="mt-5 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

          </div>

          {/* Messages */}
          {saveError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {saveError}
            </div>
          )}

          {saveSuccess && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              {saveSuccess}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 border-t border-gray-100 pt-8 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/doctor-dashboard")
              }
              disabled={isSaving}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-teal-600 px-7 py-3 font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? existingPrescription
                  ? "Updating..."
                  : "Creating..."
                : existingPrescription
                  ? "Update Prescription"
                  : "💊 Create Prescription"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default Prescription;