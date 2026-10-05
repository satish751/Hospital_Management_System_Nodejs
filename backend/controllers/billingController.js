import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Bill from "../models/Bill.js";
import "../models/User.js";

const normalizeBillItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const normalizedItems = items.map((item) => {
    const quantity = Number(item?.quantity);
    const unitPrice = Number(item?.unitPrice);
    const description = item?.description?.trim();

    if (!description || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
      return null;
    }

    return {
      description,
      quantity,
      unitPrice,
      lineTotal: Math.round(quantity * unitPrice * 100) / 100,
    };
  });

  return normalizedItems.some((item) => !item) ? null : normalizedItems;
};

const summarizeBillItems = (items) => ({
  amount: Math.round(items.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100,
  description: items.map((item) => item.description).join("; "),
});

export const createBill = async (req, res) => {
  try {
    const { appointment, amount, description, items } = req.body;
    const billItems = Array.isArray(items)
      ? normalizeBillItems(items)
      : normalizeBillItems([{
          description: description?.trim() || "Healthcare services",
          quantity: 1,
          unitPrice: amount,
        }]);

    if (
      !mongoose.Types.ObjectId.isValid(appointment || "") ||
      !billItems
    ) {
      return res.status(400).json({
        message: "A valid appointment and at least one complete bill entry are required",
      });
    }

    const appointmentRecord = await Appointment.findById(appointment);
    if (!appointmentRecord) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const existingBill = await Bill.findOne({ appointment });
    if (existingBill) {
      return res.status(409).json({
        message: "A bill already exists for this appointment",
      });
    }

    const totals = summarizeBillItems(billItems);
    const bill = await Bill.create({
      appointment: appointmentRecord._id,
      patient: appointmentRecord.patient,
      receptionist: req.user.userId,
      items: billItems,
      ...totals,
    });

    return res.status(201).json({
      message: "Bill created successfully",
      bill,
    });
  } catch (error) {
    console.error("Create Bill Error:", error);
    return res.status(500).json({ message: "Unable to create bill" });
  }
};

export const updateBill = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const billItems = Array.isArray(req.body.items)
      ? normalizeBillItems(req.body.items)
      : null;

    if (!billItems) {
      return res.status(400).json({
        message: "At least one complete bill entry is required",
      });
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (bill.status !== "pending") {
      return res.status(409).json({
        message: "Only pending bills can be edited",
      });
    }

    bill.items = billItems;
    Object.assign(bill, summarizeBillItems(billItems));
    await bill.save();

    return res.status(200).json({
      message: "Bill updated successfully",
      bill,
    });
  } catch (error) {
    console.error("Update Bill Error:", error);
    return res.status(500).json({ message: "Unable to update bill" });
  }
};

export const getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ patient: req.user.userId })
      .populate("appointment", "appointmentDate reason status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ bills });
  } catch (error) {
    console.error("Get Patient Bills Error:", error);
    return res.status(500).json({ message: "Unable to fetch bills" });
  }
};

export const getBillById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const bill = await Bill.findOne({
      _id: req.params.id,
      patient: req.user.userId,
    })
      .populate("patient", "name email phone")
      .populate({
        path: "appointment",
        select: "appointmentDate reason status doctor",
        populate: {
          path: "doctor",
          select: "name email phone",
        },
      });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    return res.status(200).json({ bill });
  } catch (error) {
    console.error("Get Bill Error:", error);
    return res.status(500).json({ message: "Unable to fetch bill" });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("patient", "name email phone")
      .populate("appointment", "appointmentDate reason status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ bills });
  } catch (error) {
    console.error("Get Bills Error:", error);
    return res.status(500).json({ message: "Unable to fetch bills" });
  }
};

export const updateBillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "paid", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid bill status" });
    }

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    return res.status(200).json({
      message: "Bill status updated successfully",
      bill,
    });
  } catch (error) {
    console.error("Update Bill Status Error:", error);
    return res.status(500).json({ message: "Unable to update bill" });
  }
};
