import { z } from "zod";

export const createMarketPriceSchema = z.object({
  cropName: z.string().trim().min(1, "Crop name is required").max(100),

  marketLocation: z.string().trim().min(1, "Market location is required").max(200),

  pricePerUnit: z
    .number({ message: "Enter a valid price" })
    .positive("Must be greater than 0"),

  unit: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .optional()
    .or(z.literal("")),

  recordedAt: z.string().optional(),
});

export const updateMarketPriceSchema = createMarketPriceSchema.partial();

export type CreateMarketPriceSchemaType = z.infer<typeof createMarketPriceSchema>;
export type UpdateMarketPriceSchemaType = z.infer<typeof updateMarketPriceSchema>;
