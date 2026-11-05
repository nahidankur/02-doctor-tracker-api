import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().min(2, "Patient name must be at least 2 characters").trim(),
  age: z.number().int().min(0, "Age must be positive").max(130, "Invalid age"),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(6, "Valid phone number is required").trim(),
  condition: z.string().min(2, "Condition/Diagnosis is required").trim(),
  doctorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Valid Doctor ID is required"),
  admissionDate: z.string().optional(),
  status: z.enum(["Active", "Under Observation", "Recovered", "Discharged"]).optional(),
  notes: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const patientQuerySchema = z.object({
  search: z.string().optional(),
  condition: z.string().optional(),
  doctorId: z.string().optional(),
  status: z.enum(["Active", "Under Observation", "Recovered", "Discharged"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.enum(["name", "age", "admissionDate", "createdAt", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
