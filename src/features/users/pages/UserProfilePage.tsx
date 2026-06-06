import { AppLoader } from "@/shared/components/common/AppLoader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

import { useMyProfile } from "../hooks/useMyProfile";
import { AvatarUpload } from "../components/AvatarUpload";
import { UserProfileForm } from "../components/UserProfileForm";
import { UserRoleBadge } from "../components/UserRoleBadge";
import { UserStatusBadge } from "../components/UserStatusBadge";

const UserProfilePage = () => {
  const { data: user, isLoading } = useMyProfile();

  if (isLoading) return <AppLoader message="Loading profile..." />;
  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and location details.
        </p>
      </div>

      {/* Avatar + identity summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <AvatarUpload user={user} />

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h2 className="text-xl font-semibold">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <UserRoleBadge role={user.role} />
                <UserStatusBadge status={user.status} />
              </div>
              {user.lastLoginAt && (
                <p className="text-xs text-muted-foreground">
                  Last login:{" "}
                  {new Date(user.lastLoginAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Edit profile</CardTitle>
          <CardDescription>
            Changes to your name or phone number take effect immediately.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <UserProfileForm user={user} />
        </CardContent>
      </Card>

      {/* Account info (read-only) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 text-sm space-y-2">
          <InfoRow label="Email">{user.email}</InfoRow>
          <InfoRow label="Email verified">
            {user.isEmailVerified ? "Yes" : "No"}
          </InfoRow>
          <InfoRow label="Member since">
            {new Date(user.createdAt).toLocaleDateString()}
          </InfoRow>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{children}</span>
  </div>
);

export default UserProfilePage;
