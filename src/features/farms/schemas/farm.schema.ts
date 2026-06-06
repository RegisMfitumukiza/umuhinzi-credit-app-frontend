import { z } from "zod";

const numericField = (label: string, min: number, max: number) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number({ invalid_type_error: `${label} must be a number` })
      .min(min, `${label}: minimum is ${min}`)
      .max(max, `${label}: maximum is ${max}`)
      .optional()
  );

const optionalStr = (max = 100) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const createFarmSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "At least 2 characters")
      .max(150, "Too long"),

    landSize: z.preprocess(
      (v) => (v === "" ? undefined : Number(v)),
      z
        .number({ invalid_type_error: "Enter a valid number" })
        .positive("Must be greater than 0")
        .max(100_000, "Too large")
    ),

    district: z
      .string()
      .trim()
      .min(2, "District is required")
      .max(100),

    description: optionalStr(500),

    landUnit: z
      .enum(["HECTARE", "ACRE", "SQUARE_METER"])
      .default("HECTARE"),

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

    latitude: numericField("Latitude", -90, 90),
    longitude: numericField("Longitude", -180, 180),
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
    landSize: numericField("Land size", 0.001, 100_000),
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
    latitude: numericField("Latitude", -90, 90),
    longitude: numericField("Longitude", -180, 180),
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
