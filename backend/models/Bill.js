import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      unique: true,
      default: () => `MC-${Date.now()}`,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    receptionist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    items: [
      {
        description: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          min: 0.01,
          required: true,
        },
        unitPrice: {
          type: Number,
          min: 0,
          required: true,
        },
        lineTotal: {
          type: Number,
          min: 0,
          required: true,
        },
      },
    ],
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billSchema);

export default Bill;
