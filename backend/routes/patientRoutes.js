import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getPatientDashboard,
  getPatients,
  registerPatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("patient"),
  getPatientDashboard
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("receptionist"),
  getPatients
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("receptionist"),
  registerPatient
);

export default router;
