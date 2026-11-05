import { AuthService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import messages from "../utils/message.json" with { type: "json" };

const COOKIE_NAME = "doctor_tracker_token";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.cookie(COOKIE_NAME, result.token, getCookieOptions());

      return ApiResponse.success(res, result, messages.auth.loginSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register(name, email, password);

      res.cookie(COOKIE_NAME, result.token, getCookieOptions());

      return ApiResponse.created(res, result, messages.auth.registerSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      return ApiResponse.success(res, req.user, messages.auth.profileSuccess);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });
      return ApiResponse.success(res, null, messages.auth.logoutSuccess);
    } catch (error) {
      next(error);
    }
  }
}
