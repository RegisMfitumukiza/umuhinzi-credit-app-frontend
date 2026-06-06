import { Plus, Tractor } from "lucide-react";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";

import { useMyFarms } from "../hooks/useMyFarms";
import { useMyFarmer } from "@/features/farmers/hooks/useMyFarmer";
import { FarmCard } from "../components/FarmCard";
import { FarmFormSheet } from "../components/FarmFormSheet";

const FarmsPage = () => {
  const { data: farmerData, isLoading: loadingFarmer } = useMyFarmer();
  const { data, isLoading: loadingFarms } = useMyFarms({ limit: 100 });

  if (loadingFarmer || loadingFarms) {
    return <AppLoader message="Loading farms…" />;
  }

  const isSuspended = farmerData?.status === "SUSPENDED";
  const farms = data?.farms ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Farms</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {farms.length > 0
              ? `${farms.length} farm${farms.length !== 1 ? "s" : ""} registered`
              : "Register your farms to complete your farmer profile"}
          </p>
        </div>

        {!isSuspended && !farmerData && (
          <p className="text-sm text-muted-foreground">
            Create a farmer profile first to add farms.
          </p>
        )}

        {farmerData && !isSuspended && (
          <FarmFormSheet>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add farm
            </Button>
          </FarmFormSheet>
        )}
      </div>

      {isSuspended && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Suspended farmers cannot manage farm records.
        </div>
      )}

      {/* Farm grid */}
      {farms.length === 0 ? (
        <EmptyState canCreate={!!farmerData && !isSuspended} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Empty state ─── */

const EmptyState = ({ canCreate }: { canCreate: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
    <Tractor className="h-10 w-10 text-muted-foreground/40" />
    <h3 className="mt-4 font-medium">No farms yet</h3>
    <p className="mt-1 text-sm text-muted-foreground">
      Add your first farm to complete your profile and qualify for verification.
    </p>
    {canCreate && (
      <FarmFormSheet>
        <Button className="mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Add your first farm
        </Button>
      </FarmFormSheet>
    )}
  </div>
);

export default FarmsPage;
