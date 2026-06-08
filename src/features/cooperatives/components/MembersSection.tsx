import { CheckCircle, Loader2, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { useCooperativeMembers } from "../hooks/useCooperativeMembers";
import { useUpdateCooperativeMember } from "../hooks/useUpdateCooperativeMember";
import { useRemoveCooperativeMember } from "../hooks/useRemoveCooperativeMember";
import { AddMemberDialog } from "./AddMemberDialog";
import type { CooperativeMember } from "../types";

type Props = {
  cooperativeId: string;
  hasPendingRequests?: boolean;
};

export const MembersSection = ({ cooperativeId, hasPendingRequests = false }: Props) => {
  const { data, isLoading } = useCooperativeMembers({ limit: 100 });

  const pending = data?.members.filter((m) => m.status === "PENDING") ?? [];
  const active  = data?.members.filter((m) => m.status === "ACTIVE") ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Tabs defaultValue={hasPendingRequests ? "pending" : "active"}>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="active">
            Active
            {active.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                {active.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Requests
            {pending.length > 0 && (
              <Badge className="ml-1.5 h-5 px-1.5 text-xs bg-amber-500 text-white border-0">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <AddMemberDialog cooperativeId={cooperativeId} />
      </div>

      <TabsContent value="active" className="mt-4">
        <MembersTable
          members={active}
          emptyMessage="No active members yet."
          mode="active"
        />
      </TabsContent>

      <TabsContent value="pending" className="mt-4">
        {pending.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No pending join requests.
          </p>
        ) : (
          <>
            {pending.length > 5 && (
              <p className="mb-2 text-xs text-muted-foreground">
                {pending.length} requests — scroll to see all
              </p>
            )}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {pending.map((m) => (
                <PendingRequestRow key={m.id} member={m} />
              ))}
            </div>
          </>
        )}
      </TabsContent>
    </Tabs>
  );
};

/* ─── Active members table ─── */

type TableProps = {
  members: CooperativeMember[];
  emptyMessage: string;
  mode: "active" | "pending";
};

const MembersTable = ({ members, emptyMessage }: TableProps) => {
  const { mutate: removeMember, isPending: isRemoving } = useRemoveCooperativeMember();

  if (members.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  const remove = (id: string) => {
    removeMember(id, {
      onSuccess: () => toast.success("Member removed."),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-medium">{m.farmer.user.fullName}</TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">
                <p>{m.farmer.user.email}</p>
                {m.farmer.user.phone && (
                  <p className="flex items-center gap-1 text-xs">
                    <Phone className="h-3 w-3" />
                    {m.farmer.user.phone}
                  </p>
                )}
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              }) : "—"}
            </TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isRemoving}
                onClick={() => remove(m.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

/* ─── Pending request row ─── */

const PendingRequestRow = ({ member }: { member: CooperativeMember }) => {
  const { mutate: updateMember, isPending: isApproving } = useUpdateCooperativeMember();
  const { mutate: removeMember, isPending: isDeclining } = useRemoveCooperativeMember();

  const approve = () => {
    updateMember(
      { id: member.id, payload: { status: "ACTIVE" } },
      {
        onSuccess: () => toast.success(`${member.farmer.user.fullName} approved.`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const decline = () => {
    removeMember(member.id, {
      onSuccess: () => toast.success("Request declined."),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
      <div className="min-w-0">
        <p className="font-medium truncate">{member.farmer.user.fullName}</p>
        <p className="text-sm text-muted-foreground truncate">{member.farmer.user.email}</p>
        {member.farmer.user.phone && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            {member.farmer.user.phone}
          </p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">
          Requested{" "}
          {member.createdAt
            ? new Date(member.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })
            : "—"}
        </p>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 border-green-200 text-green-700 hover:bg-green-50"
          disabled={isApproving || isDeclining}
          onClick={approve}
        >
          {isApproving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5" />
          )}
          Approve
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={isApproving || isDeclining}
          onClick={decline}
        >
          {isDeclining ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
};
