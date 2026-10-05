import Prescription from "../models/Prescription.js";
import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";
import "../models/User.js";

// Create Prescription
export const createPrescription = async (req, res) => {
  try {
    const {
      appointment,
      diagnosis,
      medicines,
      notes,
      prescriptionDate,
    } = req.body;

    if (
      !appointment ||
      !mongoose.Types.ObjectId.isValid(appointment) ||
      typeof diagnosis !== "string" ||
      !diagnosis.trim() ||
      !Array.isArray(medicines) ||
      medicines.length === 0 ||
      medicines.some((medicine) =>
        !medicine ||
        ["name", "dosage", "frequency", "duration"].some(
          (field) =>
            typeof medicine[field] !== "string" ||
            !medicine[field].trim()
        )
      )
    ) {
      return res.status(400).json({
        message:
          "Appointment, diagnosis and complete medicine details are required",
      });
    }

    const appointmentRecord = await Appointment.findOne({
      _id: appointment,
      doctor: req.user.userId,
    });

    if (!appointmentRecord) {
      return res.status(404).json({
        message: "Appointment not found for this doctor",
      });
    }

    const prescription = await Prescription.create({
      patient: appointmentRecord.patient,
      doctor: req.user.userId,
      appointment: appointmentRecord._id,
      diagnosis: diagnosis.trim(),
      prescriptionDate,
      medicines,
      notes,
    });

    res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Create Prescription Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get My Prescriptions
export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patient: req.user.userId,
    })
      .populate("doctor", "name email phone")
      .populate(
        "appointment",
        "appointmentDate reason status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Prescriptions fetched successfully",
      prescriptions,
    });
  } catch (error) {
    console.error("Get Prescriptions Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get prescriptions created by the logged-in doctor
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      doctor: req.user.userId,
    })
      .populate("patient", "name email phone")
      .populate("appointment", "appointmentDate reason status")
      .sort({ prescriptionDate: -1, createdAt: -1 });

    res.status(200).json({
      message: "Prescriptions fetched successfully",
      prescriptions,
    });
  } catch (error) {
    console.error("Get Doctor Prescriptions Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name email phone")
      .populate("appointment", "appointmentDate reason status");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const userId = req.user.userId.toString();
    const canView =
      (req.user.role === "patient" && prescription.patient._id.toString() === userId) ||
      (req.user.role === "doctor" && prescription.doctor._id.toString() === userId);

    if (!canView) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    return res.status(200).json({ prescription });
  } catch (error) {
    console.error("Get Prescription Error:", error);
    return res.status(500).json({ message: "Unable to fetch prescription" });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const { diagnosis, medicines, notes, prescriptionDate } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(req.params.id) ||
      typeof diagnosis !== "string" ||
      !diagnosis.trim() ||
      !Array.isArray(medicines) ||
      medicines.length === 0 ||
      medicines.some((medicine) =>
        !medicine ||
        ["name", "dosage", "frequency", "duration"].some(
          (field) =>
            typeof medicine[field] !== "string" ||
            !medicine[field].trim()
        )
      )
    ) {
      return res.status(400).json({
        message: "Diagnosis and complete medicine details are required",
      });
    }

    const prescription = await Prescription.findOneAndUpdate(
      {
        _id: req.params.id,
        doctor: req.user.userId,
      },
      {
        diagnosis: diagnosis.trim(),
        prescriptionDate,
        medicines: medicines.map((medicine) => ({
          name: medicine.name.trim(),
          dosage: medicine.dosage.trim(),
          frequency: medicine.frequency.trim(),
          duration: medicine.duration.trim(),
          instructions: medicine.instructions?.trim() || "",
        })),
        notes: typeof notes === "string" ? notes.trim() : "",
      },
      { new: true, runValidators: true }
    )
      .populate("patient", "name email phone")
      .populate("doctor", "name email phone")
      .populate("appointment", "appointmentDate reason status");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    return res.status(200).json({
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    console.error("Update Prescription Error:", error);
    return res.status(500).json({ message: "Unable to update prescription" });
  }
};