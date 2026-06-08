import { Clock, ShieldOff, Tractor, Banknote, BarChart3, PawPrint, DollarSign, Lightbulb, Coins, Activity, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

import { useMyFarmer } from "../hooks/useMyFarmer";
import { CreateFarmerProfileForm } from "../components/CreateFarmerProfileForm";
import { EditFarmerProfileCard } from "../components/EditFarmerProfileCard";
import { ProfileCompletenessCard } from "../components/ProfileCompletenessCard";
import { CooperativeSection } from "../components/CooperativeSection";
import { FarmerStatusBadge, CredibilityBadge } from "../components/FarmerStatusBadge";
import type { Farmer } from "../types";
import { useLatestCreditScore } from "@/features/creditScore/hooks/useLatestCreditScore";
import { RISK_LEVEL_LABELS } from "@/features/creditScore/types";
import { useFinancialDashboard } from "@/features/finance/hooks/useFinancialDashboard";
import { CASH_FLOW_LABELS } from "@/features/finance/types";
import { useRecommendations } from "@/features/recommendations/hooks/useRecommendations";
import { useMyInputCosts } from "@/features/inputCosts/hooks/useMyInputCosts";
import { useProductivityDashboard } from "@/features/productivity/hooks/useProductivityDashboard";
import { useLoanApplications } from "@/features/loans/hooks/useLoanApplications";
import { useLoans } from "@/features/loans/hooks/useLoans";
import { LOAN_APPLICATION_STATUS_LABELS } from "@/features/loans/types";

const FarmerDashboard = () => {
  const { data: farmer, isLoading } = useMyFarmer();

  if (isLoading) return <AppLoader message="Loading your profile…" />;

  if (!farmer) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Set up your farmer profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your digital farmer identity to access loans, cooperatives,
            and platform features.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <CreateFarmerProfileForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header farmer={farmer} />
      {farmer.status === "PENDING" && <PendingBanner />}
      {farmer.status === "SUSPENDED" && <SuspendedBanner />}
      <MainGrid farmer={farmer} />
      <LivestockCard farmer={farmer} />
      <CreditScoreCard />
      <FinanceCard />
      <InputCostsCard />
      <ProductivityCard />
      <RecommendationsCard />
      <FarmsCard farmer={farmer} />
      <LoansCard />
      <CooperativeSection farmer={farmer} />
    </div>
  );
};

/* ─── Header ─── */

const Header = ({ farmer }: { farmer: Farmer }) => (
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 className="text-2xl font-semibold">{farmer.user.fullName}</h1>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {farmer.user.district
          ? `${farmer.user.district}${farmer.user.province ? `, ${farmer.user.province}` : ""}`
          : "Location not set"}
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      <FarmerStatusBadge status={farmer.status} />
      <CredibilityBadge status={farmer.credibilityStatus} />
    </div>
  </div>
);

/* ─── Status banners ─── */

const PendingBanner = () => (
  <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
    <div>
      <p className="font-medium text-yellow-800">Profile under review</p>
      <p className="mt-0.5 text-sm text-yellow-700">
        An admin will verify your profile once it's complete. Make sure to add
        your date of birth, gender, primary crop, and at least one farm.
      </p>
    </div>
  </div>
);

const SuspendedBanner = () => (
  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
    <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
    <div>
      <p className="font-medium text-red-800">Account suspended</p>
      <p className="mt-0.5 text-sm text-red-700">
        Your farmer profile has been suspended. Contact support for more
        information.
      </p>
    </div>
  </div>
);

/* ─── Loans quick-access card ─── */

