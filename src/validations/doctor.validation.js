import { z } from "zod";

export const createDoctorSchema = z.object({
  name: z.string().min(2, "Doctor name must be at least 2 characters").trim(),
  specialization: z.string().min(2, "Specialization must be at least 2 characters").trim(),
  hospital: z.string().min(2, "Hospital name must be at least 2 characters").trim(),
  phone: z.string().min(6, "Valid phone number is required").trim(),
  email: z.string().email("Valid email address is required").trim().toLowerCase(),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export const doctorQuerySchema = z.object({
  search: z.string().optional(),
  specialization: z.string().optional(),
  hospital: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.enum(["name", "createdAt", "specialization", "hospital"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
