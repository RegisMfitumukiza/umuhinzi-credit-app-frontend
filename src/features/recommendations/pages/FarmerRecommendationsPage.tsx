import { useState } from "react";
import { Lightbulb } from "lucide-react";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";

import { useRecommendations } from "../hooks/useRecommendations";
import { RecommendationCard } from "../components/RecommendationCard";
import { RECOMMENDATION_TYPE_LABELS } from "../types";
import type { RecommendationStatus, RecommendationType } from "../types";

const STATUS_TABS: { value: RecommendationStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "READ", label: "Read" },
  { value: "DISMISSED", label: "Dismissed" },
  { value: "ARCHIVED", label: "Archived" },
];

const TYPE_OPTIONS = [
  { value: "ALL", label: "All types" },
  ...Object.entries(RECOMMENDATION_TYPE_LABELS).map(([value, label]) => ({ value, label })),
];

const FarmerRecommendationsPage = () => {
  const [statusTab, setStatusTab] = useState<RecommendationStatus | "ALL">("ACTIVE");
  const [typeFilter, setTypeFilter] = useState<RecommendationType | "ALL">("ALL");

  const { data, isLoading } = useRecommendations({
    limit: 50,
    status: statusTab === "ALL" ? undefined : statusTab,
    type: typeFilter === "ALL" ? undefined : typeFilter,
  });

  const { data: activeData } = useRecommendations({ status: "ACTIVE", limit: 50 });

  const recommendations = data?.recommendations ?? [];
  const activeCount = activeData?.recommendations.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Recommendations</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Personalized guidance to improve your credit profile and farming outcomes
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {activeCount} active
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as RecommendationType | "ALL")}
        >
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as RecommendationStatus | "ALL")}>
        <TabsList className="flex-wrap h-auto gap-1">
          {STATUS_TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
        </TabsList>

        {STATUS_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {isLoading ? (
              <AppLoader message="Loading recommendations…" />
            ) : recommendations.length === 0 ? (
              <EmptyState status={tab.value} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {recommendations.map((r) => (
                  <RecommendationCard key={r.id} recommendation={r} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const EmptyState = ({ status }: { status: string }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
    <Lightbulb className="h-10 w-10 text-muted-foreground/40" />
    <h3 className="mt-4 font-medium">
      {status === "ACTIVE" ? "No active recommendations" : "No recommendations found"}
    </h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      {status === "ACTIVE"
        ? "Generate a credit score to receive personalized recommendations based on your profile."
        : "Recommendations will appear here as you engage with the platform."}
    </p>
  </div>
);

export default FarmerRecommendationsPage;
