import { AlertCircle, Clock, ShieldOff, XCircle } from "lucide-react";

import { AppLoader } from "@/shared/components/common/AppLoader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

import { useMyCooperative } from "../hooks/useMyCooperative";
import { CreateCooperativeForm } from "../components/CreateCooperativeForm";
import { EditCooperativeCard } from "../components/EditCooperativeCard";
import { MembersSection } from "../components/MembersSection";
import type { Cooperative } from "../types";

const CooperativeDashboard = () => {
  const { data: cooperative, isLoading } = useMyCooperative();

  if (isLoading) return <AppLoader message="Loading cooperative..." />;

  if (!cooperative) return <SetupView />;

  switch (cooperative.status) {
    case "PENDING":
      return <PendingView cooperative={cooperative} />;
    case "REJECTED":
      return <RejectedView cooperative={cooperative} />;
    case "SUSPENDED":
      return <SuspendedView cooperative={cooperative} />;
    case "ACTIVE":
      return <ActiveView cooperative={cooperative} />;
    case "DEACTIVATED":
      return <DeactivatedView />;
    default:
      return null;
  }
};

/* ─── Setup: no cooperative yet ─── */
const SetupView = () => (
  <div className="mx-auto max-w-2xl">
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">Create your cooperative</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Register your cooperative to start managing members and accessing platform features.
        After submission, an admin will review and activate it.
      </p>
    </div>
    <Card>
      <CardContent className="pt-6">
        <CreateCooperativeForm />
      </CardContent>
    </Card>
  </div>
);

/* ─── Pending: awaiting admin review ─── */
const PendingView = ({ cooperative }: { cooperative: Cooperative }) => (
  <div className="mx-auto max-w-2xl space-y-4">
    <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
      <div>
        <p className="font-medium text-yellow-800">Awaiting admin approval</p>
        <p className="mt-0.5 text-sm text-yellow-700">
          Your cooperative has been submitted and is under review. You'll be notified once it's approved.
          Make sure <strong>district</strong> and at least one contact (email or phone) are set — they're required for activation.
        </p>
      </div>
    </div>
    <EditCooperativeCard cooperative={cooperative} />
  </div>
);

/* ─── Rejected: show reason + allow edits ─── */
const RejectedView = ({ cooperative }: { cooperative: Cooperative }) => (
  <div className="mx-auto max-w-2xl space-y-4">
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      <div>
        <p className="font-medium text-red-800">Cooperative rejected</p>
        {cooperative.rejectionReason && (
          <p className="mt-0.5 text-sm text-red-700">
            Reason: {cooperative.rejectionReason}
          </p>
        )}
        <p className="mt-1 text-sm text-red-700">
          Update the details below and save — it will be automatically resubmitted for review.
        </p>
      </div>
    </div>
    <EditCooperativeCard cooperative={cooperative} />
  </div>
);

/* ─── Suspended ─── */
const SuspendedView = ({ cooperative }: { cooperative: Cooperative }) => (
  <div className="mx-auto max-w-2xl space-y-4">
    <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
      <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
      <div>
        <p className="font-medium text-orange-800">Cooperative suspended</p>
        <p className="mt-0.5 text-sm text-orange-700">
          Your cooperative has been suspended by an admin. Contact support for more information.
        </p>
      </div>
    </div>
    <EditCooperativeCard cooperative={cooperative} />
  </div>
);

/* ─── Active: full dashboard ─── */
const ActiveView = ({ cooperative }: { cooperative: Cooperative }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold">{cooperative.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {cooperative.district && `${cooperative.district} · `}
        {cooperative._count?.members ?? 0} member
        {(cooperative._count?.members ?? 0) !== 1 ? "s" : ""}
      </p>
    </div>

    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <EditCooperativeCard cooperative={cooperative} />
      </div>

      <div className="lg:col-span-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Members</CardTitle>
            <CardDescription>
              Manage join requests and active members
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <MembersSection cooperativeId={cooperative.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

/* ─── Deactivated ─── */
const DeactivatedView = () => (
  <div className="mx-auto max-w-md">
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
      <div>
        <p className="font-medium text-gray-700">Cooperative deactivated</p>
        <p className="mt-0.5 text-sm text-gray-600">
          This cooperative has been deactivated. All members have been removed.
          Contact an admin if you believe this is an error.
        </p>
      </div>
    </div>
  </div>
);

export default CooperativeDashboard;
