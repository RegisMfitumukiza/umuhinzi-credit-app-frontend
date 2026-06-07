import { Plus, PawPrint } from "lucide-react";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";

import { useMyFarmer } from "@/features/farmers/hooks/useMyFarmer";
import { useMyLivestock } from "../hooks/useMyLivestock";
import { LivestockCard } from "../components/LivestockCard";
import { LivestockFormSheet } from "../components/LivestockFormSheet";

const LivestockPage = () => {
  const { data: farmerData, isLoading: loadingFarmer } = useMyFarmer();
  const { data, isLoading: loadingLivestock } = useMyLivestock({ limit: 100 });

  if (loadingFarmer || loadingLivestock) {
    return <AppLoader message="Loading livestock…" />;
  }

  const isSuspended = farmerData?.status === "SUSPENDED";
  const livestock = data?.livestock ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Livestock</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {livestock.length > 0
              ? `${livestock.length} record${livestock.length !== 1 ? "s" : ""} — livestock data improves your credit score`
              : "Record your livestock to strengthen your credit profile"}
          </p>
        </div>

        {!isSuspended && !farmerData && (
          <p className="text-sm text-muted-foreground">
            Create a farmer profile first to manage livestock records.
          </p>
        )}

        {farmerData && !isSuspended && (
          <LivestockFormSheet>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add livestock
            </Button>
          </LivestockFormSheet>
        )}
      </div>

      {isSuspended && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Suspended farmers cannot manage livestock records.
        </div>
      )}

      {/* Livestock grid */}
      {livestock.length === 0 ? (
        <EmptyState canCreate={!!farmerData && !isSuspended} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {livestock.map((item) => (
            <LivestockCard key={item.id} livestock={item} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Empty state ─── */

const EmptyState = ({ canCreate }: { canCreate: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
    <PawPrint className="h-10 w-10 text-muted-foreground/40" />
    <h3 className="mt-4 font-medium">No livestock yet</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      Adding livestock records helps build your credit profile. Cattle, goats,
      chickens, and other animals all count toward your creditworthiness score.
    </p>
    {canCreate && (
      <LivestockFormSheet>
        <Button className="mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Add your first livestock
        </Button>
      </LivestockFormSheet>
    )}
  </div>
);

export default LivestockPage;
