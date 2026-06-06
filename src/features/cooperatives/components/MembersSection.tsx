import { CheckCircle, Loader2, Trash2 } from "lucide-react";
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

type Props = { cooperativeId: string };

export const MembersSection = ({ cooperativeId }: Props) => {
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
    <Tabs defaultValue="active">
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
              <Badge className="ml-1.5 h-5 px-1.5 text-xs bg-yellow-500 text-white border-0">
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
          showApprove={false}
        />
      </TabsContent>

      <TabsContent value="pending" className="mt-4">
        <MembersTable
          members={pending}
          emptyMessage="No pending join requests."
          showApprove={true}
        />
      </TabsContent>
    </Tabs>
  );
};

type TableProps = {
  members: CooperativeMember[];
  emptyMessage: string;
  showApprove: boolean;
};

const MembersTable = ({ members, emptyMessage, showApprove }: TableProps) => {
  const { mutate: updateMember, isPending: isUpdating } = useUpdateCooperativeMember();
  const { mutate: removeMember, isPending: isRemoving } = useRemoveCooperativeMember();

  if (members.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  const approve = (id: string) => {
    updateMember(
      { id, payload: { status: "ACTIVE" } },
      { onSuccess: () => toast.success("Member approved.") }
    );
  };

  const decline = (id: string) => {
    removeMember(id, {
      onSuccess: () =>
        toast.success(showApprove ? "Request declined." : "Member removed."),
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          {!showApprove && <TableHead>Joined</TableHead>}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-medium">{m.farmer.user.fullName}</TableCell>
            <TableCell className="text-muted-foreground">{m.farmer.user.email}</TableCell>
            {!showApprove && (
              <TableCell className="text-muted-foreground text-sm">
                {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "—"}
              </TableCell>
            )}
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {showApprove && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-green-700 border-green-200 hover:bg-green-50"
                    disabled={isUpdating}
                    onClick={() => approve(m.id)}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Approve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={isRemoving}
                  onClick={() => decline(m.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
