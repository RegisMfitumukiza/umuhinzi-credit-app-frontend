import { z } from "zod";

const optionalStr = (max = 100) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const optionalNum = (min: number, max: number) =>
  z.number().min(min).max(max).optional();

export const createFarmSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "At least 2 characters")
      .max(150, "Too long"),

    landSize: z
      .number({ message: "Enter a valid number" })
      .positive("Must be greater than 0")
      .max(100_000, "Too large"),

    district: z.string().trim().min(2, "District is required").max(100),

    description: optionalStr(500),

    landUnit: z.enum(["HECTARE", "ACRE", "SQUARE_METER"]).default("HECTARE"),

    ownershipType: z
      .enum([
        "OWNED",
        "RENTED",
        "FAMILY_LAND",
        "COOPERATIVE_LAND",
        "GOVERNMENT_ALLOCATED",
        "OTHER",
      ])
      .default("OWNED"),

    soilType: z
      .enum(["CLAY", "SANDY", "SILT", "LOAM", "PEAT", "CHALKY", "UNKNOWN"])
      .default("UNKNOWN"),

    province: optionalStr(),
    sector: optionalStr(),
    cell: optionalStr(),
    village: optionalStr(),

    latitude: optionalNum(-90, 90),
    longitude: optionalNum(-180, 180),
  })
  .refine((d) => !(d.latitude !== undefined && d.longitude === undefined), {
    message: "Longitude is required when latitude is provided",
    path: ["longitude"],
  })
  .refine((d) => !(d.longitude !== undefined && d.latitude === undefined), {
    message: "Latitude is required when longitude is provided",
    path: ["latitude"],
  });

export const updateFarmSchema = z
  .object({
    name: z.string().trim().min(2).max(150).optional(),
    landSize: z.number().positive().max(100_000).optional(),
    district: z.string().trim().min(2).max(100).optional(),
    description: optionalStr(500),
    landUnit: z.enum(["HECTARE", "ACRE", "SQUARE_METER"]).optional(),
    ownershipType: z
      .enum([
        "OWNED",
        "RENTED",
        "FAMILY_LAND",
        "COOPERATIVE_LAND",
        "GOVERNMENT_ALLOCATED",
        "OTHER",
      ])
      .optional(),
    soilType: z
      .enum(["CLAY", "SANDY", "SILT", "LOAM", "PEAT", "CHALKY", "UNKNOWN"])
      .optional(),
    province: optionalStr(),
    sector: optionalStr(),
    cell: optionalStr(),
    village: optionalStr(),
    latitude: optionalNum(-90, 90),
    longitude: optionalNum(-180, 180),
  })
  .refine((d) => !(d.latitude !== undefined && d.longitude === undefined), {
    message: "Longitude is required when latitude is provided",
    path: ["longitude"],
  })
  .refine((d) => !(d.longitude !== undefined && d.latitude === undefined), {
    message: "Latitude is required when longitude is provided",
    path: ["latitude"],
  });

export type CreateFarmSchemaType = z.infer<typeof createFarmSchema>;
export type UpdateFarmSchemaType = z.infer<typeof updateFarmSchema>;
