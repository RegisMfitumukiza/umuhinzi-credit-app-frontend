import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";

import { useCreateMarketPrice } from "../hooks/useCreateMarketPrice";
import { useUpdateMarketPrice } from "../hooks/useUpdateMarketPrice";
import {
  createMarketPriceSchema, updateMarketPriceSchema,
  type CreateMarketPriceSchemaType, type UpdateMarketPriceSchemaType,
} from "../schemas/marketPrice.schema";
import type { MarketPrice, UpdateMarketPricePayload } from "../types";

type Props = { price?: MarketPrice; children: React.ReactNode };

export const MarketPriceFormSheet = ({ price, children }: Props) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!price;

  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateMarketPrice();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateMarketPrice();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const {
    register, handleSubmit, reset,
    formState: { errors, dirtyFields },
  } = useForm<UpdateMarketPriceSchemaType>({
    resolver: zodResolver(isEdit ? updateMarketPriceSchema : createMarketPriceSchema),
    defaultValues: price
      ? {
          cropName: price.cropName,
          marketLocation: price.marketLocation,
          pricePerUnit: price.pricePerUnit,
          unit: price.unit,
          recordedAt: price.recordedAt.split("T")[0],
        }
      : { unit: "kg" },
  });

  const onSubmit = (data: CreateMarketPriceSchemaType | UpdateMarketPriceSchemaType) => {
    if (isEdit && price) {
      const payload: UpdateMarketPricePayload = {};
      const dirty = dirtyFields as Record<string, boolean | undefined>;
      (Object.keys(dirty) as (keyof UpdateMarketPriceSchemaType)[]).forEach((key) => {
        if (!dirty[key as string]) return;
        const val = (data as Record<string, unknown>)[key as string];
        (payload as Record<string, unknown>)[key as string] =
          typeof val === "string" && val === "" ? undefined : val;
      });
      updateMutate({ id: price.id, payload }, {
        onSuccess: () => { toast.success("Market price updated."); setOpen(false); },
      });
    } else {
      const d = data as CreateMarketPriceSchemaType;
      createMutate(
        { ...d, unit: d.unit || "kg", recordedAt: d.recordedAt || undefined },
        { onSuccess: () => { toast.success("Market price recorded."); reset(); setOpen(false); } }
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit market price" : "Record market price"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Only changed fields will be saved." : "Record the latest price for a crop at a specific market."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5 pb-8">
          <div className="space-y-1.5">
            <Label htmlFor="mp-crop">Crop name <span className="text-destructive">*</span></Label>
            <Input id="mp-crop" placeholder="e.g. Maize" {...register("cropName")} />
            {errors.cropName && <p className="text-sm text-destructive">{errors.cropName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mp-loc">Market location <span className="text-destructive">*</span></Label>
            <Input id="mp-loc" placeholder="e.g. Nyabugogo Market, Kigali" {...register("marketLocation")} />
            {errors.marketLocation && <p className="text-sm text-destructive">{errors.marketLocation.message}</p>}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="mp-price">Price per unit (RWF) <span className="text-destructive">*</span></Label>
              <Input
                id="mp-price"
                type="number"
                min="0"
                step="10"
                placeholder="e.g. 450"
                {...register("pricePerUnit", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
              {errors.pricePerUnit && <p className="text-sm text-destructive">{errors.pricePerUnit.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mp-unit">Unit</Label>
              <Input id="mp-unit" placeholder="kg" {...register("unit")} />
              {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mp-date">Recorded date</Label>
            <Input id="mp-date" type="date" {...register("recordedAt")} />
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
              {isEdit ? "Save changes" : "Record price"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
