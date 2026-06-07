import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarDays, Plus, Loader2, Sprout } from "lucide-react";

import { AppLoader } from "@/shared/components/common/AppLoader";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";

import { useSeasons } from "../hooks/useSeasons";
import { useCreateSeason } from "../hooks/useCreateSeason";
import type { SeasonName } from "../types";

const SEASON_NAMES: SeasonName[] = ["Season A", "Season B", "Season C"];

const SEASON_INFO: Record<SeasonName, string> = {
  "Season A": "Sep 1 → Jan 31",
  "Season B": "Feb 1 → Jun 30",
  "Season C": "Jul 1 → Aug 31",
};

const schema = z.object({
  name: z.enum(["Season A", "Season B", "Season C"] as const, {
    required_error: "Select a season name",
  }),
  year: z
    .number({ invalid_type_error: "Enter a valid year" })
    .int()
    .min(2020, "Year must be 2020 or later")
    .max(2035, "Year must be 2035 or earlier"),
});

type FormValues = z.infer<typeof schema>;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const isCurrentSeason = (startDate: string, endDate: string) => {
  const now = new Date();
  return new Date(startDate) <= now && now <= new Date(endDate);
};

const CreateSeasonDialog = ({ onCreated }: { onCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateSeason();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { year: new Date().getFullYear() },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(`${values.name} ${values.year} created.`);
        reset({ year: new Date().getFullYear() });
        setOpen(false);
        onCreated();
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create season
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create farming season</DialogTitle>
          <DialogDescription>
            Rwanda seasons follow fixed date windows. Dates are set automatically
            by the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>
              Season <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASON_NAMES.map((s) => (
                      <SelectItem key={s} value={s}>
                        <span className="font-medium">{s}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {SEASON_INFO[s]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="year">
              Year <span className="text-destructive">*</span>
            </Label>
            <Input
              id="year"
              type="number"
              placeholder="e.g. 2025"
              {...register("year", { valueAsNumber: true })}
            />
            {errors.year && (
              <p className="text-sm text-destructive">{errors.year.message}</p>
            )}
          </div>

          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            <strong>Season A</strong> {SEASON_INFO["Season A"]}
            <br />
            <strong>Season B</strong> {SEASON_INFO["Season B"]}
            <br />
            <strong>Season C</strong> {SEASON_INFO["Season C"]}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-1.5">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminSeasonsPage = () => {
  const { data: seasons, isLoading, refetch } = useSeasons();

  const sorted = [...(seasons ?? [])].sort(
    (a, b) => b.year - a.year || a.name.localeCompare(b.name)
  );

  const currentCount = sorted.filter((s) =>
    isCurrentSeason(s.startDate, s.endDate)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Farming Seasons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seasons are generated automatically each year. Use the create button
            only if a season is missing or needs to be added ahead of schedule.
          </p>
        </div>
        <CreateSeasonDialog onCreated={refetch} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-primary/70" />
              <div>
                <p className="text-2xl font-bold">{seasons?.length ?? 0}</p>
                <p className="text-sm text-muted-foreground">Total seasons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Sprout className="h-8 w-8 text-green-600/70" />
              <div>
                <p className="text-2xl font-bold">{currentCount}</p>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <CardTitle className="text-base">All seasons</CardTitle>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </CardHeader>
        <Separator />

        {isLoading ? (
          <div className="p-6">
            <AppLoader />
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <CalendarDays className="mx-auto mb-3 h-8 w-8 opacity-40" />
            <p className="text-sm">No seasons yet. Create the first one.</p>
          </div>
        ) : (
          <div className="divide-y">
            {sorted.map((season) => {
              const active = isCurrentSeason(season.startDate, season.endDate);
              return (
                <div
                  key={season.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <CalendarDays className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {season.name}{" "}
                        <span className="text-muted-foreground font-normal">
                          {season.year}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(season.startDate)} — {formatDate(season.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {active && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {SEASON_INFO[season.name]}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminSeasonsPage;
