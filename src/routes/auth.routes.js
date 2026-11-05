import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { ROUTES } from "../utils/routes.js";

const router = Router();

router.post(ROUTES.AUTH.LOGIN, validateRequest(loginSchema), AuthController.login);
router.post(ROUTES.AUTH.REGISTER, validateRequest(registerSchema), AuthController.register);
router.post(ROUTES.AUTH.LOGOUT, AuthController.logout);
router.get(ROUTES.AUTH.ME, authenticate, AuthController.getMe);

export default router;
