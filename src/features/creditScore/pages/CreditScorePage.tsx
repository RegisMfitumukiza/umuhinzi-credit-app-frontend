import { useState } from "react";
import { format } from "date-fns";
import {
  RefreshCw,
  BarChart3,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { useLatestCreditScore } from "../hooks/useLatestCreditScore";
import { useCreditScoreTrend } from "../hooks/useCreditScoreTrend";
import { useMyCreditScores } from "../hooks/useMyCreditScores";
import { useGenerateCreditScore } from "../hooks/useGenerateCreditScore";
import { ScoreGauge } from "../components/ScoreGauge";
import { RiskLevelBadge } from "../components/RiskLevelBadge";
import { ScoreFactorsBreakdown } from "../components/ScoreFactorsBreakdown";
import { CreditScoreTrendChart } from "../components/CreditScoreTrendChart";
import { RiskAssessmentCard } from "../components/RiskAssessmentCard";
import type { CreditScore } from "../types";

const CreditScorePage = () => {
  const { data: latestScore, isLoading: loadingLatest } = useLatestCreditScore();
  const { data: trend, isLoading: loadingTrend } = useCreditScoreTrend({ limit: 20 });
  const { data: historyData, isLoading: loadingHistory } = useMyCreditScores({ limit: 20 });
  const generate = useGenerateCreditScore();

  const isLoading = loadingLatest || loadingTrend || loadingHistory;

  const handleGenerate = () => {
    generate.mutate(undefined, {
      onSuccess: (res) => {
        toast.success(`Credit score generated: ${res.data.score}/100`);
      },
      onError: (err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "Failed to generate score";
        toast.error(msg);
      },
    });
  };

  if (isLoading) return <AppLoader message="Loading your credit score…" />;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Credit Score</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your agricultural creditworthiness rating based on farm data,
            yield records, and repayment history
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={generate.isPending}
          className="gap-2 shrink-0"
        >
          <RefreshCw
            className={`h-4 w-4 ${generate.isPending ? "animate-spin" : ""}`}
          />
          {latestScore ? "Refresh Score" : "Generate Score"}
        </Button>
      </div>

      {/* No score yet */}
      {!latestScore && <EmptyState onGenerate={handleGenerate} isPending={generate.isPending} />}

      {/* Score exists */}
      {latestScore && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: gauge + summary */}
          <div className="space-y-4">
            <ScoreSummaryCard score={latestScore} />
          </div>

          {/* Right columns: breakdown + assessment */}
          <div className="lg:col-span-2 space-y-6">
            {latestScore.riskAssessment && (
              <RiskAssessmentCard assessment={latestScore.riskAssessment} />
            )}

            {latestScore.summary && (
              <SummaryAlert summary={latestScore.summary} />
            )}

            {trend && trend.hasData && (
              <CreditScoreTrendChart trend={trend} />
            )}

            {latestScore.factors.length > 0 && (
              <ScoreFactorsBreakdown factors={latestScore.factors} />
            )}
          </div>
        </div>
      )}

      {/* Score history table */}
      {historyData && historyData.scores.length > 1 && (
        <ScoreHistorySection scores={historyData.scores} />
      )}
    </div>
  );
};

/* ─── Score summary card (gauge + meta) ─── */

const ScoreSummaryCard = ({ score }: { score: CreditScore }) => (
  <Card>
    <CardContent className="pt-6 space-y-4">
      <ScoreGauge score={score.score} />

      <div className="text-center space-y-2">
        <RiskLevelBadge level={score.riskLevel} className="text-xs" />
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            Generated {format(new Date(score.generatedAt), "MMM d, yyyy 'at' HH:mm")}
          </span>
        </div>
      </div>

      {/* Sub-scores mini grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
        <SubScore label="Yield" value={score.yieldConsistencyScore} />
        <SubScore label="History" value={score.farmingHistoryScore} />
        <SubScore label="Income" value={score.incomeStabilityScore} />
        <SubScore label="Repayment" value={score.repaymentBehaviorScore} />
        <SubScore label="Productivity" value={score.productivityScore} />
        <SubScore label="Data" value={score.dataCompletenessScore} />
      </div>
    </CardContent>
  </Card>
);

const SubScore = ({ label, value }: { label: string; value: number }) => (
  <div className="text-center rounded-md bg-muted/40 py-2 px-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-semibold tabular-nums">{Math.round(value)}</p>
  </div>
);

/* ─── Summary alert (data completeness warning etc) ─── */

const SummaryAlert = ({ summary }: { summary: string }) => (
  <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
    <p>{summary}</p>
  </div>
);

/* ─── Score history table ─── */

const ScoreHistorySection = ({ scores }: { scores: CreditScore[] }) => {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...scores].sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );
  const visible = expanded ? sorted : sorted.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Score History</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {scores.length} records
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Risk Level</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((s, i) => {
              const prev = sorted[i + 1];
              const delta = prev ? s.score - prev.score : null;
              return (
                <TableRow key={s.id}>
                  <TableCell className="text-sm">
                    {format(new Date(s.generatedAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-center font-semibold tabular-nums">
                    {s.score}
                  </TableCell>
                  <TableCell className="text-center">
                    <RiskLevelBadge level={s.riskLevel} />
                  </TableCell>
                  <TableCell className="text-right">
                    {delta !== null ? (
                      <span
                        className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
                          delta > 0
                            ? "text-green-600"
                            : delta < 0
                            ? "text-red-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        <TrendingUp
                          className={`h-3 w-3 ${
                            delta < 0 ? "rotate-180" : ""
                          } ${delta === 0 ? "opacity-0" : ""}`}
                        />
                        {delta > 0 ? "+" : ""}
                        {delta}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {sorted.length > 5 && (
          <div className="border-t px-4 py-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-1 text-xs text-muted-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3 w-3" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" /> Show {sorted.length - 5} more
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ─── Empty state ─── */

const EmptyState = ({
  onGenerate,
  isPending,
}: {
  onGenerate: () => void;
  isPending: boolean;
}) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
    <BarChart3 className="h-10 w-10 text-muted-foreground/40" />
    <h3 className="mt-4 font-medium">No credit score yet</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      Generate your first credit score to see how your farming data, yield
      records, and financial history translate into creditworthiness.
    </p>
    <Button
      className="mt-6 gap-2"
      onClick={onGenerate}
      disabled={isPending}
    >
      <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      Generate my score
    </Button>
  </div>
);

export default CreditScorePage;
