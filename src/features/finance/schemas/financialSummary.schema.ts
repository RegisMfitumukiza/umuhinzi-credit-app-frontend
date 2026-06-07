import { z } from "zod";

export const createFinancialSummarySchema = z.object({
  seasonId: z.string().uuid("Select a valid season"),

  totalIncome: z
    .number({ message: "Enter a valid amount" })
    .min(0, "Must be 0 or greater")
    .optional(),

  totalExpenses: z
    .number({ message: "Enter a valid amount" })
    .min(0, "Must be 0 or greater")
    .optional(),

  notes: z
    .string()
    .trim()
    .max(500, "Max 500 characters")
    .optional()
    .or(z.literal("")),
});

export const updateFinancialSummarySchema = z.object({
  totalIncome: z
    .number({ message: "Enter a valid amount" })
    .min(0, "Must be 0 or greater")
    .optional(),

  totalExpenses: z
    .number({ message: "Enter a valid amount" })
    .min(0, "Must be 0 or greater")
    .optional(),

  notes: z
    .string()
    .trim()
    .max(500, "Max 500 characters")
    .optional()
    .or(z.literal("")),
});

export type CreateFinancialSummarySchemaType = z.infer<typeof createFinancialSummarySchema>;
export type UpdateFinancialSummarySchemaType = z.infer<typeof updateFinancialSummarySchema>;
