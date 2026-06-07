import { useState } from "react";
import { Plus, Trash2, Loader2, Lightbulb } from "lucide-react";
import { toast } from "sonner";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

import { useRecommendations } from "../hooks/useRecommendations";
import { useDeleteRecommendation } from "../hooks/useDeleteRecommendation";
import { RecommendationCard } from "../components/RecommendationCard";
import { RecommendationFormSheet } from "../components/RecommendationFormSheet";
import { RECOMMENDATION_TYPE_LABELS, RECOMMENDATION_PRIORITY_LABELS } from "../types";
import type { RecommendationStatus, RecommendationType, RecommendationPriority, Recommendation } from "../types";

const STATUS_OPTIONS: { value: RecommendationStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "READ", label: "Read" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "DISMISSED", label: "Dismissed" },
];

const TYPE_OPTIONS = [
  { value: "ALL", label: "All types" },
  ...Object.entries(RECOMMENDATION_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const PRIORITY_OPTIONS = [
  { value: "ALL", label: "All priorities" },
  ...Object.entries(RECOMMENDATION_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const AdminRecommendationsPage = () => {
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<RecommendationType | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<RecommendationPriority | "ALL">("ALL");

  const { data, isLoading } = useRecommendations({
    limit: 50,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    type: typeFilter === "ALL" ? undefined : typeFilter,
    priority: priorityFilter === "ALL" ? undefined : priorityFilter,
  });

  const { mutate: doDelete, isPending: isDeleting, variables: deletingId } = useDeleteRecommendation();

  const recommendations = data?.recommendations ?? [];

  const handleDelete = (id: string) => {
    doDelete(id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Recommendations</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage personalized guidance sent to farmers
          </p>
        </div>
        <RecommendationFormSheet>
          <Button className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Create
          </Button>
        </RecommendationFormSheet>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as RecommendationStatus | "ALL")}
        >
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as RecommendationType | "ALL")}
        >
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v as RecommendationPriority | "ALL")}
        >
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {recommendations.length > 0 && (
          <p className="ml-auto self-center text-sm text-muted-foreground">
            {recommendations.length} result{recommendations.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <AppLoader message="Loading recommendations…" />
      ) : recommendations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((r) => (
            <AdminRecommendationCard
              key={r.id}
              recommendation={r}
              isDeleting={isDeleting && deletingId === r.id}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AdminRecommendationCard = ({
  recommendation: r,
  isDeleting,
  onDelete,
}: {
  recommendation: Recommendation;
  isDeleting: boolean;
  onDelete: () => void;
}) => (
  <div className="relative">
    <RecommendationCard recommendation={r} showFarmer readOnly />

    {/* Admin actions overlay at the bottom */}
    <div className="mt-2 flex gap-2">
      <RecommendationFormSheet recommendation={r}>
        <Button size="sm" variant="outline" className="flex-1">Edit</Button>
      </RecommendationFormSheet>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            disabled={isDeleting}
          >
            {isDeleting
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Trash2 className="h-3.5 w-3.5" />}
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete recommendation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{r.title}" and cannot be undone.
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
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
    <Lightbulb className="h-10 w-10 text-muted-foreground/40" />
    <h3 className="mt-4 font-medium">No recommendations found</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      Recommendations are created automatically from credit score analysis, loan events,
      and market data — or you can create them manually.
    </p>
    <RecommendationFormSheet>
      <Button className="mt-4 gap-2">
        <Plus className="h-4 w-4" /> Create manually
      </Button>
    </RecommendationFormSheet>
  </div>
);

export default AdminRecommendationsPage;
