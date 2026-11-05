import { Router } from "express";
import { DoctorController } from "../controllers/doctor.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  createDoctorSchema,
  updateDoctorSchema,
  doctorQuerySchema,
} from "../validations/doctor.validation.js";
import { ROUTES } from "../utils/routes.js";

const router = Router();

// Protect all doctor routes with JWT authentication
router.use(authenticate);

router.get(ROUTES.DOCTORS.FILTERS, DoctorController.getFilterOptions);
router.get(ROUTES.DOCTORS.BASE, validateRequest(doctorQuerySchema, "query"), DoctorController.getDoctors);
router.post(ROUTES.DOCTORS.BASE, validateRequest(createDoctorSchema), DoctorController.createDoctor);
router.get(ROUTES.DOCTORS.BY_ID, DoctorController.getDoctorById);
router.put(ROUTES.DOCTORS.BY_ID, validateRequest(updateDoctorSchema), DoctorController.updateDoctor);
router.delete(ROUTES.DOCTORS.BY_ID, DoctorController.deleteDoctor);

export default router;
