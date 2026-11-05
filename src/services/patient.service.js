import mongoose from "mongoose";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import { ApiError } from "../utils/apiError.js";

export class PatientService {
  static async createPatient(patientData) {
    if (!mongoose.Types.ObjectId.isValid(patientData.doctorId)) {
      throw ApiError.badRequest("Invalid Doctor ID format");
    }

    const doctor = await Doctor.findById(patientData.doctorId);
    if (!doctor) {
      throw ApiError.notFound("Assigned doctor not found");
    }

    const patient = await Patient.create(patientData);
    await patient.populate("doctorId", "name specialization hospital email phone");
    return patient;
  }

  static async getPatients(queryParams) {
    const {
      search,
      condition,
      doctorId,
      status,
      startDate,
      endDate,
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = queryParams;

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const filter = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { condition: searchRegex },
      ];
    }

    if (condition) {
      filter.condition = new RegExp(`^${condition.trim()}$`, "i");
    }

    if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
      filter.doctorId = new mongoose.Types.ObjectId(doctorId);
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.admissionDate = {};
      if (startDate) {
        filter.admissionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.admissionDate.$lte = end;
      }
    }

    const sortOption = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // Parallel fetch for documents and total count
    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .populate("doctorId", "name specialization hospital email phone")
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Patient.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      patients,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    };
  }

  static async getPatientById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest("Invalid Patient ID format");
    }

    const patient = await Patient.findById(id).populate(
      "doctorId",
      "name specialization hospital email phone"
    );

    if (!patient) {
      throw ApiError.notFound("Patient not found");
    }

    return patient;
  }

  static async updatePatient(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest("Invalid Patient ID format");
    }

    if (updateData.doctorId) {
      if (!mongoose.Types.ObjectId.isValid(updateData.doctorId)) {
        throw ApiError.badRequest("Invalid Doctor ID format");
      }
      const doctor = await Doctor.findById(updateData.doctorId);
      if (!doctor) {
        throw ApiError.notFound("Assigned doctor does not exist");
      }
    }

    const patient = await Patient.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("doctorId", "name specialization hospital email phone");

    if (!patient) {
      throw ApiError.notFound("Patient not found");
    }

    return patient;
  }

  static async deletePatient(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest("Invalid Patient ID format");
    }

    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      throw ApiError.notFound("Patient not found");
    }

    return { message: "Patient deleted successfully" };
  }

  static async getPatientConditions() {
    const conditions = await Patient.distinct("condition");
    return conditions;
  }
}
