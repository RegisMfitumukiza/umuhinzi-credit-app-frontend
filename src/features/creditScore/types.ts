export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

export type CreditScoreFactorType =
  | "YIELD_CONSISTENCY"
  | "FARMING_HISTORY"
  | "INCOME_STABILITY"
  | "REPAYMENT_BEHAVIOR"
  | "PRODUCTIVITY"
  | "FARM_SIZE"
  | "LIVESTOCK_VALUE"
  | "COOPERATIVE_MEMBERSHIP"
  | "DATA_COMPLETENESS"
  | "LOCATION_VERIFICATION";

export type Trajectory = "IMPROVING" | "DECLINING" | "STABLE";

export type CreditScoreFactor = {
  id: string;
  creditScoreId: string;
  type: CreditScoreFactorType;
  factorName: string;
  factorValue: number;
  weight: number;
  contribution: number;
  description: string | null;
  createdAt: string;
};

export type RiskAssessment = {
  id: string;
  farmerId: string;
  creditScoreId: string;
  riskLevel: RiskLevel;
  reason: string | null;
  recommendedAction: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreditScore = {
  id: string;
  farmerId: string;
  score: number;
  riskLevel: RiskLevel;
  yieldConsistencyScore: number;
  farmingHistoryScore: number;
  incomeStabilityScore: number;
  repaymentBehaviorScore: number;
  productivityScore: number;
  dataCompletenessScore: number;
  locationVerificationScore: number;
  summary: string | null;
  generatedAt: string;
  createdAt: string;
  factors: CreditScoreFactor[];
  riskAssessment: RiskAssessment | null;
};

export type ScoreHistoryItem = {
  id: string;
  score: number;
  riskLevel: RiskLevel;
  generatedAt: string;
};

export type FactorTrendEntry = {
  first: number;
  latest: number;
  delta: number;
};

export type FactorTrends = {
  yieldConsistency: FactorTrendEntry;
  farmingHistory: FactorTrendEntry;
  incomeStability: FactorTrendEntry;
  repaymentBehavior: FactorTrendEntry;
  productivity: FactorTrendEntry;
  dataCompleteness: FactorTrendEntry;
  locationVerification: FactorTrendEntry;
};

export type CreditScoreTrend = {
  hasData: boolean;
  trajectory: Trajectory;
  insight: string;
  currentScore: number;
  currentRiskLevel: RiskLevel;
  previousScore: number | null;
  scoreDelta: number;
  momentumDelta: number;
  dataPoints: number;
  scoreHistory: ScoreHistoryItem[];
  factorTrends: FactorTrends | null;
};

export type CreditScorePagination = {
  page: number;
  total: number;
  limit: number;
  skip: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  LOW: "Low Risk",
  MEDIUM: "Medium Risk",
  HIGH: "High Risk",
  VERY_HIGH: "Very High Risk",
};

export const RISK_LEVEL_STYLES: Record<RiskLevel, string> = {
  LOW: "bg-green-100 text-green-800 border-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  VERY_HIGH: "bg-red-100 text-red-800 border-red-200",
};

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  LOW: "#22c55e",
  MEDIUM: "#eab308",
  HIGH: "#f97316",
  VERY_HIGH: "#ef4444",
};

export const FACTOR_TYPE_LABELS: Record<CreditScoreFactorType, string> = {
  YIELD_CONSISTENCY: "Yield Consistency",
  FARMING_HISTORY: "Farming History",
  INCOME_STABILITY: "Income Stability",
  REPAYMENT_BEHAVIOR: "Repayment Behavior",
  PRODUCTIVITY: "Productivity",
  FARM_SIZE: "Farm Size",
  LIVESTOCK_VALUE: "Livestock Value",
  COOPERATIVE_MEMBERSHIP: "Cooperative Membership",
  DATA_COMPLETENESS: "Data Completeness",
  LOCATION_VERIFICATION: "Location Verification",
};

export const TRAJECTORY_LABELS: Record<Trajectory, string> = {
  IMPROVING: "Improving",
  DECLINING: "Declining",
  STABLE: "Stable",
};

export const TRAJECTORY_STYLES: Record<Trajectory, string> = {
  IMPROVING: "bg-green-100 text-green-800 border-green-200",
  DECLINING: "bg-red-100 text-red-800 border-red-200",
  STABLE: "bg-blue-100 text-blue-800 border-blue-200",
};

export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 70) return "LOW";
  if (score >= 50) return "MEDIUM";
  if (score >= 30) return "HIGH";
  return "VERY_HIGH";
};
