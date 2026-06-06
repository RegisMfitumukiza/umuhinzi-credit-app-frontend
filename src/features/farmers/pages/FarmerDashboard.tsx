import { AlertCircle, Clock, ShieldOff, Tractor } from "lucide-react";
import { Link } from "react-router-dom";

import { AppLoader } from "@/shared/components/common/AppLoader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

import { useMyFarmer } from "../hooks/useMyFarmer";
import { CreateFarmerProfileForm } from "../components/CreateFarmerProfileForm";
import { EditFarmerProfileCard } from "../components/EditFarmerProfileCard";
import { ProfileCompletenessCard } from "../components/ProfileCompletenessCard";
import { CooperativeSection } from "../components/CooperativeSection";
import { FarmerStatusBadge, CredibilityBadge } from "../components/FarmerStatusBadge";
import type { Farmer } from "../types";

const FarmerDashboard = () => {
  const { data: farmer, isLoading } = useMyFarmer();

  if (isLoading) return <AppLoader message="Loading your profile…" />;

  if (!farmer) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Set up your farmer profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your digital farmer identity to access loans, cooperatives,
            and platform features.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <CreateFarmerProfileForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header farmer={farmer} />
      {farmer.status === "PENDING" && <PendingBanner />}
      {farmer.status === "SUSPENDED" && <SuspendedBanner />}
      <MainGrid farmer={farmer} />
      <FarmsCard farmer={farmer} />
      <CooperativeSection farmer={farmer} />
    </div>
  );
};

/* ─── Header ─── */

const Header = ({ farmer }: { farmer: Farmer }) => (
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 className="text-2xl font-semibold">{farmer.user.fullName}</h1>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {farmer.user.district
          ? `${farmer.user.district}${farmer.user.province ? `, ${farmer.user.province}` : ""}`
          : "Location not set"}
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      <FarmerStatusBadge status={farmer.status} />
      <CredibilityBadge status={farmer.credibilityStatus} />
    </div>
  </div>
);

/* ─── Status banners ─── */

const PendingBanner = () => (
  <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
    <div>
      <p className="font-medium text-yellow-800">Profile under review</p>
      <p className="mt-0.5 text-sm text-yellow-700">
        An admin will verify your profile once it's complete. Make sure to add
        your date of birth, gender, primary crop, and at least one farm.
      </p>
    </div>
  </div>
);

const SuspendedBanner = () => (
  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
    <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
    <div>
      <p className="font-medium text-red-800">Account suspended</p>
      <p className="mt-0.5 text-sm text-red-700">
        Your farmer profile has been suspended. Contact support for more
        information.
      </p>
    </div>
  </div>
);

/* ─── Farms quick-access card ─── */

const FarmsCard = ({ farmer }: { farmer: Farmer }) => (
  <Card>
    <CardContent className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <Tractor className="h-5 w-5 text-green-700" />
        </div>
        <div>
          <p className="font-medium">
            {farmer._count.farms > 0
              ? `${farmer._count.farms} farm${farmer._count.farms !== 1 ? "s" : ""} registered`
              : "No farms yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {farmer._count.farms === 0
              ? "Add at least one farm to qualify for verification"
              : "Manage your farms, add crops, and update details"}
          </p>
        </div>
      </div>
      <Button asChild variant="outline" className="shrink-0">
        <Link to={ROUTES.FARMER_FARMS}>
          Manage farms
        </Link>
      </Button>
    </CardContent>
  </Card>
);

/* ─── Main grid ─── */

const MainGrid = ({ farmer }: { farmer: Farmer }) => (
  <div className="grid gap-6 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <EditFarmerProfileCard farmer={farmer} />
    </div>
    <div>
      <ProfileCompletenessCard />
    </div>
  </div>
);

export default FarmerDashboard;
