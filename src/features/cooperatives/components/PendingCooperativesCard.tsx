import { useState } from "react";
import { CheckCircle, Loader2, MapPin, Mail, Phone, XCircle } from "lucide-react";
import { toast } from "sonner";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";

import { usePendingCooperatives } from "../hooks/usePendingCooperatives";
import { useUpdateCooperativeStatus } from "../hooks/useUpdateCooperativeStatus";
import type { PendingCooperative } from "../types";

type RejectTarget = { id: string; name: string };

export const PendingCooperativesCard = () => {
  const { data, isLoading } = usePendingCooperatives({ limit: 20 });
  const { mutate: updateStatus, isPending } = useUpdateCooperativeStatus();

  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const cooperatives: PendingCooperative[] = (data?.data ?? []) as PendingCooperative[];

  const handleApprove = (coop: PendingCooperative) => {
    updateStatus(
      { id: coop.id, payload: { status: "ACTIVE" } },
      {
        onSuccess: () => toast.success(`"${coop.name}" approved successfully.`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleRejectConfirm = () => {
    if (!rejectTarget) return;
    updateStatus(
      {
        id: rejectTarget.id,
        payload: { status: "REJECTED", rejectionReason: rejectionReason.trim() || undefined },
      },
      {
        onSuccess: () => {
          toast.success(`"${rejectTarget.name}" rejected.`);
          setRejectTarget(null);
          setRejectionReason("");
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (isLoading) return <AppLoader message="Loading pending cooperatives…" />;
  if (cooperatives.length === 0) return null;

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            Pending cooperative approvals
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-100 px-1.5 text-xs font-semibold text-yellow-800">
              {cooperatives.length}
            </span>
          </CardTitle>
        </CardHeader>
        <Separator />

        <div className="divide-y">
          {cooperatives.map((coop) => {
            const manager = coop.managers[0];
            const location = [coop.district, coop.province].filter(Boolean).join(", ");

            return (
              <div key={coop.id} className="px-6 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium">{coop.name}</p>
                    {coop.registrationNumber && (
                      <p className="text-xs text-muted-foreground">
                        Reg. {coop.registrationNumber}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {location}
                        </span>
                      )}
                      {coop.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {coop.email}
                        </span>
                      )}
                      {coop.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {coop.phone}
                        </span>
                      )}
                    </div>
                    {manager && (
                      <p className="text-xs text-muted-foreground">
                        Manager: <span className="text-foreground">{manager.user.fullName}</span>
                        {" · "}{manager.user.email}
                        {manager.user.phone ? ` · ${manager.user.phone}` : ""}
                      </p>
                    )}
                    {coop.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{coop.description}</p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                      disabled={isPending}
                      onClick={() => handleApprove(coop)}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                      disabled={isPending}
                      onClick={() => setRejectTarget({ id: coop.id, name: coop.name })}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isPending && (
          <CardContent className="py-3 flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </CardContent>
        )}
      </Card>

      {/* Reject confirmation dialog */}
      <AlertDialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectionReason("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject cooperative</AlertDialogTitle>
            <AlertDialogDescription>
              Rejecting <strong>{rejectTarget?.name}</strong>. Optionally provide a reason that
              will be shown to the cooperative manager.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="rejection-reason">Reason (optional)</Label>
            <Textarea
              id="rejection-reason"
              placeholder="e.g. Missing required documentation…"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRejectConfirm}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