const LoansCard = () => {
  const { data: applicationsData } = useLoanApplications({ limit: 1 });
  const { data: loansData } = useLoans({ limit: 1 });

  const latestApp = applicationsData?.data?.[0] ?? null;
  const activeLoans = loansData?.pagination?.total ?? 0;

  let subtitle: string;
  let accent = "bg-blue-100";
  let iconColor = "text-blue-700";
  let showAlert = false;

  if (latestApp && latestApp.status === "PENDING") {
    subtitle = "Application pending — waiting for an institution to review";
    accent = "bg-amber-100";
    iconColor = "text-amber-700";
    showAlert = true;
  } else if (latestApp && latestApp.status === "UNDER_REVIEW") {
    subtitle = `Application under review by ${latestApp.institution?.name ?? "an institution"}`;
    accent = "bg-indigo-100";
    iconColor = "text-indigo-700";
  } else if (activeLoans > 0) {
    subtitle = `${activeLoans} active loan${activeLoans !== 1 ? "s" : ""} — track repayments and schedule`;
  } else if (latestApp) {
    subtitle = `Last application: ${LOAN_APPLICATION_STATUS_LABELS[latestApp.status].toLowerCase()}`;
  } else {
    subtitle = "Apply for credit, track repayments, and view your loan schedule";
  }

  return (
    <Card className={showAlert ? "border-amber-200 bg-amber-50/40" : undefined}>
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${accent}`}>
            {showAlert
              ? <AlertCircle className={`h-5 w-5 ${iconColor}`} />
              : <Banknote className={`h-5 w-5 ${iconColor}`} />
            }
          </div>
          <div>
            <p className="font-medium">Agricultural loans</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Button asChild variant={showAlert ? "outline" : "outline"} className="shrink-0">
          <Link to={ROUTES.FARMER_LOANS}>
            {activeLoans > 0 ? "View loans" : latestApp ? "View application" : "Apply now"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

/* ─── Farms quick-access card ─── */

const FarmsCard = ({ farmer }: { farmer: Farmer }) => (
  <Card>
    <CardContent className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <Tractor className="h-5 w-5 text-green-700" />
        </div>
        <div>
          <p className="font-medium">
            {farmer._count.farms > 0
              ? `${farmer._count.farms} farm${farmer._count.farms !== 1 ? "s" : ""} registered`
              : "No farms yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {farmer._count.farms === 0
              ? "Add at least one farm to qualify for verification"
              : "Manage your farms, add crops, and update details"}
          </p>
        </div>
      </div>
      <Button asChild variant="outline" className="shrink-0">
        <Link to={ROUTES.FARMER_FARMS}>
          Manage farms
        </Link>
      </Button>
    </CardContent>
  </Card>
);

/* ─── Livestock quick-access card ─── */

const LivestockCard = ({ farmer }: { farmer: Farmer }) => (
  <Card>
    <CardContent className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <PawPrint className="h-5 w-5 text-amber-700" />
        </div>
        <div>
          <p className="font-medium">My Livestock</p>
          <p className="text-sm text-muted-foreground">
            {farmer._count.livestock > 0
              ? `${farmer._count.livestock} record${farmer._count.livestock !== 1 ? "s" : ""} — contributes to your credit score`
              : "Add livestock records to strengthen your credit profile"}
          </p>
        </div>
      </div>
      <Button asChild variant="outline" className="shrink-0">
        <Link to={ROUTES.FARMER_LIVESTOCK}>
          {farmer._count.livestock > 0 ? "Manage" : "Add livestock"}
        </Link>
      </Button>
    </CardContent>
  </Card>
);

/* ─── Credit score quick-access card ─── */

const CreditScoreCard = () => {
  const { data: score } = useLatestCreditScore();

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
            <BarChart3 className="h-5 w-5 text-indigo-700" />
          </div>
          <div>
            <p className="font-medium">Credit score</p>
            <p className="text-sm text-muted-foreground">
              {score
                ? `${score.score}/100 — ${RISK_LEVEL_LABELS[score.riskLevel]}`
                : "Generate your first credit score"}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link to={ROUTES.FARMER_CREDIT_SCORE}>
            {score ? "View score" : "Get started"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

/* ─── Finance quick-access card ─── */

const FinanceCard = () => {
  const { data: dashboard } = useFinancialDashboard();
  const current = dashboard?.currentSeason;
  const hasSummary = current?.financialSummary != null;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <DollarSign className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <p className="font-medium">Finances</p>
            <p className="text-sm text-muted-foreground">
              {hasSummary && current?.financialSummary
                ? `${current.season.name} ${current.season.year} — ${CASH_FLOW_LABELS[current.financialSummary.cashFlowStatus]}`
                : "Track expenses and seasonal profit"}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link to={ROUTES.FARMER_FINANCE}>
            {hasSummary ? "View finances" : "Get started"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

/* ─── Input costs quick-access card ─── */

const InputCostsCard = () => {
  const { data } = useMyInputCosts({ limit: 1 });
  const total = data?.pagination.total ?? 0;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <Coins className="h-5 w-5 text-orange-700" />
          </div>
          <div>
            <p className="font-medium">Input costs</p>
            <p className="text-sm text-muted-foreground">
              {total > 0
                ? `${total} input cost record${total !== 1 ? "s" : ""} across your crops`
                : "No input costs recorded yet"}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link to={ROUTES.FARMER_INPUT_COSTS}>
            {total > 0 ? "Manage" : "Get started"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

/* ─── Productivity quick-access card ─── */

const ProductivityCard = () => {
  const { data: dashboard } = useProductivityDashboard();
  const rate = dashboard?.summary.averageProductivityRate;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
            <Activity className="h-5 w-5 text-teal-700" />
          </div>
          <div>
            <p className="font-medium">Productivity</p>
            <p className="text-sm text-muted-foreground">
              {rate != null
                ? `Avg productivity rate: ${rate.toLocaleString("en-RW", { maximumFractionDigits: 1 })}%`
                : "Record harvest yields to track productivity"}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link to={ROUTES.FARMER_PRODUCTIVITY}>
            {rate != null ? "View" : "Get started"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

/* ─── Recommendations quick-access card ─── */

const RecommendationsCard = () => {
  const { data } = useRecommendations({ status: "ACTIVE", limit: 1 });
  const activeCount = data?.pagination.total ?? 0;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
            <Lightbulb className="h-5 w-5 text-violet-700" />
          </div>
          <div>
            <p className="font-medium">Recommendations</p>
            <p className="text-sm text-muted-foreground">
              {activeCount > 0
                ? `${activeCount} active recommendation${activeCount !== 1 ? "s" : ""} waiting`
                : "No new recommendations"}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link to={ROUTES.FARMER_RECOMMENDATIONS}>
            {activeCount > 0 ? "View all" : "Browse"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

/* ─── Main grid ─── */

const MainGrid = ({ farmer }: { farmer: Farmer }) => (
  <div className="grid gap-6 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <EditFarmerProfileCard farmer={farmer} />
    </div>
    <div>
      <ProfileCompletenessCard />
    </div>
  </div>
);

export default FarmerDashboard;
