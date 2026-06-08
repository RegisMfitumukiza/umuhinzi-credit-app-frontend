import { useState, useRef, useEffect } from "react";
import { Loader2, UserPlus, Search, CheckCircle2, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";

import { useSearchFarmers } from "@/features/farmers/hooks/useSearchFarmers";
import type { FarmerSearchResult } from "@/features/farmers/api/farmer.api";
import { useAddCooperativeMember } from "../hooks/useAddCooperativeMember";

type Props = { cooperativeId: string };

export const AddMemberDialog = ({ cooperativeId }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FarmerSearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, error } = useAddCooperativeMember();
  const { data, isFetching } = useSearchFarmers(query);
  const results = data?.data ?? [];

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
    }
  }, [open]);

  const handleSelect = (farmer: FarmerSearchResult) => {
    setSelected(farmer);
    setQuery(farmer.user.fullName);
  };

  const handleAdd = () => {
    if (!selected) return;
    mutate(
      { cooperativeId, farmerId: selected.id },
      {
        onSuccess: () => {
          toast.success(`${selected.user.fullName} added as a member.`);
          setOpen(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const showDropdown = query.trim().length >= 2 && !selected;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Add member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a member</DialogTitle>
          <DialogDescription>
            Search by name, phone, or email. Farmers can also request membership
            themselves — those appear in the Requests tab.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              {isFetching
                ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                : <Search className="h-4 w-4 text-muted-foreground" />
              }
            </div>
            <Input
              ref={inputRef}
              className="pl-9"
              placeholder="Search by name, phone or email…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
              autoFocus
            />

            {/* Dropdown results */}
            {showDropdown && (
              <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                {results.length === 0 && !isFetching ? (
                  <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No farmers found
                  </p>
                ) : (
                  <ul className="max-h-56 overflow-y-auto py-1">
                    {results.map((farmer) => (
                      <li key={farmer.id}>
                        <button
                          type="button"
                          className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors"
                          onClick={() => handleSelect(farmer)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {farmer.user.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {farmer.user.phone ?? farmer.user.email}
                            </p>
                            {farmer.user.district && (
                              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                <MapPin className="h-3 w-3" />
                                {farmer.user.district}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`shrink-0 text-xs mt-0.5 ${
                              farmer.status === "VERIFIED"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-yellow-200 bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {farmer.status.toLowerCase()}
                          </Badge>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Selected farmer confirmation */}
          {selected && (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800">{selected.user.fullName}</p>
                <p className="text-xs text-green-700">
                  {selected.user.phone ?? selected.user.email}
                  {selected.user.district && ` · ${selected.user.district}`}
                </p>
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!selected || isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add member
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
