import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Sprout,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useFarmCrops } from "../hooks/useFarmCrops";
import { useSeasons } from "../hooks/useSeasons";
import { useCreateCrop } from "../hooks/useCreateCrop";
import { useUpdateCrop } from "../hooks/useUpdateCrop";
import { useDeleteCrop } from "../hooks/useDeleteCrop";
import {
  createCropSchema,
  cropTypeValues,
  type CreateCropSchemaType,
} from "../schemas/crop.schema";
import {
  CROP_TYPE_LABELS,
  type Crop,
} from "../types";
import { CropStatusBadge } from "./CropStatusBadge";

type View = "list" | "add" | { crop: Crop };

type Props = {
  farmId: string;
  farmName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CropsDialog = ({
  farmId,
  farmName,
  open,
  onOpenChange,
}: Props) => {
  const [view, setView] = useState<View>("list");

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) setView("list");
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        {view === "list" ? (
          <CropListView
            farmId={farmId}
            farmName={farmName}
            onAdd={() => setView("add")}
            onEdit={(crop) => setView({ crop })}
          />
        ) : (
          <CropFormView
            farmId={farmId}
            crop={view !== "add" ? view.crop : undefined}
            onBack={() => setView("list")}
            onSuccess={() => setView("list")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ─── List view ─── */

type ListViewProps = {
  farmId: string;
  farmName: string;
  onAdd: () => void;
  onEdit: (crop: Crop) => void;
};

const CropListView = ({ farmId, farmName, onAdd, onEdit }: ListViewProps) => {
  const { data: crops, isLoading } = useFarmCrops(farmId);
  const { mutate: doDelete, isPending: isDeleting } = useDeleteCrop(farmId);
  const [pendingDelete, setPendingDelete] = useState<Crop | null>(null);

  const handleDeleteConfirm = () => {
    if (!pendingDelete) return;
    doDelete(pendingDelete.id, {
      onSuccess: (res) => {
        toast.success(res.message);
        setPendingDelete(null);
      },
      onError: (err) => {
        toast.error(err.message);
        setPendingDelete(null);
      },
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-primary" />
          {farmName}
        </DialogTitle>
      </DialogHeader>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {crops?.length ?? 0} crop{crops?.length !== 1 ? "s" : ""} registered
        </p>
        <Button size="sm" className="gap-1.5" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add crop
        </Button>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : crops && crops.length > 0 ? (
        <ul className="space-y-2">
          {crops.map((crop) => (
            <li
              key={crop.id}
              className="rounded-lg border px-4 py-3 text-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{crop.cropName}</span>
                    <span className="text-xs text-muted-foreground">
                      {CROP_TYPE_LABELS[crop.cropType]}
                    </span>
                    <CropStatusBadge status={crop.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Planted&nbsp;
                      {new Date(crop.plantingDate).toLocaleDateString()}
                    </span>
                    <span>
                      {crop.season.name}&nbsp;{crop.season.year}
                    </span>
                    {crop.estimatedArea && (
                      <span>{crop.estimatedArea}&nbsp;ha</span>
                    )}
                  </div>
                  {crop.expectedHarvestDate && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Expected harvest:{" "}
                      {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                    </p>
                  )}
                  {crop.notes && (
                    <p className="mt-1 text-xs text-muted-foreground italic">
                      {crop.notes}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => onEdit(crop)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={isDeleting}
                    onClick={() => setPendingDelete(crop)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Sprout className="h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No crops yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add the crops you&apos;re growing on this farm.
          </p>
          <Button size="sm" className="mt-4 gap-1.5" onClick={onAdd}>
            <Plus className="h-3.5 w-3.5" />
            Add your first crop
          </Button>
        </div>
      )}

      {/* Controlled delete confirmation */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete crop?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{pendingDelete?.cropName}&rdquo;.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

/* ─── Form view ─── */

type FormViewProps = {
  farmId: string;
  crop?: Crop;
  onBack: () => void;
  onSuccess: () => void;
};

const CropFormView = ({ farmId, crop, onBack, onSuccess }: FormViewProps) => {
  const isEdit = !!crop;
  const { data: seasons, isLoading: loadingSeasons } = useSeasons();
  const { mutate: createMutate, isPending: isCreating, error: createError } =
    useCreateCrop();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } =
    useUpdateCrop();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCropSchemaType>({
    resolver: zodResolver(createCropSchema),
    defaultValues: crop
      ? {
          seasonId: crop.seasonId,
          cropName: crop.cropName,
          cropType: crop.cropType,
          plantingDate: crop.plantingDate.split("T")[0],
          expectedHarvestDate: crop.expectedHarvestDate
            ? crop.expectedHarvestDate.split("T")[0]
            : undefined,
          estimatedArea: crop.estimatedArea ?? undefined,
          notes: crop.notes ?? "",
        }
      : {},
  });

  const onSubmit = (data: CreateCropSchemaType) => {
    const payload = {
      ...data,
      expectedHarvestDate: data.expectedHarvestDate || undefined,
      notes: data.notes || undefined,
    };

    if (isEdit && crop) {
      updateMutate(
        { id: crop.id, payload },
        {
          onSuccess: () => {
            toast.success("Crop updated.");
            onSuccess();
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createMutate(
        { farmId, ...payload },
        {
          onSuccess: () => {
            toast.success("Crop added.");
            onSuccess();
          },
          onError: (err) => toast.error(err.message),
        }
      );
    }
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DialogTitle>{isEdit ? "Edit crop" : "Add crop"}</DialogTitle>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1 pb-4">
        {/* Season */}
        <div className="space-y-1.5">
          <Label htmlFor="c-season">
            Farming season <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="seasonId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={loadingSeasons}
              >
                <SelectTrigger id="c-season">
                  <SelectValue
                    placeholder={
                      loadingSeasons ? "Loading seasons…" : "Select season"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {seasons?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}&nbsp;{s.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {(() => {
            const selected = seasons?.find((s) => s.id === watch("seasonId"));
            if (!selected) return null;
            const fmt = (d: string) =>
              new Date(d).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
            const now = new Date();
            const isPast = new Date(selected.endDate) < now;
            const isFuture = new Date(selected.startDate) > now;
            if (isPast) {
              return (
                <p className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  This season ended {fmt(selected.endDate)}. Your planting date must fall within {fmt(selected.startDate)} — {fmt(selected.endDate)}.
                </p>
              );
            }
            if (isFuture) {
              return (
                <p className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  This season starts {fmt(selected.startDate)}. Planting date must fall within {fmt(selected.startDate)} — {fmt(selected.endDate)}.
                </p>
              );
            }
            return (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                Active season: {fmt(selected.startDate)} — {fmt(selected.endDate)}
              </p>
            );
          })()}
          {errors.seasonId && (
            <p className="text-sm text-destructive">{errors.seasonId.message}</p>
          )}
        </div>

        {/* Crop name + type */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="c-name">
              Crop name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="c-name"
              placeholder="e.g. Maize"
              {...register("cropName")}
            />
            {errors.cropName && (
              <p className="text-sm text-destructive">
                {errors.cropName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>
              Type <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="cropType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypeValues.map((t) => (
                      <SelectItem key={t} value={t}>
                        {CROP_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cropType && (
              <p className="text-sm text-destructive">
                {errors.cropType.message}
              </p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="c-plant">
              Planting date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="c-plant"
              type="date"
              {...register("plantingDate")}
            />
            {errors.plantingDate && (
              <p className="text-sm text-destructive">
                {errors.plantingDate.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-harvest">Expected harvest</Label>
            <Input
              id="c-harvest"
              type="date"
              {...register("expectedHarvestDate")}
            />
          </div>
        </div>

        {/* Area */}
        <div className="space-y-1.5">
          <Label htmlFor="c-area">Estimated area (ha)</Label>
          <Input
            id="c-area"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 0.5"
            {...register("estimatedArea", {
              setValueAs: (v) => (v === "" ? undefined : parseFloat(v as string)),
            })}
          />
          {errors.estimatedArea && (
            <p className="text-sm text-destructive">
              {errors.estimatedArea.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="c-notes">Notes</Label>
          <Textarea
            id="c-notes"
            placeholder="Optional notes about this crop…"
            rows={2}
            {...register("notes")}
          />
        </div>

        {apiError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {apiError.message}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Add crop"}
          </Button>
        </div>
      </form>
    </>
  );
};
