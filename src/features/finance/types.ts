/* ─── Shared ─── */

export type FinancePagination = {
  page: number;
  total: number;
  limit: number;
  skip: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/* ─── Farm Expenses ─── */

export type ExpenseType =
  | "SEED"
  | "FERTILIZER"
  | "PESTICIDE"
  | "HERBICIDE"
  | "LABOR"
  | "IRRIGATION"
  | "TRANSPORT"
  | "EQUIPMENT"
  | "STORAGE"
  | "RENT"
  | "LOAN_REPAYMENT"
  | "OTHER";

export type FarmExpense = {
  id: string;
  farmerId: string;
  cropId: string | null;
  type: ExpenseType;
  amount: number;
  description: string | null;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
  crop?: { id: string; cropName: string } | null;
};

export type CreateExpensePayload = {
  type: ExpenseType;
  amount: number;
  expenseDate: string;
  cropId?: string;
  description?: string;
};

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  SEED: "Seeds",
  FERTILIZER: "Fertilizer",
  PESTICIDE: "Pesticide",
  HERBICIDE: "Herbicide",
  LABOR: "Labor",
  IRRIGATION: "Irrigation",
  TRANSPORT: "Transport",
  EQUIPMENT: "Equipment",
  STORAGE: "Storage",
  RENT: "Rent",
  LOAN_REPAYMENT: "Loan repayment",
  OTHER: "Other",
};

export const EXPENSE_TYPE_COLORS: Record<ExpenseType, string> = {
  SEED: "bg-green-100 text-green-700",
  FERTILIZER: "bg-lime-100 text-lime-700",
  PESTICIDE: "bg-orange-100 text-orange-700",
  HERBICIDE: "bg-yellow-100 text-yellow-700",
  LABOR: "bg-blue-100 text-blue-700",
  IRRIGATION: "bg-cyan-100 text-cyan-700",
  TRANSPORT: "bg-indigo-100 text-indigo-700",
  EQUIPMENT: "bg-violet-100 text-violet-700",
  STORAGE: "bg-gray-100 text-gray-700",
  RENT: "bg-pink-100 text-pink-700",
  LOAN_REPAYMENT: "bg-red-100 text-red-700",
  OTHER: "bg-slate-100 text-slate-700",
};

/* ─── Financial Summaries ─── */

export type CashFlowStatus = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export type FinancialSummary = {
  id: string;
  farmerId: string;
  seasonId: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  cashFlowStatus: CashFlowStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  season: { id: string; name: string; year: number };
};

export type CreateFinancialSummaryPayload = {
  seasonId: string;
  totalIncome?: number;
  totalExpenses?: number;
  notes?: string;
};

export type UpdateFinancialSummaryPayload = {
  totalIncome?: number;
  totalExpenses?: number;
  notes?: string;
};

export type SeasonalTrendItem = {
  season: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  cashFlowStatus: CashFlowStatus;
};

export type FinancialDashboardSummary = {
  totalSeasons: number;
  profitableSeasons: number;
  totalLifetimeIncome: number;
  totalLifetimeExpenses: number;
  totalLifetimeNetProfit: number;
  overallCashFlowStatus: CashFlowStatus;
  bestSeasonNetProfit: number | null;
  bestSeasonName: string | null;
};

export type CurrentSeasonData = {
  season: { id: string; name: string; year: number };
  financialSummary: FinancialSummary | null;
} | null;

export type FinancialDashboard = {
  summary: FinancialDashboardSummary;
  currentSeason: CurrentSeasonData;
  seasonalTrend: SeasonalTrendItem[];
};

export const CASH_FLOW_LABELS: Record<CashFlowStatus, string> = {
  POSITIVE: "Profitable",
  NEUTRAL: "Break-even",
  NEGATIVE: "Loss",
};

export const CASH_FLOW_STYLES: Record<CashFlowStatus, string> = {
  POSITIVE: "bg-green-100 text-green-800 border-green-200",
  NEUTRAL: "bg-blue-100 text-blue-800 border-blue-200",
  NEGATIVE: "bg-red-100 text-red-800 border-red-200",
};

/* ─── Market Prices ─── */

export type MarketPrice = {
  id: string;
  cropName: string;
  marketLocation: string;
  pricePerUnit: number;
  unit: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type MarketPriceWithStaleness = MarketPrice & {
  ageInDays: number;
  isStale: boolean;
};

export type MarketPricesMeta = {
  totalCrops: number;
  freshCount: number;
  staleCount: number;
  staleDaysThreshold: number;
};

export type CreateMarketPricePayload = {
  cropName: string;
  marketLocation: string;
  pricePerUnit: number;
  unit?: string;
  recordedAt?: string;
};

export type UpdateMarketPricePayload = Partial<CreateMarketPricePayload>;
