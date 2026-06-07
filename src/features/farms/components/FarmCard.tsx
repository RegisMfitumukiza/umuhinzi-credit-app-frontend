import { useState } from "react";
import { Loader2, MapPin, Pencil, Sprout, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { CropsDialog } from "@/features/crops";

import { useDeleteFarm } from "../hooks/useDeleteFarm";
import { FarmStatusBadge, LocationVerificationBadge } from "./FarmStatusBadge";
import { FarmFormSheet } from "./FarmFormSheet";
import type { Farm } from "../types";
import {
  LAND_UNIT_LABELS,
  OWNERSHIP_LABELS,
  SOIL_LABELS,
} from "../types";

type Props = { farm: Farm };

export const FarmCard = ({ farm }: Props) => {
  const { mutate: doDelete, isPending: isDeleting } = useDeleteFarm();
  const [cropsOpen, setCropsOpen] = useState(false);

  const hasHistory = farm._count.crops > 0;

  const handleDelete = () => {
    doDelete(farm.id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (err) => toast.error(err.message),
    });
  };

  const locationLine = [farm.district, farm.sector, farm.cell, farm.village]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{farm.name}</CardTitle>
            <FarmStatusBadge status={farm.status} />
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 pt-4">
          <dl className="space-y-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{locationLine || farm.district}</span>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setCropsOpen(true)}
            >
              <Sprout className="h-3.5 w-3.5 shrink-0" />
              <span>
                {farm._count.crops} crop{farm._count.crops !== 1 ? "s" : ""}
              </span>
            </button>

            <Separator className="my-1" />

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <dt className="text-xs text-muted-foreground">Land size</dt>
                <dd className="font-medium">
                  {farm.landSize} {LAND_UNIT_LABELS[farm.landUnit]}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Ownership</dt>
                <dd className="font-medium">
                  {OWNERSHIP_LABELS[farm.ownershipType]}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Soil</dt>
                <dd className="font-medium">{SOIL_LABELS[farm.soilType]}</dd>
              </div>
              {farm.latitude && farm.longitude && (
                <div>
                  <dt className="text-xs text-muted-foreground">GPS</dt>
                  <dd className="font-medium text-xs">
                    {farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}
                  </dd>
                </div>
              )}
            </div>

            <LocationVerificationBadge
              status={farm.locationVerificationStatus}
            />
          </dl>
        </CardContent>

        {farm.status !== "INACTIVE" && (
          <>
            <Separator />
            <CardFooter className="pt-3 gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => setCropsOpen(true)}
              >
                <Sprout className="h-3.5 w-3.5" />
                Crops
                {farm._count.crops > 0 && (
                  <span className="ml-0.5 rounded-full bg-primary/15 px-1.5 py-px text-xs font-medium text-primary leading-none">
                    {farm._count.crops}
                  </span>
                )}
              </Button>

              <FarmFormSheet farm={farm}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </FarmFormSheet>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    {hasHistory ? "Deactivate" : "Delete"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {hasHistory ? "Deactivate farm?" : "Delete farm?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {hasHistory
                        ? `"${farm.name}" has crop records and will be deactivated instead of permanently deleted.`
                        : `This will permanently delete "${farm.name}". This cannot be undone.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {hasHistory ? "Deactivate" : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </>
        )}
      </Card>

      <CropsDialog
        farmId={farm.id}
        farmName={farm.name}
        open={cropsOpen}
        onOpenChange={setCropsOpen}
      />
    </>
  );
};
