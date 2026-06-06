import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Crosshair, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
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

import { useCreateFarm } from "../hooks/useCreateFarm";
import { useUpdateFarm } from "../hooks/useUpdateFarm";
import {
  createFarmSchema,
  updateFarmSchema,
  type CreateFarmSchemaType,
  type UpdateFarmSchemaType,
} from "../schemas/farm.schema";
import type { CreateFarmPayload, Farm, UpdateFarmPayload } from "../types";

type Props = {
  farm?: Farm;
  children: React.ReactNode;
};

const LOCATION_FIELDS = new Set([
  "province",
  "district",
  "sector",
  "cell",
  "village",
  "latitude",
  "longitude",
]);

const LAND_FIELDS = new Set([
  "landSize",
  "landUnit",
  "ownershipType",
]);

export const FarmFormSheet = ({ farm, children }: Props) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!farm;

  const { mutate: createMutate, isPending: isCreating, error: createError } =
    useCreateFarm();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } =
    useUpdateFarm();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const schema = isEdit ? updateFarmSchema : createFarmSchema;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<CreateFarmSchemaType | UpdateFarmSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: farm
      ? {
          name: farm.name,
          landSize: farm.landSize,
          district: farm.district,
          description: farm.description ?? "",
          landUnit: farm.landUnit,
          ownershipType: farm.ownershipType,
          soilType: farm.soilType,
          province: farm.province ?? "",
          sector: farm.sector ?? "",
          cell: farm.cell ?? "",
          village: farm.village ?? "",
          latitude: farm.latitude ?? undefined,
          longitude: farm.longitude ?? undefined,
        }
      : {
          landUnit: "HECTARE",
          ownershipType: "OWNED",
          soilType: "UNKNOWN",
        },
  });

  const [isGettingGPS, setIsGettingGPS] = useState(false);

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }
    setIsGettingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", pos.coords.latitude, { shouldDirty: true });
        setValue("longitude", pos.coords.longitude, { shouldDirty: true });
        setIsGettingGPS(false);
        toast.success("GPS coordinates detected.");
      },
      () => {
        toast.error("Could not detect location. Check browser permissions.");
        setIsGettingGPS(false);
      },
      { timeout: 10_000 }
    );
  };

  const willResetToReview = isEdit
    ? Object.keys(dirtyFields).some(
        (k) => LOCATION_FIELDS.has(k) || LAND_FIELDS.has(k)
      )
    : false;

  const buildPayload = (
    data: CreateFarmSchemaType | UpdateFarmSchemaType
  ): CreateFarmPayload | UpdateFarmPayload => ({
    ...data,
    description: (data as CreateFarmSchemaType).description || undefined,
    province: (data as CreateFarmSchemaType).province || undefined,
    sector: (data as CreateFarmSchemaType).sector || undefined,
    cell: (data as CreateFarmSchemaType).cell || undefined,
    village: (data as CreateFarmSchemaType).village || undefined,
  });

  const onSubmit = (data: CreateFarmSchemaType | UpdateFarmSchemaType) => {
    const payload = buildPayload(data);

    if (isEdit && farm) {
      updateMutate(
        { id: farm.id, payload: payload as UpdateFarmPayload },
        {
          onSuccess: () => {
            toast.success("Farm updated.");
            setOpen(false);
          },
        }
      );
    } else {
      createMutate(payload as CreateFarmPayload, {
        onSuccess: () => {
          toast.success(
            "Farm created. It's now under review by an admin.",
          );
          reset();
          setOpen(false);
        },
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit farm" : "Add a farm"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the farm details below."
              : "Fill in your farm details. Only name, size, and district are required."}
          </SheetDescription>
        </SheetHeader>

        {willResetToReview && (
          <div className="my-4 flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Changing location or land details will reset this farm to
            &ldquo;Under Review&rdquo; status.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-6 pb-8"
        >
          {/* ── Basic info ── */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Basic info
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="f-name">
                Farm name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="f-name"
                placeholder="e.g. Bugesera Farm"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="f-desc">Description</Label>
              <Textarea
                id="f-desc"
                placeholder="Optional description…"
                rows={2}
                {...register("description")}
              />
            </div>
          </section>

          <Separator />

          {/* ── Land details ── */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Land details
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="f-size">
                  Land size <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="f-size"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 2.5"
                  {...register("landSize")}
                />
                {errors.landSize && (
                  <p className="text-sm text-destructive">
                    {errors.landSize.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Controller
                  name="landUnit"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HECTARE">Hectare (ha)</SelectItem>
                        <SelectItem value="ACRE">Acre</SelectItem>
                        <SelectItem value="SQUARE_METER">m²</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Ownership type</Label>
                <Controller
                  name="ownershipType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OWNED">Owned</SelectItem>
                        <SelectItem value="RENTED">Rented</SelectItem>
                        <SelectItem value="FAMILY_LAND">Family land</SelectItem>
                        <SelectItem value="COOPERATIVE_LAND">
                          Cooperative land
                        </SelectItem>
                        <SelectItem value="GOVERNMENT_ALLOCATED">
                          Gov. allocated
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Soil type</Label>
                <Controller
                  name="soilType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLAY">Clay</SelectItem>
                        <SelectItem value="SANDY">Sandy</SelectItem>
                        <SelectItem value="SILT">Silt</SelectItem>
                        <SelectItem value="LOAM">Loam</SelectItem>
                        <SelectItem value="PEAT">Peat</SelectItem>
                        <SelectItem value="CHALKY">Chalky</SelectItem>
                        <SelectItem value="UNKNOWN">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* ── Location ── */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Location
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="f-district">
                  District <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="f-district"
                  placeholder="e.g. Bugesera"
                  {...register("district")}
                />
                {errors.district && (
                  <p className="text-sm text-destructive">
                    {errors.district.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-province">Province</Label>
                <Input
                  id="f-province"
                  placeholder="e.g. Eastern"
                  {...register("province")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-sector">Sector</Label>
                <Input id="f-sector" {...register("sector")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-cell">Cell</Label>
                <Input id="f-cell" {...register("cell")} />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="f-village">Village</Label>
                <Input id="f-village" {...register("village")} />
              </div>
            </div>
          </section>

          <Separator />

          {/* ── GPS (optional) ── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                GPS coordinates (optional)
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 gap-1.5 text-xs"
                disabled={isGettingGPS}
                onClick={handleGetGPS}
              >
                {isGettingGPS ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Crosshair className="h-3.5 w-3.5" />
                )}
                Use my location
              </Button>
            </div>

            <p className="text-xs text-muted-foreground -mt-1">
              GPS helps verify your farm location. Both fields must be filled together.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="f-lat">Latitude</Label>
                <Input
                  id="f-lat"
                  type="number"
                  step="any"
                  placeholder="-1.9441"
                  {...register("latitude")}
                />
                {errors.latitude && (
                  <p className="text-sm text-destructive">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-lon">Longitude</Label>
                <Input
                  id="f-lon"
                  type="number"
                  step="any"
                  placeholder="30.0619"
                  {...register("longitude")}
                />
                {errors.longitude && (
                  <p className="text-sm text-destructive">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {apiError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {apiError.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? "Save changes" : "Create farm"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
