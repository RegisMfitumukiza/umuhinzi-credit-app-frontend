import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Loader2, Sprout, Search, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine,
} from "recharts";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Separator } from "@/shared/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

import { useMyFarmer } from "@/features/farmers/hooks/useMyFarmer";
import { useProductivityDashboard } from "../hooks/useProductivityDashboard";
import { useProductivityBenchmark } from "../hooks/useProductivityBenchmark";
import { useMyYields } from "../hooks/useMyYields";
import { useProductivityRecords } from "../hooks/useProductivityRecords";
import { useDeleteYield } from "../hooks/useDeleteYield";
import { useDeleteProductivityRecord } from "../hooks/useDeleteProductivityRecord";
import { YieldFormSheet } from "../components/YieldFormSheet";
import { ProductivityRecordFormSheet } from "../components/ProductivityRecordFormSheet";
import { QualityGradeBadge } from "../components/QualityGradeBadge";
import { VerificationBadge } from "../components/VerificationBadge";
import type { YieldRecord, ProductivityRecord } from "../types";
import {
  PERFORMANCE_RATING_LABELS, PERFORMANCE_RATING_STYLES,
} from "../types";

const fmt = (n: number, d = 1) => n.toLocaleString("en-RW", { maximumFractionDigits: d });

const FarmerProductivityPage = () => {
  const { data: farmer, isLoading: loadingFarmer } = useMyFarmer();
  if (loadingFarmer) return <AppLoader message="Loading…" />;
  const isSuspended = farmer?.status === "SUSPENDED";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Productivity</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Track harvest yields, seasonal productivity, and benchmark against district averages
        </p>
      </div>

      {isSuspended && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Suspended farmers cannot manage productivity records.
        </div>
      )}

      <Tabs defaultValue="dashboard">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="yields">Yield records</TabsTrigger>
          <TabsTrigger value="records">Seasonal records</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardTab />
        </TabsContent>
        <TabsContent value="yields" className="mt-6">
          <YieldsTab isSuspended={isSuspended} />
        </TabsContent>
        <TabsContent value="records" className="mt-6">
          <RecordsTab isSuspended={isSuspended} />
        </TabsContent>
        <TabsContent value="benchmark" className="mt-6">
          <BenchmarkTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ─── Dashboard Tab ─── */

