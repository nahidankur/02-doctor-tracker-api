import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

export const validateRequest = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        next(ApiError.badRequest("Validation failed", formattedErrors));
        return;
      }
      next(error);
    }
  };
};
