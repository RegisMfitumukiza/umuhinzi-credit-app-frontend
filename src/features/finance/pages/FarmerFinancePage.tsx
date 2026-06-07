import { useState } from "react";
import { format } from "date-fns";
import {
  Plus, Trash2, Loader2, RefreshCw, TrendingUp, TrendingDown,
  Minus, DollarSign, Receipt, FileText, ShoppingCart, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

import { useMyFarmer } from "@/features/farmers/hooks/useMyFarmer";
import { useFinancialDashboard } from "../hooks/useFinancialDashboard";
import { useMyExpenses } from "../hooks/useMyExpenses";
import { useMyFinancialSummaries } from "../hooks/useMyFinancialSummaries";
import { useMarketPrices } from "../hooks/useMarketPrices";
import { useDeleteExpense } from "../hooks/useDeleteExpense";
import { useDeleteFinancialSummary } from "../hooks/useDeleteFinancialSummary";
import { useRecalculateFinancialSummary } from "../hooks/useRecalculateFinancialSummary";
import { CashFlowBadge } from "../components/CashFlowBadge";
import { ExpenseFormSheet } from "../components/ExpenseFormSheet";
import { FinancialSummaryFormSheet } from "../components/FinancialSummaryFormSheet";
import type { FarmExpense, FinancialSummary, MarketPrice } from "../types";
import { EXPENSE_TYPE_LABELS, EXPENSE_TYPE_COLORS } from "../types";

const fmt = (n: number) => n.toLocaleString("en-RW", { maximumFractionDigits: 0 });

const FarmerFinancePage = () => {
  const { data: farmer, isLoading: loadingFarmer } = useMyFarmer();
  const { data: dashboard, isLoading: loadingDash } = useFinancialDashboard();

  if (loadingFarmer) return <AppLoader message="Loading finances…" />;

  const isSuspended = farmer?.status === "SUSPENDED";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Finances</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Track expenses, review seasonal profitability, and monitor market prices
        </p>
      </div>

      {isSuspended && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Suspended farmers cannot manage financial records.
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="summaries">Seasonal Summaries</TabsTrigger>
          <TabsTrigger value="market">Market Prices</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {loadingDash ? (
            <AppLoader message="Loading dashboard…" />
          ) : !dashboard ? (
            <EmptyOverview />
          ) : (
            <OverviewTab dashboard={dashboard} />
          )}
        </TabsContent>

        {/* ── Expenses ── */}
        <TabsContent value="expenses" className="mt-6">
          <ExpensesTab isSuspended={isSuspended} />
        </TabsContent>

        {/* ── Summaries ── */}
        <TabsContent value="summaries" className="mt-6">
          <SummariesTab isSuspended={isSuspended} />
        </TabsContent>

        {/* ── Market Prices ── */}
        <TabsContent value="market" className="mt-6">
          <MarketPricesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ─── Overview Tab ─── */

type DashboardData = NonNullable<ReturnType<typeof useFinancialDashboard>["data"]>;

const OverviewTab = ({ dashboard }: { dashboard: DashboardData }) => {
  const s = dashboard.summary;
  const trend = [...dashboard.seasonalTrend].reverse(); // chart left-to-right oldest first

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Lifetime income"
          value={`${fmt(s.totalLifetimeIncome)} RWF`}
          icon={<TrendingUp className="h-4 w-4 text-green-600" />}
          accent="bg-green-50"
        />
        <StatCard
          label="Lifetime expenses"
          value={`${fmt(s.totalLifetimeExpenses)} RWF`}
          icon={<TrendingDown className="h-4 w-4 text-red-600" />}
          accent="bg-red-50"
        />
        <StatCard
          label="Net profit"
          value={`${s.totalLifetimeNetProfit >= 0 ? "+" : ""}${fmt(s.totalLifetimeNetProfit)} RWF`}
          icon={<DollarSign className="h-4 w-4 text-indigo-600" />}
          accent="bg-indigo-50"
        />
        <StatCard
          label="Profitable seasons"
          value={`${s.profitableSeasons} / ${s.totalSeasons}`}
          icon={<Minus className="h-4 w-4 text-amber-600" />}
          accent="bg-amber-50"
        />
      </div>

      {/* Current season */}
      {dashboard.currentSeason && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Current season</h3>
              <Badge variant="outline" className="text-xs">
                {dashboard.currentSeason.season.name} {dashboard.currentSeason.season.year}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!dashboard.currentSeason.financialSummary ? (
              <p className="text-sm text-muted-foreground">
                No financial summary for this season yet. Create one in the Seasonal Summaries tab.
              </p>
            ) : (
              <CurrentSeasonStats summary={dashboard.currentSeason.financialSummary} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Seasonal trend chart */}
      {trend.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-sm font-semibold">Seasonal trend</h3>
            <p className="text-xs text-muted-foreground">Income, expenses, and profit over the last seasons</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="season" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  formatter={(value: number) => [`${fmt(value)} RWF`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="totalIncome" name="Income" fill="#22c55e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="totalExpenses" name="Expenses" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="netProfit" name="Net profit" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const StatCard = ({
  label, value, icon, accent,
}: { label: string; value: string; icon: React.ReactNode; accent: string }) => (
  <Card>
    <CardContent className="pt-4 pb-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent} mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </CardContent>
  </Card>
);

const CurrentSeasonStats = ({ summary }: { summary: FinancialSummary }) => (
  <div className="grid grid-cols-3 gap-4 text-sm">
    <div>
      <p className="text-xs text-muted-foreground">Income</p>
      <p className="font-semibold tabular-nums text-green-700">{fmt(summary.totalIncome)} RWF</p>
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Expenses</p>
      <p className="font-semibold tabular-nums text-red-700">{fmt(summary.totalExpenses)} RWF</p>
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Net profit</p>
      <p className={`font-semibold tabular-nums ${summary.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
        {summary.netProfit >= 0 ? "+" : ""}{fmt(summary.netProfit)} RWF
      </p>
    </div>
  </div>
);

const EmptyOverview = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
    <FileText className="h-10 w-10 text-muted-foreground/40" />
    <h3 className="mt-4 font-medium">No financial data yet</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      Start recording expenses and create seasonal summaries to see your financial overview here.
    </p>
  </div>
);

/* ─── Expenses Tab ─── */

const ExpensesTab = ({ isSuspended }: { isSuspended: boolean }) => {
  const { data, isLoading } = useMyExpenses({ limit: 50 });
  const { mutate: doDelete, isPending: isDeleting } = useDeleteExpense();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) return <AppLoader message="Loading expenses…" />;
  const expenses = data?.expenses ?? [];

  const handleDelete = (id: string) => {
    setDeletingId(id);
    doDelete(id, {
      onSuccess: (res) => { toast.success(res.message); setDeletingId(null); },
      onError: (err) => { toast.error(err.message); setDeletingId(null); },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {expenses.length > 0
            ? `${expenses.length} expense${expenses.length !== 1 ? "s" : ""} recorded`
            : "No expenses yet"}
        </p>
        {!isSuspended && (
          <ExpenseFormSheet>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add expense
            </Button>
          </ExpenseFormSheet>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No expenses recorded</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Track seeds, labor, transport and other farm costs.
          </p>
          {!isSuspended && (
            <ExpenseFormSheet>
              <Button size="sm" className="mt-4 gap-2">
                <Plus className="h-4 w-4" /> Record first expense
              </Button>
            </ExpenseFormSheet>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              isDeleting={isDeleting && deletingId === expense.id}
              onDelete={() => handleDelete(expense.id)}
              isSuspended={isSuspended}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ExpenseRow = ({
  expense, isDeleting, onDelete, isSuspended,
}: {
  expense: FarmExpense;
  isDeleting: boolean;
  onDelete: () => void;
  isSuspended: boolean;
}) => (
  <Card>
    <CardContent className="flex items-center gap-4 py-3">
      <span className={`rounded-md px-2 py-1 text-xs font-medium ${EXPENSE_TYPE_COLORS[expense.type]}`}>
        {EXPENSE_TYPE_LABELS[expense.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold tabular-nums">{fmt(expense.amount)} RWF</p>
        {expense.description && (
          <p className="text-xs text-muted-foreground truncate">{expense.description}</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground shrink-0">
        {format(new Date(expense.expenseDate), "MMM d, yyyy")}
      </p>
      {!isSuspended && (
        <div className="flex items-center gap-1 shrink-0">
          <ExpenseFormSheet expense={expense}>
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <Receipt className="h-3.5 w-3.5" />
            </Button>
          </ExpenseFormSheet>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete expense?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this {EXPENSE_TYPE_LABELS[expense.type].toLowerCase()} expense
                  of {fmt(expense.amount)} RWF. Related financial summaries will be refreshed automatically.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </CardContent>
  </Card>
);

/* ─── Summaries Tab ─── */

const SummariesTab = ({ isSuspended }: { isSuspended: boolean }) => {
  const { data, isLoading } = useMyFinancialSummaries({ limit: 20 });
  const { mutate: doDelete } = useDeleteFinancialSummary();
  const { mutate: doRecalc, isPending: isRecalculating, variables: recalcId } =
    useRecalculateFinancialSummary();

  if (isLoading) return <AppLoader message="Loading summaries…" />;
  const summaries = data?.summaries ?? [];

  const handleDelete = (id: string) => {
    doDelete(id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleRecalc = (id: string) => {
    doRecalc(id, {
      onSuccess: () => toast.success("Summary recalculated from latest data."),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          One summary per farming season. Totals are auto-calculated from yields and expenses.
        </p>
        {!isSuspended && (
          <FinancialSummaryFormSheet>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Create summary
            </Button>
          </FinancialSummaryFormSheet>
        )}
      </div>

      {summaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <FileText className="h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No seasonal summaries yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create a summary for a farming season to track income, expenses, and profitability.
          </p>
          {!isSuspended && (
            <FinancialSummaryFormSheet>
              <Button size="sm" className="mt-4 gap-2">
                <Plus className="h-4 w-4" /> Create first summary
              </Button>
            </FinancialSummaryFormSheet>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {summaries.map((s) => (
            <SummaryCard
              key={s.id}
              summary={s}
              isRecalculating={isRecalculating && recalcId === s.id}
              onRecalc={() => handleRecalc(s.id)}
              onDelete={() => handleDelete(s.id)}
              isSuspended={isSuspended}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({
  summary, isRecalculating, onRecalc, onDelete, isSuspended,
}: {
  summary: FinancialSummary;
  isRecalculating: boolean;
  onRecalc: () => void;
  onDelete: () => void;
  isSuspended: boolean;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{summary.season.name} {summary.season.year}</p>
          <p className="text-xs text-muted-foreground">
            Updated {format(new Date(summary.updatedAt), "MMM d, yyyy")}
          </p>
        </div>
        <CashFlowBadge status={summary.cashFlowStatus} />
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-4 space-y-4">
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Income</p>
          <p className="font-semibold text-green-700 tabular-nums">{fmt(summary.totalIncome)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Expenses</p>
          <p className="font-semibold text-red-700 tabular-nums">{fmt(summary.totalExpenses)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Net profit</p>
          <p className={`font-semibold tabular-nums ${summary.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
            {summary.netProfit >= 0 ? "+" : ""}{fmt(summary.netProfit)}
          </p>
        </div>
      </div>

      {summary.notes && (
        <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="line-clamp-3">{summary.notes}</p>
        </div>
      )}

      {!isSuspended && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={onRecalc}
            disabled={isRecalculating}
          >
            {isRecalculating
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <RefreshCw className="h-3.5 w-3.5" />}
            Recalculate
          </Button>

          <FinancialSummaryFormSheet summary={summary}>
            <Button size="sm" variant="outline" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Edit
            </Button>
          </FinancialSummaryFormSheet>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete summary?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the financial summary for{" "}
                  {summary.season.name} {summary.season.year}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </CardContent>
  </Card>
);

/* ─── Market Prices Tab (farmer view — read-only) ─── */

const MarketPricesTab = () => {
  const [cropFilter, setCropFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const { data, isLoading } = useMarketPrices({
    limit: 50,
    cropName: cropFilter || undefined,
    marketLocation: locationFilter || undefined,
  });

  if (isLoading) return <AppLoader message="Loading market prices…" />;
  const prices = data?.prices ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          className="w-48"
          placeholder="Filter by crop…"
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
        />
        <Input
          className="w-56"
          placeholder="Filter by location…"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      {prices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No market prices found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Market prices are set by admins and used for financial summary calculations.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {prices.map((price) => (
            <MarketPriceReadCard key={price.id} price={price} />
          ))}
        </div>
      )}
    </div>
  );
};

const MarketPriceReadCard = ({ price }: { price: MarketPrice }) => (
  <Card>
    <CardContent className="pt-4 pb-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold capitalize">{price.cropName}</p>
        <p className="text-sm font-bold text-green-700 tabular-nums shrink-0">
          {fmt(price.pricePerUnit)} RWF/{price.unit}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">{price.marketLocation}</p>
      <p className="text-xs text-muted-foreground">
        Recorded {format(new Date(price.recordedAt), "MMM d, yyyy")}
      </p>
    </CardContent>
  </Card>
);

export default FarmerFinancePage;
