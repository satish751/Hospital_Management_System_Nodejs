import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";
import User from "../models/User.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, reason } = req.body;
    const patientId = req.user.role === "patient"
      ? req.user.userId
      : req.body.patient;

    if (
      !mongoose.Types.ObjectId.isValid(doctor || "") ||
      !mongoose.Types.ObjectId.isValid(patientId || "") ||
      !appointmentDate ||
      Number.isNaN(new Date(appointmentDate).getTime()) ||
      !reason?.trim()
    ) {
      return res.status(400).json({
        message: "Patient, doctor, appointment date and reason are required",
      });
    }

    const [patient, doctorUser] = await Promise.all([
      User.findOne({ _id: patientId, role: "patient" }),
      User.findOne({ _id: doctor, role: "doctor" }),
    ]);

    if (!patient || !doctorUser) {
      return res.status(404).json({
        message: "Patient or doctor not found",
      });
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor,
      appointmentDate,
      reason: reason.trim(),
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.userId,
    })
      .populate("doctor", "name email phone")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.userId,
    })
      .populate("patient", "name email phone")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      message: "Doctor appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    console.error("Get Doctor Appointments Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update appointment status by doctor
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email phone")
      .populate("doctor", "name email phone")
      .sort({ appointmentDate: 1 });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Get All Appointments Error:", error);
    res.status(500).json({ message: "Unable to fetch appointments" });
  }
};

// Update appointment status by doctor
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    const query = { _id: id };
    if (req.user.role === "doctor") {
      query.doctor = req.user.userId;
    }

    const appointment = await Appointment.findOne(query);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Update Appointment Status Error:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};