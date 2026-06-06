import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?[0-9]{10,15})$/, "Invalid phone number format")
  .optional()
  .or(z.literal(""));

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  phone: phoneSchema,
  province: optionalText(100),
  district: optionalText(100),
  sector: optionalText(100),
  cell: optionalText(100),
  village: optionalText(100),
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
