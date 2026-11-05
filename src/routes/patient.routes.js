import { Router } from "express";
import { PatientController } from "../controllers/patient.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  createPatientSchema,
  updatePatientSchema,
  patientQuerySchema,
} from "../validations/patient.validation.js";
import { ROUTES } from "../utils/routes.js";

const router = Router();

// Protect all patient routes with JWT authentication
router.use(authenticate);

router.get(ROUTES.PATIENTS.CONDITIONS, PatientController.getConditions);
router.get(ROUTES.PATIENTS.BASE, validateRequest(patientQuerySchema, "query"), PatientController.getPatients);
router.post(ROUTES.PATIENTS.BASE, validateRequest(createPatientSchema), PatientController.createPatient);
router.get(ROUTES.PATIENTS.BY_ID, PatientController.getPatientById);
router.put(ROUTES.PATIENTS.BY_ID, validateRequest(updatePatientSchema), PatientController.updatePatient);
router.delete(ROUTES.PATIENTS.BY_ID, PatientController.deletePatient);

export default router;
