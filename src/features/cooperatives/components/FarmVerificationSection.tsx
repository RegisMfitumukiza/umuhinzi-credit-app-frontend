import { useState } from "react";
import { CheckCircle, Loader2, MapPin, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";

import { useMemberFarms } from "../hooks/useMemberFarms";
import { useVerifyFarmLocation } from "../hooks/useVerifyFarmLocation";
import type { MemberFarm } from "../types";

export const FarmVerificationSection = () => {
  const { data: allFarms = [], isLoading } = useMemberFarms();

  const pending  = allFarms.filter((f) => f.locationVerificationStatus === "PENDING" || f.locationVerificationStatus === "UNVERIFIED");
  const verified = allFarms.filter((f) => f.locationVerificationStatus === "VERIFIED");
  const rejected = allFarms.filter((f) => f.locationVerificationStatus === "REJECTED");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (allFarms.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No member farms with GPS coordinates yet.
      </p>
    );
  }

  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">
          Awaiting
          {pending.length > 0 && (
            <Badge className="ml-1.5 h-5 px-1.5 text-xs bg-yellow-500 text-white border-0">
              {pending.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="verified">Verified ({verified.length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="mt-4">
        {pending.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            All GPS coordinates have been reviewed.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((farm) => (
              <FarmVerificationCard key={farm.id} farm={farm} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="verified" className="mt-4">
        {verified.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No verified farms yet.</p>
        ) : (
          <div className="space-y-3">
            {verified.map((farm) => (
              <FarmVerificationCard key={farm.id} farm={farm} readOnly />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="rejected" className="mt-4">
        {rejected.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No rejected farms.</p>
        ) : (
          <div className="space-y-3">
            {rejected.map((farm) => (
              <FarmVerificationCard key={farm.id} farm={farm} readOnly />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

/* ─── Single farm card ─── */

type CardProps = { farm: MemberFarm; readOnly?: boolean };

const STATUS_BADGE: Record<MemberFarm["locationVerificationStatus"], React.ReactNode> = {
  UNVERIFIED: <Badge variant="outline" className="text-gray-600">Unverified</Badge>,
  PENDING:    <Badge variant="outline" className="border-yellow-300 text-yellow-700">Pending</Badge>,
  VERIFIED:   <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>,
  REJECTED:   <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>,
};

const FarmVerificationCard = ({ farm, readOnly = false }: CardProps) => {
  const [dialogAction, setDialogAction] = useState<"VERIFIED" | "REJECTED" | null>(null);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{farm.name}</p>
            {STATUS_BADGE[farm.locationVerificationStatus]}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {farm.farmer.user.fullName} · {farm.district}
            {farm.sector ? `, ${farm.sector}` : ""}
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {farm.latitude.toFixed(5)}, {farm.longitude.toFixed(5)}
          </div>
          {farm.locationVerificationNote && (
            <p className="mt-1 text-xs text-muted-foreground italic">
              Note: {farm.locationVerificationNote}
            </p>
          )}
          {farm.locationVerifiedAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Reviewed {new Date(farm.locationVerifiedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {!readOnly && (
          <div className="flex shrink-0 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => setDialogAction("VERIFIED")}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Verify
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => setDialogAction("REJECTED")}
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </Button>
          </div>
        )}
      </div>

      {dialogAction && (
        <VerifyDialog
          farm={farm}
          action={dialogAction}
          onClose={() => setDialogAction(null)}
        />
      )}
    </div>
  );
};

/* ─── Verify / Reject dialog ─── */

type DialogProps = {
  farm: MemberFarm;
  action: "VERIFIED" | "REJECTED";
  onClose: () => void;
};

const VerifyDialog = ({ farm, action, onClose }: DialogProps) => {
  const [note, setNote] = useState("");
  const { mutate, isPending } = useVerifyFarmLocation();

  const isVerify = action === "VERIFIED";

  const handleConfirm = () => {
    mutate(
      { farmId: farm.id, payload: { status: action, note: note.trim() || undefined } },
      {
        onSuccess: () => {
          toast.success(
            isVerify
              ? `${farm.name} location verified.`
              : `${farm.name} location rejected.`
          );
          onClose();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isVerify ? "Confirm location verification" : "Reject location"}
          </DialogTitle>
          <DialogDescription>
            {isVerify
              ? `You are confirming that you physically visited and verified the GPS coordinates of "${farm.name}" (${farm.farmer.user.fullName}).`
              : `You are rejecting the GPS coordinates for "${farm.name}". The farmer will need to resubmit corrected coordinates.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-md bg-muted px-3 py-2 text-sm">
            <span className="text-muted-foreground">Coordinates: </span>
            {farm.latitude.toFixed(6)}, {farm.longitude.toFixed(6)}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="verify-note">
              Note {isVerify ? "(optional)" : "(reason for rejection)"}
            </Label>
            <Textarea
              id="verify-note"
              placeholder={
                isVerify
                  ? "e.g. Visited on 2025-06-05, coordinates match"
                  : "e.g. Coordinates point to a road, not the farm"
              }
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            className={
              isVerify
                ? "bg-green-700 hover:bg-green-800 text-white"
                : "bg-red-700 hover:bg-red-800 text-white"
            }
            onClick={handleConfirm}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isVerify ? "Confirm verification" : "Reject coordinates"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
