import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  createPrescription,
  updatePrescription,
  getMyPrescriptions,
  getDoctorPrescriptions,
  getPrescriptionById,
} from "../controllers/prescriptionController.js";

const router = express.Router();

// Doctor creates prescription
router.post(
  "/",
  authMiddleware,
  roleMiddleware("doctor"),
  createPrescription
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("doctor"),
  updatePrescription
);

// Patient gets own prescriptions
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("patient"),
  getMyPrescriptions
);

// Doctor gets prescriptions they created
router.get(
  "/doctor",
  authMiddleware,
  roleMiddleware("doctor"),
  getDoctorPrescriptions
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("patient", "doctor"),
  getPrescriptionById
);

export default router;