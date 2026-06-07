import { ShieldAlert, Lightbulb } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card";
import type { RiskAssessment } from "../types";
import { RiskLevelBadge } from "./RiskLevelBadge";

type Props = { assessment: RiskAssessment };

export const RiskAssessmentCard = ({ assessment }: Props) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Risk Assessment</h3>
        <RiskLevelBadge level={assessment.riskLevel} />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {assessment.reason && (
        <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Assessment
            </p>
            <p className="text-sm">{assessment.reason}</p>
          </div>
        </div>
      )}
      {assessment.recommendedAction && (
        <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
              Recommendation
            </p>
            <p className="text-sm">{assessment.recommendedAction}</p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);
