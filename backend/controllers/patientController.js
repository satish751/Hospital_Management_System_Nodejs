import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getPatientDashboard = async (req, res) => {
  try {
    const patient = await User.findOne({
      _id: req.user.userId,
      role: "patient",
    }).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({ patient });
  } catch (error) {
    console.error("Get Patient Dashboard Error:", error);
    return res.status(500).json({ message: "Unable to fetch patient profile" });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({ patients });
  } catch (error) {
    console.error("Get Patients Error:", error);
    return res.status(500).json({ message: "Unable to fetch patients" });
  }
};

export const registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email, phone and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingPatient = await User.findOne({ email: normalizedEmail });
    if (existingPatient) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const patient = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: await bcrypt.hash(password, 10),
      role: "patient",
    });

    return res.status(201).json({
      message: "Patient registered successfully",
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
      },
    });
  } catch (error) {
    console.error("Register Patient Error:", error);
    return res.status(500).json({ message: "Unable to register patient" });
  }
};
