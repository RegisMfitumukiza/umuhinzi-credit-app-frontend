import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Loader2, Coins } from "lucide-react";
import { toast } from "sonner";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

import { useMyFarms } from "@/features/farms/hooks/useMyFarms";
import { useFarmCrops } from "@/features/crops/hooks/useFarmCrops";
import { useMyFarmer } from "@/features/farmers/hooks/useMyFarmer";

import { useMyInputCosts } from "../hooks/useMyInputCosts";
import { useDeleteInputCost } from "../hooks/useDeleteInputCost";
import { InputCostFormSheet } from "../components/InputCostFormSheet";
import { INPUT_TYPE_LABELS, INPUT_TYPE_COLORS } from "../types";
import type { InputCost, InputType } from "../types";

const fmt = (n: number) => n.toLocaleString("en-RW", { maximumFractionDigits: 0 });

const TYPE_OPTIONS = [
  { value: "ALL", label: "All types" },
  ...Object.entries(INPUT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const InputCostsPage = () => {
  const { data: farmer, isLoading: loadingFarmer } = useMyFarmer();
  const { data: farmsData } = useMyFarms();
  const farms = farmsData?.farms ?? [];

  const [selectedFarmId, setSelectedFarmId] = useState<string>("ALL");
  const [selectedCropId, setSelectedCropId] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<InputType | "ALL">("ALL");

  const { data: crops } = useFarmCrops(
    selectedFarmId !== "ALL" ? selectedFarmId : "",
    selectedFarmId !== "ALL"
  );

  const { data, isLoading } = useMyInputCosts({
    limit: 100,
    cropId: selectedCropId !== "ALL" ? selectedCropId : undefined,
    type: typeFilter !== "ALL" ? typeFilter : undefined,
  });

  const { mutate: doDelete, isPending: isDeleting, variables: deletingId } = useDeleteInputCost();

  if (loadingFarmer) return <AppLoader message="Loading…" />;

  const isSuspended = farmer?.status === "SUSPENDED";
  const inputCosts = data?.inputCosts ?? [];

  const totalCost = inputCosts.reduce((sum, ic) => sum + ic.totalCost, 0);

  const handleDelete = (id: string) => {
    doDelete(id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleFarmChange = (farmId: string) => {
    setSelectedFarmId(farmId);
    setSelectedCropId("ALL");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Input Costs</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Track all input costs across your crops — seeds, fertilizers, labor, and more
          </p>
        </div>
        {!isSuspended && (
          <InputCostFormSheet>
            <Button className="gap-2 shrink-0">
              <Plus className="h-4 w-4" /> Record cost
            </Button>
          </InputCostFormSheet>
        )}
      </div>

      {isSuspended && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Suspended farmers cannot manage input costs.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedFarmId} onValueChange={handleFarmChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All farms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All farms</SelectItem>
            {farms.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedFarmId !== "ALL" && (
          <Select value={selectedCropId} onValueChange={setSelectedCropId}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="All crops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All crops in farm</SelectItem>
              {crops?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.cropName} — {c.season.name} {c.season.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as InputType | "ALL")}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary strip */}
      {inputCosts.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="rounded-full border bg-muted/40 px-3 py-1 text-xs">
            <span className="text-muted-foreground">Records: </span>
            <span className="font-semibold">{inputCosts.length}</span>
          </div>
          <div className="rounded-full border bg-muted/40 px-3 py-1 text-xs">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-semibold text-red-700">{fmt(totalCost)} RWF</span>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <AppLoader message="Loading input costs…" />
      ) : inputCosts.length === 0 ? (
        <EmptyState isSuspended={isSuspended} />
      ) : (
        <div className="space-y-2">
          {inputCosts.map((ic) => (
            <InputCostRow
              key={ic.id}
              inputCost={ic}
              isDeleting={isDeleting && deletingId === ic.id}
              onDelete={() => handleDelete(ic.id)}
              isSuspended={isSuspended}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const InputCostRow = ({
  inputCost: ic, isDeleting, onDelete, isSuspended,
}: {
  inputCost: InputCost;
  isDeleting: boolean;
  onDelete: () => void;
  isSuspended: boolean;
}) => (
  <Card>
    <CardContent className="flex flex-wrap items-center gap-3 py-3">
      {/* Type badge */}
      <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${INPUT_TYPE_COLORS[ic.type]}`}>
        {INPUT_TYPE_LABELS[ic.type]}
      </span>

      {/* Name + crop info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{ic.name}</p>
        <p className="text-xs text-muted-foreground">
          {ic.crop.cropName} · {ic.crop.season.name} {ic.crop.season.year}
        </p>
      </div>

      {/* Qty */}
      {ic.quantity != null && (
        <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
          {ic.quantity} {ic.unit ?? ""}
        </span>
      )}

      {/* Unit cost */}
      {ic.unitCost != null && (
        <span className="text-xs text-muted-foreground shrink-0 hidden md:block">
          {fmt(ic.unitCost)} /unit
        </span>
      )}

      {/* Total */}
      <p className="text-sm font-bold tabular-nums text-red-700 shrink-0">
        {fmt(ic.totalCost)} RWF
      </p>

      {/* Date */}
      <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
        {format(new Date(ic.dateUsed), "MMM d, yyyy")}
      </p>

      {/* Status chip */}
      <Badge variant="outline" className="text-xs shrink-0">
        {ic.crop.cropName}
      </Badge>

      {/* Actions */}
      {!isSuspended && (
        <div className="flex items-center gap-1 shrink-0">
          <InputCostFormSheet inputCost={ic}>
            <Button size="sm" variant="outline" className="h-7 text-xs">Edit</Button>
          </InputCostFormSheet>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isDeleting}
              >
                {isDeleting
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete input cost?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the "{ic.name}" ({INPUT_TYPE_LABELS[ic.type]}) cost
                  of {fmt(ic.totalCost)} RWF. Related financial summaries will be updated automatically.
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

const EmptyState = ({ isSuspended }: { isSuspended: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
    <Coins className="h-10 w-10 text-muted-foreground/40" />
    <h3 className="mt-4 font-medium">No input costs recorded</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      Track seeds, fertilizers, labor, irrigation and all other input costs tied to your crops.
      These feed directly into your financial summaries and credit score.
    </p>
    {!isSuspended && (
      <InputCostFormSheet>
        <Button className="mt-4 gap-2">
          <Plus className="h-4 w-4" /> Record first cost
        </Button>
      </InputCostFormSheet>
    )}
  </div>
);

export default InputCostsPage;
