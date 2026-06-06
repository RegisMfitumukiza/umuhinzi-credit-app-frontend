import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?[0-9]{10,15})$/, "Invalid phone number format")
  .optional()
  .or(z.literal(""));

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const createCooperativeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must not exceed 150 characters"),

  registrationNumber: z
    .string()
    .trim()
    .min(3, "Registration number must be at least 3 characters")
    .max(100, "Registration number must not exceed 100 characters"),

  description: optionalText(500),
  email: z.email("Invalid email").optional().or(z.literal("")),
  phone: phoneSchema,
  address: optionalText(255),
  province: optionalText(100),
  district: optionalText(100),
  sector: optionalText(100),
  cell: optionalText(100),
  village: optionalText(100),
});

export const updateCooperativeSchema = createCooperativeSchema.partial();

export const addMemberSchema = z.object({
  farmerId: z.uuid("Invalid farmer ID — paste the farmer's exact UUID"),
});

export type CreateCooperativeSchemaType = z.infer<typeof createCooperativeSchema>;
export type UpdateCooperativeSchemaType = z.infer<typeof updateCooperativeSchema>;
export type AddMemberSchemaType = z.infer<typeof addMemberSchema>;
