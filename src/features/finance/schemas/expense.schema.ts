import { z } from "zod";

const EXPENSE_TYPES = [
  "SEED", "FERTILIZER", "PESTICIDE", "HERBICIDE", "LABOR",
  "IRRIGATION", "TRANSPORT", "EQUIPMENT", "STORAGE", "RENT",
  "LOAN_REPAYMENT", "OTHER",
] as const;

export const createExpenseSchema = z.object({
  type: z.enum(EXPENSE_TYPES, { message: "Select an expense type" }),

  amount: z
    .number({ message: "Enter a valid amount" })
    .positive("Must be greater than 0"),

  expenseDate: z.string().min(1, "Date is required"),

  description: z
    .string()
    .trim()
    .max(500, "Max 500 characters")
    .optional()
    .or(z.literal("")),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseSchemaType = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseSchemaType = z.infer<typeof updateExpenseSchema>;
