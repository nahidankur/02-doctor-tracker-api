import { DoctorService } from "../services/doctor.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import messages from "../utils/message.json" with { type: "json" };

export class DoctorController {
  static async createDoctor(req, res, next) {
    try {
      const doctor = await DoctorService.createDoctor(req.body);
      return ApiResponse.created(res, doctor, messages.doctor.createSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async getDoctors(req, res, next) {
    try {
      const { doctors, pagination } = await DoctorService.getDoctors(req.query);
      return ApiResponse.success(
        res,
        doctors,
        messages.doctor.getAllSuccess,
        200,
        pagination
      );
    } catch (error) {
      next(error);
    }
  }

  static async getDoctorById(req, res, next) {
    try {
      const result = await DoctorService.getDoctorById(req.params.id);
      return ApiResponse.success(res, result, messages.doctor.getByIdSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async updateDoctor(req, res, next) {
    try {
      const doctor = await DoctorService.updateDoctor(req.params.id, req.body);
      return ApiResponse.success(res, doctor, messages.doctor.updateSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async deleteDoctor(req, res, next) {
    try {
      const result = await DoctorService.deleteDoctor(req.params.id);
      return ApiResponse.success(res, result, messages.doctor.deleteSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async getFilterOptions(req, res, next) {
    try {
      const options = await DoctorService.getSpecializationsAndHospitals();
      return ApiResponse.success(res, options, messages.doctor.filterOptionsSuccess);
    } catch (error) {
      next(error);
    }
  }
}
