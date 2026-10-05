import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

// ===============================
// Patient books appointment
// ===============================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("patient", "receptionist"),
  createAppointment
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("receptionist"),
  getAllAppointments
);

// ===============================
// Patient gets own appointments
// ===============================
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("patient"),
  getMyAppointments
);

// ===============================
// Doctor gets appointments
// ===============================
router.get(
  "/doctor",
  authMiddleware,
  roleMiddleware("doctor"),
  getDoctorAppointments
);

// ===============================
// Doctor updates appointment status
// ===============================
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("doctor", "receptionist"),
  updateAppointmentStatus
);

// IMPORTANT
export default router;