/* ─── Yield Records ─── */

export type YieldQualityGrade = "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR" | "DAMAGED";
export type YieldVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type YieldVerificationMethod = "FIELD_VISIT" | "COOPERATIVE_COLLECTION_RECORD";

export type YieldRecord = {
  id: string;
  cropId: string;
  expectedYield: number | null;
  actualYield: number;
  unit: string;
  harvestDate: string;
  qualityGrade: YieldQualityGrade;
  notes: string | null;
  verificationStatus: YieldVerificationStatus;
  verificationMethod: YieldVerificationMethod | null;
  evidenceReference: string | null;
  verifiedActualYield: number | null;
  verifiedUnit: string | null;
  verificationNote: string | null;
  verificationRiskScore: number | null;
  verificationRiskNote: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  verifiedBy: { id: string; fullName: string; email: string; role: string } | null;
  crop: {
    id: string;
    cropName: string;
    cropType: string;
    farm: { id: string; name: string; farmerId: string };
  };
};

export type CreateYieldPayload = {
  cropId: string;
  expectedYield?: number;
  actualYield: number;
  unit?: string;
  harvestDate: string;
  qualityGrade?: YieldQualityGrade;
  notes?: string;
};

export type UpdateYieldPayload = Partial<Omit<CreateYieldPayload, "cropId">>;

export type VerifyYieldPayload = {
  status: "VERIFIED" | "REJECTED";
  method?: YieldVerificationMethod;
  evidenceReference?: string;
  verifiedActualYield?: number;
  verifiedUnit?: string;
  verificationNote?: string;
};

export type YieldFilters = {
  page?: number;
  limit?: number;
  cropId?: string;
  verificationStatus?: YieldVerificationStatus;
};

/* ─── Productivity Records ─── */

export type ProductivityRecord = {
  id: string;
  farmerId: string;
  seasonId: string;
  totalExpectedYield: number | null;
  totalActualYield: number;
  unit: string;
  productivityRate: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  farmer: { id: string; user: { fullName: string; email: string } };
  season: { id: string; name: string; year: number };
};

export type CreateProductivityRecordPayload = {
  seasonId: string;
  totalExpectedYield?: number;
  totalActualYield: number;
  unit?: string;
  productivityRate: number;
  notes?: string;
};

export type UpdateProductivityRecordPayload = Partial<
  Omit<CreateProductivityRecordPayload, "seasonId">
>;

/* ─── Dashboard ─── */

export type ProductivitySeasonalTrendItem = {
  season: string;
  productivityRate: number;
  totalActualYield: number;
  totalExpectedYield: number | null;
  unit: string | null;
};

export type ProductivityCurrentSeason = {
  season: { id: string; name: string; year: number; startDate: string; endDate: string };
  cropsPlanted: number;
  totalEstimatedArea: number;
  statusBreakdown: Record<string, number>;
  productivityRate: number | null;
  totalActualYield: number | null;
  yieldUnit: string | null;
} | null;

export type ProductivityDashboard = {
  summary: {
    totalSeasons: number;
    averageProductivityRate: number;
    bestSeasonRate: number | null;
    bestSeasonName: string | null;
  };
  currentSeason: ProductivityCurrentSeason;
  seasonalTrend: ProductivitySeasonalTrendItem[];
};

/* ─── Benchmark ─── */

export type PerformanceRating =
  | "EXCELLENT"
  | "ABOVE_AVERAGE"
  | "AVERAGE"
  | "BELOW_AVERAGE"
  | "INSUFFICIENT_DATA";

export type ProductivityBenchmark = {
  cropName: string;
  yieldUnit: string;
  note: string;
  farmer: { district: string | null; avgYieldPerHa: number | null; recordCount: number };
  districtBenchmark: {
    district: string;
    avgYieldPerHa: number | null;
    recordCount: number;
    farmerPercentile: number | null;
  } | null;
  nationalBenchmark: { avgYieldPerHa: number | null; totalRecords: number };
  performanceRating: PerformanceRating;
  topDistrictsByYield: Array<{ district: string; avgYieldPerHa: number; recordCount: number }>;
};

/* ─── Labels & styles ─── */

export const QUALITY_GRADE_LABELS: Record<YieldQualityGrade, string> = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  AVERAGE: "Average",
  POOR: "Poor",
  DAMAGED: "Damaged",
};

export const QUALITY_GRADE_STYLES: Record<YieldQualityGrade, string> = {
  EXCELLENT: "bg-emerald-100 text-emerald-800 border-emerald-200",
  GOOD: "bg-green-100 text-green-800 border-green-200",
  AVERAGE: "bg-blue-100 text-blue-800 border-blue-200",
  POOR: "bg-orange-100 text-orange-800 border-orange-200",
  DAMAGED: "bg-red-100 text-red-800 border-red-200",
};

export const VERIFICATION_STATUS_LABELS: Record<YieldVerificationStatus, string> = {
  PENDING: "Pending review",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
};

export const VERIFICATION_STATUS_STYLES: Record<YieldVerificationStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  VERIFIED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

export const PERFORMANCE_RATING_LABELS: Record<PerformanceRating, string> = {
  EXCELLENT: "Excellent",
  ABOVE_AVERAGE: "Above average",
  AVERAGE: "Average",
  BELOW_AVERAGE: "Below average",
  INSUFFICIENT_DATA: "Insufficient data",
};

export const PERFORMANCE_RATING_STYLES: Record<PerformanceRating, string> = {
  EXCELLENT: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ABOVE_AVERAGE: "bg-green-100 text-green-800 border-green-200",
  AVERAGE: "bg-blue-100 text-blue-800 border-blue-200",
  BELOW_AVERAGE: "bg-orange-100 text-orange-800 border-orange-200",
  INSUFFICIENT_DATA: "bg-gray-100 text-gray-700 border-gray-200",
};

export const AGRICULTURAL_UNITS = [
  "kg", "g", "tonnes", "bags", "sacks", "bundles",
  "litres", "ml", "pieces", "plants", "seedlings",
  "bunches", "heads", "crates", "hours", "days", "person-days", "units",
] as const;
