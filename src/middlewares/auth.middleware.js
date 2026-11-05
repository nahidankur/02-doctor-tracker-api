import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.doctor_tracker_token || req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      throw ApiError.unauthorized("Authentication token is required");
    }

    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw ApiError.unauthorized("User session expired or user no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(ApiError.unauthorized("Invalid authorization token"));
      return;
    }
    if (error.name === "TokenExpiredError") {
      next(ApiError.unauthorized("Authorization token has expired"));
      return;
    }
    next(error);
  }
};
