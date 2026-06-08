export type LoanApplicationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type LoanStatus =
  | "APPROVED"
  | "DISBURSED"
  | "ACTIVE"
  | "COMPLETED"
  | "DEFAULTED"
  | "CANCELLED";

export type LoanPurpose =
  | "SEEDS"
  | "FERTILIZER"
  | "EQUIPMENT"
  | "IRRIGATION"
  | "LIVESTOCK"
  | "LAND_RENT"
  | "LABOR"
  | "TRANSPORT"
  | "STORAGE"
  | "OTHER";

export type PaymentMethod =
  | "MOBILE_MONEY"
  | "BANK_TRANSFER"
  | "CASH"
  | "CARD"
  | "OTHER";

export type RepaymentScheduleStatus =
  | "UPCOMING"
  | "DUE"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export type RepaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";

export type InstitutionSummary = {
  id: string;
  name: string;
  type: string;
};

export type FarmerUserSummary = {
  id: string;
  user: { id: string; fullName: string; email: string };
};

export type UserSummary = {
  id: string;
  fullName: string;
  email: string;
};

export type LoanApplicationLoanSummary = {
  id: string;
  status: LoanStatus;
  disbursedAt: string | null;
};

export type LoanApplication = {
  id: string;
  farmerId: string;
  institutionId: string | null;
  creditScoreId: string | null;
  requestedAmount: number;
  recommendedAmount: number | null;
  approvedAmount: number | null;
  purpose: LoanPurpose;
  purposeDescription: string | null;
  status: LoanApplicationStatus;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  loan: LoanApplicationLoanSummary | null;
  institution: InstitutionSummary | null;
  farmer?: FarmerUserSummary;
  reviewedBy?: UserSummary | null;
};

export type RepaymentSchedule = {
  id: string;
  loanId: string;
  dueDate: string;
  expectedAmount: number;
  paidAmount: number;
  status: RepaymentScheduleStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Loan = {
  id: string;
  loanApplicationId: string;
  farmerId: string;
  institutionId: string | null;
  principalAmount: number;
  interestRate: number;
  totalPayable: number;
  disbursedAmount: number | null;
  disbursedAt: string | null;
  startDate: string | null;
  endDate: string | null;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
  institution: InstitutionSummary | null;
  repaymentSchedules: RepaymentSchedule[];
  farmer?: FarmerUserSummary;
};

export type Repayment = {
  id: string;
  loanId: string;
  repaymentScheduleId: string | null;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  status: RepaymentStatus;
  transactionReference: string | null;
  paidAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  repaymentSchedule?: {
    id: string;
    dueDate: string;
    expectedAmount: number;
    paidAmount: number;
    status: RepaymentScheduleStatus;
  } | null;
};

export type LoanPagination = {
  page: number;
  total: number;
  limit: number;
  skip: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type LoanApplicationFilters = {
  page?: number;
  limit?: number;
  status?: LoanApplicationStatus;
  farmerId?: string;
};

export type LoanFilters = {
  page?: number;
  limit?: number;
  status?: LoanStatus;
  farmerId?: string;
};

export type RepaymentFilters = {
  page?: number;
  limit?: number;
  loanId?: string;
};

export type RepaymentScheduleFilters = {
  page?: number;
  limit?: number;
  loanId?: string;
};

export type CreateLoanApplicationPayload = {
  requestedAmount: number;
  purpose: LoanPurpose;
  purposeDescription?: string;
  institutionId?: string;
};

export type UpdateLoanApplicationStatusPayload = {
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "CANCELLED";
  rejectionReason?: string;
  recommendedAmount?: number;
  approvedAmount?: number;
  interestRate?: number;
  totalPayable?: number;
};

export type DisburseLoanPayload = {
  disbursedAmount: number;
  startDate: string;
  durationMonths: number;
};

export type UpdateLoanStatusPayload = {
  status: "ACTIVE" | "COMPLETED" | "DEFAULTED" | "CANCELLED";
  note?: string;
};

export type CreateRepaymentPayload = {
  loanId: string;
  repaymentScheduleId?: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  notes?: string;
  paidAt?: string;
};

export const LOAN_PURPOSE_LABELS: Record<LoanPurpose, string> = {
  SEEDS: "Seeds",
  FERTILIZER: "Fertilizer",
  EQUIPMENT: "Equipment",
  IRRIGATION: "Irrigation",
  LIVESTOCK: "Livestock",
  LAND_RENT: "Land Rent",
  LABOR: "Labor",
  TRANSPORT: "Transport",
  STORAGE: "Storage",
  OTHER: "Other",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  MOBILE_MONEY: "Mobile Money",
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
  CARD: "Card",
  OTHER: "Other",
};

export const LOAN_APPLICATION_STATUS_LABELS: Record<
  LoanApplicationStatus,
  string
> = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  APPROVED: "Approved",
  DISBURSED: "Disbursed",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  DEFAULTED: "Defaulted",
  CANCELLED: "Cancelled",
};

export const REPAYMENT_SCHEDULE_STATUS_LABELS: Record<
  RepaymentScheduleStatus,
  string
> = {
  UPCOMING: "Upcoming",
  DUE: "Due",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

export const formatCurrency = (amount: number): string =>
  `RWF ${amount.toLocaleString()}`;
