import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { ROUTES } from "../utils/routes.js";

const router = Router();

// Protect dashboard analytics with JWT authentication
router.use(authenticate);

router.get(ROUTES.ANALYTICS.DASHBOARD, AnalyticsController.getDashboard);

export default router;
