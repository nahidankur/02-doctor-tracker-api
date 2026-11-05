import { Router } from "express";
import authRoutes from "./auth.routes.js";
import doctorRoutes from "./doctor.routes.js";
import patientRoutes from "./patient.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import { ROUTES } from "../utils/routes.js";

const router = Router();

// Health Check
router.get(ROUTES.HEALTH, (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Doctor Tracker API",
    timestamp: new Date().toISOString(),
  });
});

// Mount modules
router.use(ROUTES.AUTH.ROOT, authRoutes);
router.use(ROUTES.DOCTORS.ROOT, doctorRoutes);
router.use(ROUTES.PATIENTS.ROOT, patientRoutes);
router.use(ROUTES.ANALYTICS.ROOT, analyticsRoutes);

export default router;
