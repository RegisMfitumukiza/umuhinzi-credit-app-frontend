import { useState } from "react";
import { Clock, Loader2, MapPin, Search, Users, X } from "lucide-react";
import { ConfirmDialog } from "@/shared/components/common/ConfirmDialog";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";

import { useJoinCooperative } from "../hooks/useJoinCooperative";
import { useLeaveCooperative } from "../hooks/useLeaveCooperative";
import { useDiscoverCooperatives } from "../hooks/useDiscoverCooperatives";
import type { DiscoverCooperative, DiscoverScope, Farmer } from "../types";

type Props = { farmer: Farmer };

const SCOPES: { label: string; value: DiscoverScope }[] = [
  { label: "My district", value: "district" },
  { label: "My province", value: "province" },
  { label: "National", value: "national" },
];

export const CooperativeSection = ({ farmer }: Props) => {
  const membership = farmer.cooperativeMembership;
  const hasActiveMembership =
    membership && (membership.status === "ACTIVE" || membership.status === "PENDING");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Cooperative</CardTitle>
        <CardDescription>
          {hasActiveMembership
            ? "Your current cooperative membership"
            : "Find and join a cooperative near you"}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {hasActiveMembership ? (
          <CurrentMembershipView
            membership={membership}
            farmerId={farmer.id}
          />
        ) : (
          <DiscoverView hasLocation={!!farmer.user.district} />
        )}
      </CardContent>
    </Card>
  );
};

/* ─── Current membership ─── */

type MembershipViewProps = {
  membership: NonNullable<Farmer["cooperativeMembership"]>;
  farmerId: string;
};

const CurrentMembershipView = ({ membership }: MembershipViewProps) => {
  const { mutate: leave, isPending } = useLeaveCooperative();

  const handleLeave = () => {
    leave(undefined, {
      onSuccess: () =>
        toast.success(
          membership.status === "PENDING"
            ? "Join request cancelled."
            : "You have left the cooperative."
        ),
      onError: (err) => toast.error(err.message),
    });
  };

  const isPending_ = membership.status === "PENDING";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-medium">{membership.cooperative.name}</p>
          {membership.cooperative.district && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {membership.cooperative.district}
            </p>
          )}
        </div>
        {isPending_ ? (
          <Badge className="shrink-0 bg-yellow-100 text-yellow-800 border-yellow-200 border">
            <Clock className="mr-1 h-3 w-3" />
            Pending approval
          </Badge>
        ) : (
          <Badge className="shrink-0 bg-green-100 text-green-800 border-green-200 border">
            Active member
          </Badge>
        )}
      </div>

      {isPending_ && (
        <p className="text-sm text-muted-foreground">
          Your request is awaiting approval from the cooperative manager.
        </p>
      )}

      {membership.joinedAt && (
        <p className="text-sm text-muted-foreground">
          Joined {new Date(membership.joinedAt).toLocaleDateString()}
        </p>
      )}

      <ConfirmDialog
        trigger={
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            {isPending_ ? "Cancel request" : "Leave cooperative"}
          </Button>
        }
        title={isPending_ ? "Cancel join request?" : "Leave cooperative?"}
        description={
          isPending_
            ? "Your pending join request will be cancelled."
            : `You will be removed from ${membership.cooperative.name}.`
        }
        confirmText={isPending_ ? "Cancel request" : "Leave"}
        variant="destructive"
        onConfirm={handleLeave}
      />
    </div>
  );
};

/* ─── Discover view ─── */

const DiscoverView = ({ hasLocation }: { hasLocation: boolean }) => {
  const [scope, setScope] = useState<DiscoverScope>("district");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: cooperatives, isLoading, error } = useDiscoverCooperatives({
    scope,
    search: search || undefined,
    enabled: hasLocation,
  });

  if (!hasLocation) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Set your <strong>district</strong> in Profile Settings to discover cooperatives near you.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scope selector */}
      <div className="flex gap-1.5">
        {SCOPES.map((s) => (
          <button
            key={s.value}
            onClick={() => setScope(s.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              scope === s.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cooperatives…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearch(searchInput);
          }}
          className="pl-9 pr-9"
        />
        {searchInput && (
          <button
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setSearchInput("");
              setSearch("");
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="py-4 text-center text-sm text-destructive">
          {error.message}
        </p>
      ) : !cooperatives || cooperatives.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No active cooperatives found in this area.
        </p>
      ) : (
        <ul className="divide-y">
          {cooperatives.map((coop) => (
            <CooperativeRow key={coop.id} cooperative={coop} />
          ))}
        </ul>
      )}
    </div>
  );
};

/* ─── Single cooperative row ─── */

const CooperativeRow = ({ cooperative }: { cooperative: DiscoverCooperative }) => {
  const { mutate: join, isPending } = useJoinCooperative();

  const handleJoin = () => {
    join(cooperative.id, {
      onSuccess: () =>
        toast.success(`Join request sent to ${cooperative.name}.`),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0 space-y-0.5">
        <p className="truncate font-medium text-sm">{cooperative.name}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {cooperative.district && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {cooperative.district}
            </span>
          )}
          {cooperative._count != null && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {cooperative._count.members} member
              {cooperative._count.members !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 h-7"
        disabled={isPending}
        onClick={handleJoin}
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          "Join"
        )}
      </Button>
    </li>
  );
};