const DashboardTab = () => {
  const { data: dashboard, isLoading } = useProductivityDashboard();

  if (isLoading) return <AppLoader message="Loading dashboard…" />;
  if (!dashboard) return <EmptyDashboard />;

  const { summary, currentSeason, seasonalTrend } = dashboard;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Seasons tracked" value={String(summary.totalSeasons)} accent="bg-blue-50" icon={<TrendingUp className="h-4 w-4 text-blue-600" />} />
        <StatCard label="Avg productivity" value={`${fmt(summary.averageProductivityRate)}%`} accent="bg-emerald-50" icon={<TrendingUp className="h-4 w-4 text-emerald-600" />} />
        <StatCard label="Best season rate" value={summary.bestSeasonRate != null ? `${fmt(summary.bestSeasonRate)}%` : "—"} accent="bg-amber-50" icon={<TrendingUp className="h-4 w-4 text-amber-600" />} />
        <StatCard label="Best season" value={summary.bestSeasonName ?? "—"} accent="bg-purple-50" icon={<TrendingUp className="h-4 w-4 text-purple-600" />} />
      </div>

      {/* Current season */}
      {currentSeason && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Current season</h3>
              <Badge variant="outline" className="text-xs">
                {currentSeason.season.name} {currentSeason.season.year}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Crops planted</p>
                <p className="font-semibold">{currentSeason.cropsPlanted}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estimated area</p>
                <p className="font-semibold">{fmt(currentSeason.totalEstimatedArea)} ha</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Productivity rate</p>
                <p className="font-semibold">
                  {currentSeason.productivityRate != null ? `${fmt(currentSeason.productivityRate)}%` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total yield</p>
                <p className="font-semibold">
                  {currentSeason.totalActualYield != null
                    ? `${fmt(currentSeason.totalActualYield)} ${currentSeason.yieldUnit ?? ""}`
                    : "—"}
                </p>
              </div>
            </div>

            {/* Crop status breakdown */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Crop status breakdown</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(currentSeason.statusBreakdown)
                  .filter(([, count]) => count > 0)
                  .map(([status, count]) => (
                    <span key={status} className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                      <StatusDot status={status} />
                      {status.charAt(0) + status.slice(1).toLowerCase()}: {count}
                    </span>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seasonal trend chart */}
      {seasonalTrend.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-semibold">Seasonal productivity trend</h3>
            <p className="text-xs text-muted-foreground">Productivity rate (%) over last 8 seasons</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[...seasonalTrend].reverse()} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="season" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  formatter={(value: unknown) => [`${fmt(Number(value))}%`, "Productivity rate"]}
                />
                <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="4 2" label={{ value: "100%", fontSize: 10, fill: "#16a34a" }} />
                <Bar dataKey="productivityRate" name="Rate %" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const StatCard = ({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: React.ReactNode }) => (
  <Card>
    <CardContent className="pt-4 pb-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent} mb-3`}>{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums truncate">{value}</p>
    </CardContent>
  </Card>
);

const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    PLANNED: "bg-gray-400",
    PLANTED: "bg-blue-400",
    GROWING: "bg-emerald-400",
    HARVESTED: "bg-green-600",
    FAILED: "bg-red-400",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status] ?? "bg-gray-300"}`} />;
};

const EmptyDashboard = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
    <TrendingUp className="h-10 w-10 text-muted-foreground/40" />
    <h3 className="mt-4 font-medium">No productivity data yet</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      Record harvest yields and get them verified to see your productivity dashboard.
    </p>
  </div>
);

/* ─── Yields Tab ─── */

const YieldsTab = ({ isSuspended }: { isSuspended: boolean }) => {
  const { data, isLoading } = useMyYields({ limit: 50 });
  const { mutate: doDelete, isPending: isDeleting, variables: deletingId } = useDeleteYield();
  const yields = data?.yields ?? [];

  const handleDelete = (id: string) => {
    doDelete(id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (err) => toast.error(err.message),
    });
  };

  if (isLoading) return <AppLoader message="Loading yields…" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {yields.length > 0 ? `${yields.length} yield record${yields.length !== 1 ? "s" : ""}` : "No yield records"}
        </p>
        {!isSuspended && (
          <YieldFormSheet>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Record yield
            </Button>
          </YieldFormSheet>
        )}
      </div>

      {yields.length === 0 ? (
        <EmptyYields isSuspended={isSuspended} />
      ) : (
        <div className="space-y-2">
          {yields.map((y) => (
            <YieldRow
              key={y.id}
              yieldRecord={y}
              isDeleting={isDeleting && deletingId === y.id}
              onDelete={() => handleDelete(y.id)}
              isSuspended={isSuspended}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const YieldRow = ({ yieldRecord: y, isDeleting, onDelete, isSuspended }: {
  yieldRecord: YieldRecord;
  isDeleting: boolean;
  onDelete: () => void;
  isSuspended: boolean;
}) => (
  <Card>
    <CardContent className="flex flex-wrap items-center gap-3 py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold">{y.crop.cropName}</p>
          <VerificationBadge status={y.verificationStatus} />
          <QualityGradeBadge grade={y.qualityGrade} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {y.crop.farm.name} · {format(new Date(y.harvestDate), "MMM d, yyyy")}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold tabular-nums">
          {fmt(y.verifiedActualYield ?? y.actualYield)} {y.verifiedUnit ?? y.unit}
        </p>
        {y.expectedYield != null && (
          <p className="text-xs text-muted-foreground">
            Expected: {fmt(y.expectedYield)} {y.unit}
          </p>
        )}
      </div>

      {y.verificationRiskScore != null && y.verificationRiskScore > 0 && (
        <Badge variant="outline" className="text-xs border-amber-200 bg-amber-50 text-amber-700">
          Risk: {y.verificationRiskScore}
        </Badge>
      )}

      {!isSuspended && y.verificationStatus !== "VERIFIED" && (
        <div className="flex items-center gap-1 shrink-0">
          <YieldFormSheet yieldRecord={y}>
            <Button size="sm" variant="outline" className="h-7 text-xs">Edit</Button>
          </YieldFormSheet>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon" variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete yield record?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the yield record for {y.crop.cropName}.
                  If this was verified, the productivity record will be recalculated.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </CardContent>
  </Card>
);

const EmptyYields = ({ isSuspended }: { isSuspended: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
    <Sprout className="h-8 w-8 text-muted-foreground/40" />
    <p className="mt-3 text-sm font-medium">No yield records</p>
    <p className="mt-1 text-xs text-muted-foreground">
      Record your harvest yield for each crop to track productivity and get credit score improvements.
    </p>
    {!isSuspended && (
      <YieldFormSheet>
        <Button size="sm" className="mt-4 gap-2"><Plus className="h-4 w-4" /> Record first yield</Button>
      </YieldFormSheet>
    )}
  </div>
);

/* ─── Seasonal Records Tab ─── */

const RecordsTab = ({ isSuspended }: { isSuspended: boolean }) => {
  const { data, isLoading } = useProductivityRecords({ limit: 20 });
  const { mutate: doDelete, isPending: isDeleting, variables: deletingId } = useDeleteProductivityRecord();
  const records = data?.records ?? [];

  const handleDelete = (id: string) => {
    doDelete(id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (err) => toast.error(err.message),
    });
  };

  if (isLoading) return <AppLoader message="Loading records…" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Productivity records are auto-generated when yield records are verified.
          </p>
        </div>
        {!isSuspended && (
          <ProductivityRecordFormSheet>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Create manually
            </Button>
          </ProductivityRecordFormSheet>
        )}
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No seasonal records yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Records appear automatically once verified yields exist for a season.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {records.map((r) => (
            <ProductivityRecordCard
              key={r.id}
              record={r}
              isDeleting={isDeleting && deletingId === r.id}
              onDelete={() => handleDelete(r.id)}
              isSuspended={isSuspended}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductivityRecordCard = ({
  record: r, isDeleting, onDelete, isSuspended,
}: {
  record: ProductivityRecord;
  isDeleting: boolean;
  onDelete: () => void;
  isSuspended: boolean;
}) => {
  const rateColor =
    r.productivityRate >= 100 ? "text-green-700"
      : r.productivityRate >= 75 ? "text-emerald-700"
      : r.productivityRate >= 50 ? "text-yellow-700"
      : "text-red-700";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{r.season.name} {r.season.year}</p>
          <span className={`text-2xl font-bold tabular-nums ${rateColor}`}>
            {fmt(r.productivityRate)}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Updated {format(new Date(r.updatedAt), "MMM d, yyyy")}</p>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Actual yield</p>
            <p className="font-semibold tabular-nums">{fmt(r.totalActualYield)} {r.unit}</p>
          </div>
          {r.totalExpectedYield != null && (
            <div>
              <p className="text-xs text-muted-foreground">Expected yield</p>
              <p className="font-semibold tabular-nums">{fmt(r.totalExpectedYield)} {r.unit}</p>
            </div>
          )}
        </div>

        {r.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2 rounded-md bg-muted/50 p-2">{r.notes}</p>
        )}

        {!isSuspended && (
          <div className="flex gap-2">
            <ProductivityRecordFormSheet record={r}>
              <Button size="sm" variant="outline" className="flex-1">Edit</Button>
            </ProductivityRecordFormSheet>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm" variant="ghost"
                  className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete productivity record?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete the {r.season.name} {r.season.year} productivity record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ─── Benchmark Tab ─── */

const BenchmarkTab = () => {
  const [inputValue, setInputValue] = useState("");
  const [cropName, setCropName] = useState("");
  const { data: benchmark, isLoading, isFetching } = useProductivityBenchmark(cropName);

  const handleSearch = () => {
    setCropName(inputValue.trim());
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Compare your verified yield per hectare against district and national averages.
          Only verified yields with recorded crop area are included.
        </p>
      </div>

      <div className="flex gap-3">
        <Input
          className="max-w-xs"
          placeholder="Crop name (e.g. Maize)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={!inputValue.trim() || isFetching} className="gap-2">
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Compare
        </Button>
      </div>

      {isLoading && <AppLoader message="Loading benchmark…" />}

      {benchmark && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-semibold capitalize">{benchmark.cropName}</h3>
            <Badge variant="outline" className={`${PERFORMANCE_RATING_STYLES[benchmark.performanceRating]}`}>
              {PERFORMANCE_RATING_LABELS[benchmark.performanceRating]}
            </Badge>
            <p className="text-xs text-muted-foreground ml-auto">{benchmark.note}</p>
          </div>

          {/* Comparison cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <BenchmarkCard
              title="Your performance"
              avgYieldPerHa={benchmark.farmer.avgYieldPerHa}
              records={benchmark.farmer.recordCount}
              unit={benchmark.yieldUnit}
              extra={benchmark.farmer.district ? `District: ${benchmark.farmer.district}` : undefined}
              highlight
            />
            <BenchmarkCard
              title={benchmark.districtBenchmark ? `${benchmark.districtBenchmark.district} avg` : "District avg"}
              avgYieldPerHa={benchmark.districtBenchmark?.avgYieldPerHa ?? null}
              records={benchmark.districtBenchmark?.recordCount ?? 0}
              unit={benchmark.yieldUnit}
              extra={benchmark.districtBenchmark?.farmerPercentile != null
                ? `You're above ${benchmark.districtBenchmark.farmerPercentile}% of farmers`
                : undefined}
            />
            <BenchmarkCard
              title="National avg"
              avgYieldPerHa={benchmark.nationalBenchmark.avgYieldPerHa}
              records={benchmark.nationalBenchmark.totalRecords}
              unit={benchmark.yieldUnit}
            />
          </div>

          {/* Top districts */}
          {benchmark.topDistrictsByYield.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-semibold">Top districts by yield</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {benchmark.topDistrictsByYield.map((d, i) => (
                    <div key={d.district} className="flex items-center gap-3">
                      <span className="w-5 text-xs text-muted-foreground font-medium">#{i + 1}</span>
                      <span className="flex-1 text-sm">{d.district}</span>
                      <span className="text-sm font-semibold tabular-nums">{fmt(d.avgYieldPerHa)} {benchmark.yieldUnit}</span>
                      <span className="text-xs text-muted-foreground">{d.recordCount} records</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!benchmark && !isLoading && cropName && (
        <div className="rounded-lg border border-dashed py-10 text-center">
          <p className="text-sm text-muted-foreground">No benchmark data found for "{cropName}".</p>
        </div>
      )}
    </div>
  );
};

const BenchmarkCard = ({
  title, avgYieldPerHa, records, unit, extra, highlight,
}: {
  title: string;
  avgYieldPerHa: number | null;
  records: number;
  unit: string;
  extra?: string;
  highlight?: boolean;
}) => (
  <Card className={highlight ? "border-primary/30 bg-primary/5" : undefined}>
    <CardContent className="pt-4 pb-4 space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
      <p className={`text-2xl font-bold tabular-nums ${highlight ? "text-primary" : ""}`}>
        {avgYieldPerHa != null ? `${fmt(avgYieldPerHa, 1)}` : "—"}
      </p>
      <p className="text-xs text-muted-foreground">{unit} · {records} record{records !== 1 ? "s" : ""}</p>
      {extra && <p className="text-xs text-muted-foreground border-t pt-2">{extra}</p>}
    </CardContent>
  </Card>
);

export default FarmerProductivityPage;
