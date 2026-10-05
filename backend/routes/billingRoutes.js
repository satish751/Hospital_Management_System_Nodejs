import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  createBill,
  updateBill,
  getBillById,
  getAllBills,
  getMyBills,
  updateBillStatus,
} from "../controllers/billingController.js";

const router = express.Router();

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("patient"),
  getMyBills
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("patient"),
  getBillById
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("receptionist"),
  getAllBills
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("receptionist"),
  createBill
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("receptionist"),
  updateBill
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("receptionist"),
  updateBillStatus
);

export default router;
