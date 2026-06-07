export type RecommendationType =
  | "LOAN_AMOUNT"
  | "FINANCIAL_IMPROVEMENT"
  | "REPAYMENT_STRATEGY"
  | "PRODUCTIVITY"
  | "RISK_REDUCTION"
  | "DATA_COMPLETENESS"
  | "GENERAL_ADVISORY";

export type RecommendationPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type RecommendationStatus = "ACTIVE" | "READ" | "ARCHIVED" | "DISMISSED";

export type Recommendation = {
  id: string;
  farmerId: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  title: string;
  message: string;
  actionLabel: string | null;
  actionUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  farmer?: {
    id: string;
    user: { fullName: string; phone: string };
  };
};

export type CreateRecommendationPayload = {
  farmerId: string;
  type: RecommendationType;
  priority?: RecommendationPriority;
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
};

export type UpdateRecommendationPayload = Partial<
  Omit<CreateRecommendationPayload, "farmerId">
>;

export type RecommendationFilters = {
  page?: number;
  limit?: number;
  status?: RecommendationStatus;
  type?: RecommendationType;
  priority?: RecommendationPriority;
};

/* ─── Labels & styles ─── */

export const RECOMMENDATION_TYPE_LABELS: Record<RecommendationType, string> = {
  LOAN_AMOUNT: "Loan amount",
  FINANCIAL_IMPROVEMENT: "Financial improvement",
  REPAYMENT_STRATEGY: "Repayment strategy",
  PRODUCTIVITY: "Productivity",
  RISK_REDUCTION: "Risk reduction",
  DATA_COMPLETENESS: "Data completeness",
  GENERAL_ADVISORY: "General advisory",
};

export const RECOMMENDATION_PRIORITY_LABELS: Record<RecommendationPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const RECOMMENDATION_PRIORITY_STYLES: Record<RecommendationPriority, string> = {
  LOW: "bg-blue-100 text-blue-700 border-blue-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  CRITICAL: "bg-red-100 text-red-800 border-red-200",
};

export const RECOMMENDATION_STATUS_LABELS: Record<RecommendationStatus, string> = {
  ACTIVE: "Active",
  READ: "Read",
  ARCHIVED: "Archived",
  DISMISSED: "Dismissed",
};

export const RECOMMENDATION_STATUS_STYLES: Record<RecommendationStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  READ: "bg-blue-100 text-blue-800 border-blue-200",
  ARCHIVED: "bg-gray-100 text-gray-700 border-gray-200",
  DISMISSED: "bg-slate-100 text-slate-600 border-slate-200",
};

export const RECOMMENDATION_TYPE_COLORS: Record<RecommendationType, string> = {
  LOAN_AMOUNT: "bg-purple-100 text-purple-700",
  FINANCIAL_IMPROVEMENT: "bg-emerald-100 text-emerald-700",
  REPAYMENT_STRATEGY: "bg-blue-100 text-blue-700",
  PRODUCTIVITY: "bg-green-100 text-green-700",
  RISK_REDUCTION: "bg-red-100 text-red-700",
  DATA_COMPLETENESS: "bg-amber-100 text-amber-700",
  GENERAL_ADVISORY: "bg-indigo-100 text-indigo-700",
};
