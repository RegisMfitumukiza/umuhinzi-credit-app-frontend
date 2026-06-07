import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";

import { useCreateRecommendation } from "../hooks/useCreateRecommendation";
import { useUpdateRecommendation } from "../hooks/useUpdateRecommendation";
import {
  createRecommendationSchema, updateRecommendationSchema,
  type CreateRecommendationSchemaType, type UpdateRecommendationSchemaType,
} from "../schemas/recommendation.schema";
import type { Recommendation, UpdateRecommendationPayload } from "../types";
import { RECOMMENDATION_TYPE_LABELS, RECOMMENDATION_PRIORITY_LABELS } from "../types";

type Props = {
  recommendation?: Recommendation;
  farmerId?: string;
  children: React.ReactNode;
};

const TYPES = Object.entries(RECOMMENDATION_TYPE_LABELS) as [string, string][];
const PRIORITIES = Object.entries(RECOMMENDATION_PRIORITY_LABELS) as [string, string][];

export const RecommendationFormSheet = ({ recommendation, farmerId, children }: Props) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!recommendation;

  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateRecommendation();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateRecommendation();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const {
    register, control, handleSubmit, reset,
    formState: { errors, dirtyFields },
  } = useForm<UpdateRecommendationSchemaType>({
    resolver: zodResolver(isEdit ? updateRecommendationSchema : createRecommendationSchema),
    defaultValues: recommendation
      ? {
          type: recommendation.type,
          priority: recommendation.priority,
          title: recommendation.title,
          message: recommendation.message,
          actionLabel: recommendation.actionLabel ?? "",
          actionUrl: recommendation.actionUrl ?? "",
        }
      : {
          priority: "MEDIUM",
          farmerId: farmerId ?? "",
        },
  });

  const onSubmit = (data: CreateRecommendationSchemaType | UpdateRecommendationSchemaType) => {
    if (isEdit && recommendation) {
      const payload: UpdateRecommendationPayload = {};
      const dirty = dirtyFields as Record<string, boolean | undefined>;
      (Object.keys(dirty) as (keyof UpdateRecommendationSchemaType)[]).forEach((key) => {
        if (!dirty[key as string]) return;
        const val = (data as Record<string, unknown>)[key as string];
        (payload as Record<string, unknown>)[key as string] =
          typeof val === "string" && val === "" ? undefined : val;
      });
      updateMutate({ id: recommendation.id, payload }, {
        onSuccess: () => { toast.success("Recommendation updated."); setOpen(false); },
      });
    } else {
      const d = data as CreateRecommendationSchemaType;
      createMutate(
        {
          ...d,
          actionLabel: d.actionLabel || undefined,
          actionUrl: d.actionUrl || undefined,
        },
        { onSuccess: () => { toast.success("Recommendation created."); reset(); setOpen(false); } }
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit recommendation" : "Create recommendation"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Only changed fields will be saved."
              : "Send a targeted recommendation to a specific farmer."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5 pb-8">
          {!isEdit && (
            <div className="space-y-1.5">
              <Label htmlFor="rec-farmer">Farmer ID <span className="text-destructive">*</span></Label>
              <Input id="rec-farmer" placeholder="UUID of the farmer" {...register("farmerId" as keyof UpdateRecommendationSchemaType)} />
              {"farmerId" in errors && (
                <p className="text-sm text-destructive">
                  {(errors as Record<string, { message?: string }>)["farmerId"]?.message}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type <span className="text-destructive">*</span></Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {TYPES.map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Medium" /></SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="rec-title">Title <span className="text-destructive">*</span></Label>
            <Input id="rec-title" placeholder="Short descriptive title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rec-msg">Message <span className="text-destructive">*</span></Label>
            <Textarea
              id="rec-msg"
              rows={4}
              placeholder="Detailed recommendation message for the farmer…"
              {...register("message")}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
          </div>

          <Separator />

          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Action link (optional)
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rec-alabel">Button label</Label>
              <Input id="rec-alabel" placeholder="e.g. Learn more" {...register("actionLabel")} />
              {errors.actionLabel && <p className="text-sm text-destructive">{errors.actionLabel.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rec-aurl">URL</Label>
              <Input id="rec-aurl" type="url" placeholder="https://…" {...register("actionUrl")} />
              {errors.actionUrl && <p className="text-sm text-destructive">{errors.actionUrl.message}</p>}
            </div>
          </div>

          {apiError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {apiError.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
