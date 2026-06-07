import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Loader2, AlertTriangle, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

import { useLatestMarketPrices } from "../hooks/useLatestMarketPrices";
import { useMarketPrices } from "../hooks/useMarketPrices";
import { useDeleteMarketPrice } from "../hooks/useDeleteMarketPrice";
import { MarketPriceFormSheet } from "../components/MarketPriceFormSheet";
import type { MarketPrice, MarketPriceWithStaleness } from "../types";

const fmt = (n: number) => n.toLocaleString("en-RW", { maximumFractionDigits: 0 });

const AdminMarketPricesPage = () => {
  const [tab, setTab] = useState<"all" | "latest">("latest");
  const [cropFilter, setCropFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const { data: latestData, isLoading: loadingLatest } = useLatestMarketPrices();
  const { data: allData, isLoading: loadingAll } = useMarketPrices({
    limit: 100,
    cropName: cropFilter || undefined,
    marketLocation: locationFilter || undefined,
  });

  const { mutate: doDelete, isPending: isDeleting, variables: deletingId } =
    useDeleteMarketPrice();

  const handleDelete = (id: string) => {
    doDelete(id, {
      onSuccess: (res) => toast.success(res.message),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Market Prices</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage crop prices used in farmer financial summary calculations
          </p>
        </div>
        <MarketPriceFormSheet>
          <Button className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> Add price
          </Button>
        </MarketPriceFormSheet>
      </div>

      {/* Meta strip (latest view only) */}
      {tab === "latest" && latestData?.meta && (
        <div className="flex flex-wrap gap-4 text-sm">
          <MetaPill label="Crops tracked" value={String(latestData.meta.totalCrops)} />
          <MetaPill label="Fresh prices" value={String(latestData.meta.freshCount)} accent="text-green-700" />
          <MetaPill
            label="Stale prices"
            value={String(latestData.meta.staleCount)}
            accent={latestData.meta.staleCount > 0 ? "text-amber-700" : undefined}
          />
          <MetaPill label="Stale threshold" value={`${latestData.meta.staleDaysThreshold} days`} />
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-2 border-b">
        <TabButton active={tab === "latest"} onClick={() => setTab("latest")}>
          Latest prices
        </TabButton>
        <TabButton active={tab === "all"} onClick={() => setTab("all")}>
          All records
        </TabButton>
      </div>

      {/* ── Latest prices ── */}
      {tab === "latest" && (
        <>
          {loadingLatest ? (
            <AppLoader message="Loading market prices…" />
          ) : !latestData?.prices.length ? (
            <EmptyPrices onAdd={<MarketPriceFormSheet><Button className="gap-2 mt-4"><Plus className="h-4 w-4" /> Add first price</Button></MarketPriceFormSheet>} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestData.prices.map((price) => (
                <PriceCard
                  key={price.id}
                  price={price}
                  isDeleting={isDeleting && deletingId === price.id}
                  onDelete={() => handleDelete(price.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── All records ── */}
      {tab === "all" && (
        <>
          <div className="flex flex-wrap gap-3">
            <Input
              className="w-44"
              placeholder="Filter by crop…"
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
            />
            <Input
              className="w-56"
              placeholder="Filter by location…"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          {loadingAll ? (
            <AppLoader message="Loading records…" />
          ) : !allData?.prices.length ? (
            <EmptyPrices onAdd={<MarketPriceFormSheet><Button className="gap-2 mt-4"><Plus className="h-4 w-4" /> Add price</Button></MarketPriceFormSheet>} />
          ) : (
            <div className="space-y-2">
              {allData.prices.map((price) => (
                <AllRecordRow
                  key={price.id}
                  price={price}
                  isDeleting={isDeleting && deletingId === price.id}
                  onDelete={() => handleDelete(price.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ─── Helpers ─── */

const MetaPill = ({
  label, value, accent,
}: { label: string; value: string; accent?: string }) => (
  <div className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1">
    <span className="text-xs text-muted-foreground">{label}:</span>
    <span className={`text-xs font-semibold ${accent ?? ""}`}>{value}</span>
  </div>
);

const TabButton = ({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`border-b-2 px-4 pb-2 text-sm font-medium transition-colors ${
      active
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

const EmptyPrices = ({ onAdd }: { onAdd: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-14 text-center">
    <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
    <p className="mt-4 font-medium">No market prices yet</p>
    <p className="mt-1 text-sm text-muted-foreground">
      Add crop prices to help the system calculate farmer financial summaries automatically.
    </p>
    {onAdd}
  </div>
);

const PriceCard = ({
  price, isDeleting, onDelete,
}: { price: MarketPriceWithStaleness; isDeleting: boolean; onDelete: () => void }) => (
  <Card className={price.isStale ? "border-amber-200" : undefined}>
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold capitalize">{price.cropName}</p>
          <p className="text-xs text-muted-foreground">{price.marketLocation}</p>
        </div>
        {price.isStale ? (
          <Badge variant="outline" className="gap-1 border-amber-300 bg-amber-50 text-amber-700 shrink-0">
            <AlertTriangle className="h-3 w-3" /> Stale
          </Badge>
        ) : (
          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 shrink-0">
            Fresh
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="text-xl font-bold tabular-nums text-green-700">
        {fmt(price.pricePerUnit)} RWF
        <span className="text-sm font-normal text-muted-foreground">/{price.unit}</span>
      </p>

      <div className="text-xs text-muted-foreground space-y-0.5">
        <p>Recorded: {format(new Date(price.recordedAt), "MMM d, yyyy")}</p>
        <p>{price.ageInDays === 0 ? "Updated today" : `${price.ageInDays} day${price.ageInDays !== 1 ? "s" : ""} ago`}</p>
      </div>

      <div className="flex gap-2 pt-1">
        <MarketPriceFormSheet price={price}>
          <Button size="sm" variant="outline" className="flex-1">Edit</Button>
        </MarketPriceFormSheet>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete price record?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the {price.cropName} price record for {price.marketLocation}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardContent>
  </Card>
);

const AllRecordRow = ({
  price, isDeleting, onDelete,
}: {
  price: MarketPrice;
  isDeleting: boolean;
  onDelete: () => void;
}) => (
  <Card>
    <CardContent className="flex items-center gap-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold capitalize">{price.cropName}</p>
        <p className="text-xs text-muted-foreground truncate">{price.marketLocation}</p>
      </div>
      <p className="text-sm font-bold tabular-nums text-green-700 shrink-0">
        {fmt(price.pricePerUnit)} RWF/{price.unit}
      </p>
      <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
        {format(new Date(price.recordedAt), "MMM d, yyyy")}
      </p>
      <div className="flex items-center gap-1 shrink-0">
        <MarketPriceFormSheet price={price}>
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </MarketPriceFormSheet>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete price record?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the {price.cropName} price record for {price.marketLocation}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardContent>
  </Card>
);

export default AdminMarketPricesPage;
