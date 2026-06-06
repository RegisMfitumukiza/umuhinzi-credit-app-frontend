import { z } from "zod";

const REGULATED_TYPES = ["SACCO", "MICROFINANCE", "BANK"] as const;

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?[0-9]{10,15})$/, "Invalid phone number format")
  .optional()
  .or(z.literal(""));

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const institutionBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must not exceed 150 characters"),
  type: z.enum(
    ["SACCO", "MICROFINANCE", "BANK", "NGO", "GOVERNMENT_PROGRAM", "OTHER"],
    { message: "Please select an institution type" }
  ),
  registrationNumber: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(100, "Too long")
    .optional()
    .or(z.literal("")),
  licenseNumber: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(100, "Too long")
    .optional()
    .or(z.literal("")),
  email: z.email("Invalid email").optional().or(z.literal("")),
  phone: phoneSchema,
  address: optionalText(255),
  province: optionalText(100),
  district: optionalText(100),
  sector: optionalText(100),
  cell: optionalText(100),
  village: optionalText(100),
});

export const createInstitutionSchema = institutionBaseSchema.superRefine(
  (data, ctx) => {
    if ((REGULATED_TYPES as readonly string[]).includes(data.type)) {
      if (!data.registrationNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["registrationNumber"],
          message: "Registration number is required for this institution type",
        });
      }
      if (!data.licenseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["licenseNumber"],
          message: "License number is required for this institution type",
        });
      }
    }
  }
);

export const updateInstitutionSchema = institutionBaseSchema.partial();

export type CreateInstitutionSchemaType = z.infer<typeof createInstitutionSchema>;
export type UpdateInstitutionSchemaType = z.infer<typeof updateInstitutionSchema>;
