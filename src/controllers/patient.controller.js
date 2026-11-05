import { PatientService } from "../services/patient.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import messages from "../utils/message.json" with { type: "json" };

export class PatientController {
  static async createPatient(req, res, next) {
    try {
      const patient = await PatientService.createPatient(req.body);
      return ApiResponse.created(res, patient, messages.patient.createSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async getPatients(req, res, next) {
    try {
      const { patients, pagination } = await PatientService.getPatients(req.query);
      return ApiResponse.success(
        res,
        patients,
        messages.patient.getAllSuccess,
        200,
        pagination
      );
    } catch (error) {
      next(error);
    }
  }

  static async getPatientById(req, res, next) {
    try {
      const patient = await PatientService.getPatientById(req.params.id);
      return ApiResponse.success(res, patient, messages.patient.getByIdSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async updatePatient(req, res, next) {
    try {
      const patient = await PatientService.updatePatient(req.params.id, req.body);
      return ApiResponse.success(res, patient, messages.patient.updateSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async deletePatient(req, res, next) {
    try {
      const result = await PatientService.deletePatient(req.params.id);
      return ApiResponse.success(res, result, messages.patient.deleteSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async getConditions(req, res, next) {
    try {
      const conditions = await PatientService.getPatientConditions();
      return ApiResponse.success(res, conditions, messages.patient.conditionsSuccess);
    } catch (error) {
      next(error);
    }
  }
}
