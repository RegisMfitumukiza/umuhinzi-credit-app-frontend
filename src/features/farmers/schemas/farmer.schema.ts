import { z } from "zod";

const rwandaNationalIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{16}$/, "National ID must be exactly 16 digits");

export const createFarmerSchema = z.object({
  nationalId: rwandaNationalIdSchema,

  dateOfBirth: z.string().optional(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  farmingExperienceYears: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().min(0, "Cannot be negative").max(80, "Too high").optional()
  ),

  primaryCrop: z
    .string()
    .trim()
    .min(2, "At least 2 characters")
    .max(100, "Too long")
    .optional()
    .or(z.literal("")),
});

export const updateFarmerSchema = z.object({
  nationalId: rwandaNationalIdSchema.optional(),

  dateOfBirth: z.string().optional(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  farmingExperienceYears: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().min(0, "Cannot be negative").max(80, "Too high").optional()
  ),

  primaryCrop: z
    .string()
    .trim()
    .min(2, "At least 2 characters")
    .max(100, "Too long")
    .optional()
    .or(z.literal("")),
});

export type CreateFarmerSchemaType = z.infer<typeof createFarmerSchema>;
export type UpdateFarmerSchemaType = z.infer<typeof updateFarmerSchema>;
