import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import type { CreditScoreFactor } from "../types";
import { FACTOR_TYPE_LABELS } from "../types";

type Props = { factors: CreditScoreFactor[] };

export const ScoreFactorsBreakdown = ({ factors }: Props) => {
  if (factors.length === 0) return null;

  const sorted = [...factors].sort((a, b) => b.contribution - a.contribution);

  return (
    <Card>
      <CardHeader className="pb-3">
        <h3 className="text-sm font-semibold">Score Breakdown</h3>
        <p className="text-xs text-muted-foreground">
          How each factor contributes to your total score
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.map((factor) => {
          const label =
            FACTOR_TYPE_LABELS[factor.type] ?? factor.factorName;
          const pct = Math.round(factor.factorValue);
          const weightPct = Math.round(factor.weight * 100);
          return (
            <div key={factor.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {pct}
                  <span className="text-xs"> / 100</span>
                  <span className="ml-2 text-xs text-muted-foreground/60">
                    ({weightPct}% weight)
                  </span>
                </span>
              </div>
              <Progress value={pct} className="h-2" />
              {factor.description && (
                <p className="text-xs text-muted-foreground">
                  {factor.description}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
