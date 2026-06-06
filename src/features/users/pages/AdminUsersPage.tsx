import { useState } from "react";
import { Loader2, Search, User } from "lucide-react";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";

import { useAllUsers } from "../hooks/useAllUsers";
import { useUserStats } from "../hooks/useUserStats";
import { UserActionMenu } from "../components/UserActionDialogs";
import { UserRoleBadge } from "../components/UserRoleBadge";
import { UserStatusBadge } from "../components/UserStatusBadge";
import { SendNotificationDialog } from "@/features/notifications/components/SendNotificationDialog";
import type { UserFilters, UserRole, UserStatus } from "../types";

const ALL = "__all__";

const AdminUsersPage = () => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);

  const filters: UserFilters = {
    page,
    limit: 20,
    ...(search && { search }),
    ...(role && { role }),
    ...(status && { status }),
  };

  const { data: statsData, isLoading: statsLoading } = useUserStats();
  const { data, isLoading, isFetching } = useAllUsers(filters);

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">User management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage all registered users across the platform.
          </p>
        </div>
        <SendNotificationDialog />
      </div>

      {/* Stats */}
      {!statsLoading && statsData && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total users" value={statsData.totalUsers} />
          <StatCard label="Active" value={statsData.byStatus.active} color="green" />
          <StatCard label="Pending" value={statsData.byStatus.pending} color="yellow" />
          <StatCard label="Suspended / Deactivated" value={statsData.byStatus.suspended + statsData.byStatus.deactivated} color="red" />
        </div>
      )}

      {/* Breakdown by role */}
      {!statsLoading && statsData && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              By role
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 pt-0">
            <RoleStat label="Farmers" count={statsData.byRole.farmers} />
            <RoleStat label="Institutions" count={statsData.byRole.institutions} />
            <RoleStat label="Cooperatives" count={statsData.byRole.cooperativeManagers} />
            <RoleStat label="Gov. Partners" count={statsData.byRole.governmentPartners} />
            <RoleStat label="Admins" count={statsData.byRole.admins} />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, phone…"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select
              value={role || ALL}
              onValueChange={(v) => {
                setRole(v === ALL ? "" : (v as UserRole));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All roles</SelectItem>
                <SelectItem value="FARMER">Farmer</SelectItem>
                <SelectItem value="INSTITUTION">Institution</SelectItem>
                <SelectItem value="COOPERATIVE_MANAGER">Cooperative Manager</SelectItem>
                <SelectItem value="GOVERNMENT_PARTNER">Government Partner</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={status || ALL}
              onValueChange={(v) => {
                setStatus(v === ALL ? "" : (v as UserStatus));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* User list */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Users
              {pagination && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({pagination.total} total)
                </span>
              )}
            </CardTitle>
            {isFetching && !isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <Separator />

        {isLoading ? (
          <CardContent className="py-10 flex justify-center">
            <AppLoader message="Loading users…" />
          </CardContent>
        ) : users.length === 0 ? (
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No users found.
          </CardContent>
        ) : (
          <div className="divide-y">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
              >
                {/* Avatar + name */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                      {user.phone ? ` · ${user.phone}` : ""}
                    </p>
                    {user.district && (
                      <p className="text-xs text-muted-foreground">
                        {user.district}
                        {user.province ? `, ${user.province}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badges + action */}
                <div className="flex shrink-0 items-center gap-2">
                  <UserRoleBadge role={user.role} />
                  <UserStatusBadge status={user.status} />
                  <UserActionMenu user={user} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <>
            <Separator />
            <div className="flex items-center justify-between px-6 py-3 text-sm">
              <span className="text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: "green" | "yellow" | "red";
}) => {
  const colorClass =
    color === "green"
      ? "text-green-700"
      : color === "yellow"
        ? "text-yellow-700"
        : color === "red"
          ? "text-red-700"
          : "text-foreground";

  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`mt-1 text-3xl font-bold ${colorClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
};

const RoleStat = ({ label, count }: { label: string; count: number }) => (
  <div className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <Badge variant="secondary" className="text-xs">
      {count}
    </Badge>
  </div>
);

export default AdminUsersPage;
