import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck, ShieldX } from "lucide-react";
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

import { useVerifyYield } from "../hooks/useVerifyYield";
import { verifyYieldSchema, type VerifyYieldSchemaType } from "../schemas/yield.schema";
import type { YieldRecord, VerifyYieldPayload } from "../types";
import { AGRICULTURAL_UNITS } from "../types";

type Props = { yieldRecord: YieldRecord; children: React.ReactNode };

export const VerifyYieldSheet = ({ yieldRecord, children }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, error } = useVerifyYield();

  const {
    register, control, handleSubmit, watch,
    formState: { errors },
  } = useForm<VerifyYieldSchemaType>({
    resolver: zodResolver(verifyYieldSchema),
    defaultValues: {
      status: "VERIFIED",
      verifiedActualYield: yieldRecord.actualYield,
      verifiedUnit: yieldRecord.unit,
    },
  });

  const statusValue = watch("status");
  const methodValue = watch("method");

  const onSubmit = (data: VerifyYieldSchemaType) => {
    const payload: VerifyYieldPayload = {
      status: data.status,
      method: data.method,
      evidenceReference: data.evidenceReference || undefined,
      verifiedActualYield: data.verifiedActualYield,
      verifiedUnit: data.verifiedUnit || undefined,
      verificationNote: data.verificationNote || undefined,
    };
    mutate({ id: yieldRecord.id, payload }, {
      onSuccess: () => {
        toast.success(data.status === "VERIFIED" ? "Yield verified." : "Yield rejected.");
        setOpen(false);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Verify yield record</SheetTitle>
          <SheetDescription>
            Reviewing <strong>{yieldRecord.crop.cropName}</strong> — actual yield:{" "}
            {yieldRecord.actualYield} {yieldRecord.unit}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5 pb-8">
          {/* Decision */}
          <div className="space-y-1.5">
            <Label>Decision <span className="text-destructive">*</span></Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => field.onChange("VERIFIED")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm font-medium transition-colors ${
                      field.value === "VERIFIED"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-border text-muted-foreground hover:border-green-300"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" /> Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("REJECTED")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm font-medium transition-colors ${
                      field.value === "REJECTED"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-border text-muted-foreground hover:border-red-300"
                    }`}
                  >
                    <ShieldX className="h-4 w-4" /> Reject
                  </button>
                </div>
              )}
            />
          </div>

          {statusValue === "VERIFIED" && (
            <>
              <Separator />

              <div className="space-y-1.5">
                <Label>Verification method <span className="text-destructive">*</span></Label>
                <Controller
                  name="method"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIELD_VISIT">Field visit</SelectItem>
                        <SelectItem value="COOPERATIVE_COLLECTION_RECORD">
                          Cooperative collection record
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.method && <p className="text-sm text-destructive">{errors.method.message}</p>}
              </div>

              {methodValue === "COOPERATIVE_COLLECTION_RECORD" && (
                <div className="space-y-1.5">
                  <Label htmlFor="vy-ref">Collection record reference <span className="text-destructive">*</span></Label>
                  <Input id="vy-ref" placeholder="e.g. REF-2024-001" {...register("evidenceReference")} />
                  {errors.evidenceReference && (
                    <p className="text-sm text-destructive">{errors.evidenceReference.message}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="vy-yield">Verified actual yield</Label>
                  <Input
                    id="vy-yield" type="number" min="0" step="any"
                    {...register("verifiedActualYield", {
                      setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                    })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Verified unit</Label>
                  <Controller
                    name="verifiedUnit"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? yieldRecord.unit}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {AGRICULTURAL_UNITS.map((u) => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="vy-note">
              {statusValue === "VERIFIED" && methodValue === "FIELD_VISIT"
                ? "Field visit note *"
                : statusValue === "REJECTED"
                ? "Rejection note *"
                : "Note"}
            </Label>
            <Textarea
              id="vy-note" rows={3}
              placeholder={
                statusValue === "REJECTED"
                  ? "Reason for rejection…"
                  : "Verification notes…"
              }
              {...register("verificationNote")}
            />
            {errors.verificationNote && (
              <p className="text-sm text-destructive">{errors.verificationNote.message}</p>
            )}
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={`flex-1 ${statusValue === "REJECTED" ? "bg-destructive hover:bg-destructive/90" : ""}`}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {statusValue === "REJECTED" ? "Reject yield" : "Confirm verification"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
