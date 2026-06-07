import {
  AlertCircle,
  Clock,
  MapPin,
  ShieldOff,
  Sprout,
  UserCheck,
  Users2,
  XCircle,
} from "lucide-react";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

import { useMyCooperative } from "../hooks/useMyCooperative";
import { useCooperativeMembers } from "../hooks/useCooperativeMembers";
import { useMemberFarms } from "../hooks/useMemberFarms";
import { CreateCooperativeForm } from "../components/CreateCooperativeForm";
import { EditCooperativeCard } from "../components/EditCooperativeCard";
import { MembersSection } from "../components/MembersSection";
import { FarmVerificationSection } from "../components/FarmVerificationSection";
import type { Cooperative } from "../types";

/* ─── Stat card ─── */

type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  alert?: boolean;
};

const StatCard = ({ icon: Icon, label, value, alert = false }: StatCardProps) => (
  <Card
    className={
      alert
        ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/50"
        : ""
    }
  >
    <CardContent className="pt-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
            alert ? "bg-amber-100 dark:bg-amber-900/40" : "bg-muted"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${
              alert ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"
            }`}
          />
        </div>
        <div>
          <p
            className={`text-2xl font-bold ${
              alert ? "text-amber-700 dark:text-amber-400" : ""
            }`}
          >
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ─── Main component ─── */

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
        Register your cooperative to start managing members and accessing platform
        features. After submission, an admin will review and activate it.
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
    <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-950/20">
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
      <div>
        <p className="font-medium text-yellow-800 dark:text-yellow-400">
          Awaiting admin approval
        </p>
        <p className="mt-0.5 text-sm text-yellow-700 dark:text-yellow-500">
          Your cooperative has been submitted and is under review. You'll be
          notified once it's approved. Make sure <strong>district</strong> and at
          least one contact (email or phone) are set — they're required for
          activation.
        </p>
      </div>
    </div>
    <EditCooperativeCard cooperative={cooperative} />
  </div>
);

/* ─── Rejected: show reason + allow edits ─── */

const RejectedView = ({ cooperative }: { cooperative: Cooperative }) => (
  <div className="mx-auto max-w-2xl space-y-4">
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-950/20">
      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      <div>
        <p className="font-medium text-red-800 dark:text-red-400">
          Cooperative rejected
        </p>
        {cooperative.rejectionReason && (
          <p className="mt-0.5 text-sm text-red-700 dark:text-red-500">
            Reason: {cooperative.rejectionReason}
          </p>
        )}
        <p className="mt-1 text-sm text-red-700 dark:text-red-500">
          Update the details below and save — it will be automatically
          resubmitted for review.
        </p>
      </div>
    </div>
    <EditCooperativeCard cooperative={cooperative} />
  </div>
);

/* ─── Suspended ─── */

const SuspendedView = ({ cooperative }: { cooperative: Cooperative }) => (
  <div className="mx-auto max-w-2xl space-y-4">
    <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800/50 dark:bg-orange-950/20">
      <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
      <div>
        <p className="font-medium text-orange-800 dark:text-orange-400">
          Cooperative suspended
        </p>
        <p className="mt-0.5 text-sm text-orange-700 dark:text-orange-500">
          Your cooperative has been suspended by an admin. Contact support for
          more information.
        </p>
      </div>
    </div>
    <EditCooperativeCard cooperative={cooperative} />
  </div>
);

/* ─── Active: full dashboard ─── */

const ActiveView = ({ cooperative }: { cooperative: Cooperative }) => {
  const { data: membersData } = useCooperativeMembers({ limit: 100 });
  const { data: allFarms = [] } = useMemberFarms();

  const activeMembers =
    membersData?.members.filter((m) => m.status === "ACTIVE") ?? [];
  const pendingMembers =
    membersData?.members.filter((m) => m.status === "PENDING") ?? [];
  const farmsToVerify = allFarms.filter(
    (f) =>
      f.locationVerificationStatus === "PENDING" ||
      f.locationVerificationStatus === "UNVERIFIED"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{cooperative.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {cooperative.district && `${cooperative.district} · `}
          {activeMembers.length} active member
          {activeMembers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users2} label="Active members" value={activeMembers.length} />
        <StatCard
          icon={UserCheck}
          label="Join requests"
          value={pendingMembers.length}
          alert={pendingMembers.length > 0}
        />
        <StatCard
          icon={MapPin}
          label="Farms to verify"
          value={farmsToVerify.length}
          alert={farmsToVerify.length > 0}
        />
        <StatCard icon={Sprout} label="Total member farms" value={allFarms.length} />
      </div>

      {/* Info + Members grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <EditCooperativeCard cooperative={cooperative} />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Members</CardTitle>
                  <CardDescription>
                    Manage join requests and active members
                  </CardDescription>
                </div>
                {pendingMembers.length > 0 && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                    {pendingMembers.length} pending
                  </Badge>
                )}
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <MembersSection
                cooperativeId={cooperative.id}
                hasPendingRequests={pendingMembers.length > 0}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Farm verification */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Farm Location Verification</CardTitle>
              <CardDescription>
                Review GPS coordinates submitted by your members. Only verify
                after a physical field visit.
              </CardDescription>
            </div>
            {farmsToVerify.length > 0 && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                {farmsToVerify.length} awaiting
              </Badge>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <FarmVerificationSection />
        </CardContent>
      </Card>
    </div>
  );
};

/* ─── Deactivated ─── */

const DeactivatedView = () => (
  <div className="mx-auto max-w-md">
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
      <div>
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Cooperative deactivated
        </p>
        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
          This cooperative has been deactivated. All members have been removed.
          Contact an admin if you believe this is an error.
        </p>
      </div>
    </div>
  </div>
);

export default CooperativeDashboard;
