import mongoose from "mongoose";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { ApiError } from "../utils/apiError.js";

export class DoctorService {
  static async createDoctor(doctorData) {
    const existing = await Doctor.findOne({ email: doctorData.email.toLowerCase() });
    if (existing) {
      throw ApiError.conflict("A doctor with this email address already exists");
    }

    const doctor = await Doctor.create({
      ...doctorData,
      email: doctorData.email.toLowerCase(),
    });

    return doctor;
  }

  static async getDoctors(queryParams) {
    const {
      search,
      specialization,
      hospital,
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

    // Build Match Filter
    const matchFilter = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      matchFilter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { hospital: searchRegex },
        { specialization: searchRegex },
      ];
    }

    if (specialization) {
      matchFilter.specialization = new RegExp(`^${specialization.trim()}$`, "i");
    }

    if (hospital) {
      matchFilter.hospital = new RegExp(`^${hospital.trim()}$`, "i");
    }

    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) {
        matchFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchFilter.createdAt.$lte = end;
      }
    }

    // High performance Aggregation with $lookup for patient count
    const sortStage = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const pipeline = [
      { $match: matchFilter },
      {
        $lookup: {
          from: "patients",
          localField: "_id",
          foreignField: "doctorId",
          as: "patientsList",
        },
      },
      {
        $addFields: {
          patientCount: { $size: "$patientsList" },
        },
      },
      {
        $project: {
          patientsList: 0,
        },
      },
      { $sort: sortStage },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: pageSize }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await Doctor.aggregate(pipeline);
    const data = result?.data || [];
    const total = result?.totalCount?.[0]?.count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      doctors: data,
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

  static async getDoctorById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest("Invalid Doctor ID format");
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      throw ApiError.notFound("Doctor not found");
    }

    // Retrieve corresponding patients for this doctor
    const patients = await Patient.find({ doctorId: id }).sort({ admissionDate: -1, createdAt: -1 });

    return {
      doctor,
      patients,
      totalPatients: patients.length,
    };
  }

  static async updateDoctor(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest("Invalid Doctor ID format");
    }

    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
      const existing = await Doctor.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existing) {
        throw ApiError.conflict("Another doctor already exists with this email");
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      throw ApiError.notFound("Doctor not found");
    }

    return doctor;
  }

  static async deleteDoctor(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest("Invalid Doctor ID format");
    }

    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      throw ApiError.notFound("Doctor not found");
    }

    // Delete or cascade assigned patients as per project requirements
    await Patient.deleteMany({ doctorId: id });

    return { message: "Doctor and associated patient records deleted successfully" };
  }

  static async getSpecializationsAndHospitals() {
    const specializations = await Doctor.distinct("specialization");
    const hospitals = await Doctor.distinct("hospital");
    return { specializations, hospitals };
  }
}
