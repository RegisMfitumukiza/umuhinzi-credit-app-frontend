import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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

import { useDeleteLivestock } from "../hooks/useDeleteLivestock";
import { LivestockStatusBadge } from "./LivestockStatusBadge";
import { LivestockFormSheet } from "./LivestockFormSheet";
import type { Livestock } from "../types";
import {
  LIVESTOCK_TYPE_LABELS,
  LIVESTOCK_PURPOSE_LABELS,
  LIVESTOCK_TYPE_COLORS,
} from "../types";

type Props = { livestock: Livestock };

export const LivestockCard = ({ livestock }: Props) => {
  const { mutate: doDelete, isPending: isDeleting } = useDeleteLivestock();

  const handleDelete = () => {
    doDelete(livestock.id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (err) => toast.error(err.message),
    });
  };

  const typeLabel = LIVESTOCK_TYPE_LABELS[livestock.type];
  const colorClass = LIVESTOCK_TYPE_COLORS[livestock.type];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {/* Type color swatch */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${colorClass}`}
            >
              {typeLabel.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold leading-tight">{typeLabel}</p>
              {livestock.purposes.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {livestock.purposes.map((p) => LIVESTOCK_PURPOSE_LABELS[p]).join(" · ")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic">No purpose set</p>
              )}
            </div>
          </div>
          <LivestockStatusBadge status={livestock.status} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 pt-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Quantity</dt>
            <dd className="font-medium tabular-nums">{livestock.quantity.toLocaleString()}</dd>
          </div>

          {livestock.estimatedValue !== null && (
            <div>
              <dt className="text-xs text-muted-foreground">Est. value</dt>
              <dd className="font-medium tabular-nums">
                {livestock.estimatedValue.toLocaleString()} RWF
              </dd>
            </div>
          )}
        </dl>

        {livestock.notes && (
          <p className="mt-3 text-xs text-muted-foreground line-clamp-2 border-t pt-2">
            {livestock.notes}
          </p>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="pt-3 gap-2">
        <LivestockFormSheet livestock={livestock}>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        </LivestockFormSheet>

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
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete livestock record?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this {typeLabel.toLowerCase()} record.
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
