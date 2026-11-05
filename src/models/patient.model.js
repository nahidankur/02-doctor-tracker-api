import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: [true, "Patient age is required"],
      min: [0, "Age cannot be negative"],
      max: [130, "Age is out of range"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, "Medical condition / diagnosis is required"],
      trim: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Assigned doctor is required"],
      index: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Under Observation", "Recovered", "Discharged"],
      default: "Active",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
patientSchema.index({ name: "text", phone: "text" });
patientSchema.index({ doctorId: 1, status: 1, admissionDate: -1 });
patientSchema.index({ condition: 1, admissionDate: -1 });

export const Patient = mongoose.model("Patient", patientSchema);
