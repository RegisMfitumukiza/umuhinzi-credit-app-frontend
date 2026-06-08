import { useState } from "react";
import { format } from "date-fns";
import { ShieldCheck } from "lucide-react";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";

import { useAllYields } from "../hooks/useAllYields";
import { VerifyYieldSheet } from "../components/VerifyYieldSheet";
import { QualityGradeBadge } from "../components/QualityGradeBadge";
import { VerificationBadge } from "../components/VerificationBadge";
import type { YieldRecord, YieldVerificationStatus } from "../types";

const STATUS_OPTIONS: { label: string; value: YieldVerificationStatus | "ALL" }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
];

const AdminYieldsPage = () => {
  const [statusFilter, setStatusFilter] = useState<YieldVerificationStatus | "ALL">("ALL");

  const filters = {
    limit: 50,
    ...(statusFilter !== "ALL" && { verificationStatus: statusFilter }),
  };

  const { data, isLoading } = useAllYields(filters);
  const yields = data?.yields ?? [];
  const pagination = data?.pagination;

  const pendingCount = yields.filter((y) => y.verificationStatus === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Yield verification</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Review and verify harvest yield records submitted by farmers
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            {pendingCount} pending
          </Badge>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="w-44">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as YieldVerificationStatus | "ALL")}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {pagination && (
          <p className="self-center text-sm text-muted-foreground">
            {pagination.total} record{pagination.total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {isLoading && <AppLoader message="Loading yield records…" />}

      {!isLoading && yields.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <ShieldCheck className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-4 font-medium">No yield records found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {statusFilter === "PENDING"
              ? "No yield records are awaiting verification."
              : "No yield records match the current filter."}
          </p>
        </div>
      )}

      {!isLoading && yields.length > 0 && (
        <div className="space-y-2">
          {yields.map((y) => (
            <AdminYieldRow key={y.id} yieldRecord={y} />
          ))}
        </div>
      )}
    </div>
  );
};

const AdminYieldRow = ({ yieldRecord: y }: { yieldRecord: YieldRecord }) => {
  const isPending = y.verificationStatus === "PENDING";

  return (
    <Card className={isPending ? "border-amber-200 bg-amber-50/30" : undefined}>
      <CardContent className="py-3">
        <div className="flex flex-wrap items-start gap-3">
          {/* Main info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold">{y.crop.cropName}</p>
              <VerificationBadge status={y.verificationStatus} />
              <QualityGradeBadge grade={y.qualityGrade} />
              {y.verificationRiskScore != null && y.verificationRiskScore > 0 && (
                <Badge variant="outline" className="text-xs border-orange-200 bg-orange-50 text-orange-700">
                  Risk score: {y.verificationRiskScore}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              <span className="font-medium">{y.crop.farm.name}</span> ·{" "}
              Harvested {format(new Date(y.harvestDate), "MMM d, yyyy")}
            </p>

            {y.notes && (
              <p className="text-xs text-muted-foreground italic line-clamp-1">"{y.notes}"</p>
            )}
          </div>

          {/* Yield numbers */}
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold tabular-nums">
              {(y.verifiedActualYield ?? y.actualYield).toLocaleString("en-RW")}{" "}
              {y.verifiedUnit ?? y.unit}
            </p>
            {y.expectedYield != null && (
              <p className="text-xs text-muted-foreground">
                Expected: {y.expectedYield.toLocaleString("en-RW")} {y.unit}
              </p>
            )}
            {y.verifiedActualYield != null && y.verifiedActualYield !== y.actualYield && (
              <p className="text-xs text-muted-foreground">
                Farmer reported: {y.actualYield.toLocaleString("en-RW")} {y.unit}
              </p>
            )}
          </div>

          {/* Verification info or action */}
          <div className="shrink-0 self-center">
            {isPending ? (
              <VerifyYieldSheet yieldRecord={y}>
                <Button size="sm" className="gap-1.5 h-8">
                  <ShieldCheck className="h-3.5 w-3.5" /> Review
                </Button>
              </VerifyYieldSheet>
            ) : (
              <div className="text-right">
                {y.verificationMethod && (
                  <p className="text-xs text-muted-foreground">
                    {y.verificationMethod === "FIELD_VISIT" ? "Field visit" : "Coop record"}
                  </p>
                )}
                {y.verifiedAt && (
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(y.verifiedAt), "MMM d, yyyy")}
                  </p>
                )}
                {y.verifiedBy && (
                  <p className="text-xs text-muted-foreground">{y.verifiedBy.fullName}</p>
                )}
                <VerifyYieldSheet yieldRecord={y}>
                  <Button size="sm" variant="outline" className="mt-1.5 h-7 text-xs">Re-review</Button>
                </VerifyYieldSheet>
              </div>
            )}
          </div>
        </div>

        {/* Risk note */}
        {y.verificationRiskNote && (
          <>
            <Separator className="my-2" />
            <p className="text-xs text-orange-700 rounded bg-orange-50 border border-orange-200 px-2 py-1">
              Risk: {y.verificationRiskNote}
            </p>
          </>
        )}

        {/* Verification note */}
        {y.verificationNote && (
          <>
            <Separator className="my-2" />
            <p className="text-xs text-muted-foreground px-1">
              Note: {y.verificationNote}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminYieldsPage;
