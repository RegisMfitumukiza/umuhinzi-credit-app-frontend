import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  UserPlus,
  Search,
  CheckCircle2,
  MapPin,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { useSearchFarmers } from "@/features/farmers/hooks/useSearchFarmers";
import type { FarmerSearchResult } from "@/features/farmers/api/farmer.api";
import type { RegisterFarmerResult } from "../api/cooperative.api";
import { useAddCooperativeMember } from "../hooks/useAddCooperativeMember";
import { useRegisterFarmerForCooperative } from "../hooks/useRegisterFarmerForCooperative";

type Props = { cooperativeId: string };

/* ── Register form schema ── */
const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.email("Enter a valid email"),
  phone: z.string().optional(),
  nationalId: z.string().min(4, "National ID is required"),
  district: z.string().optional(),
  province: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  primaryCrop: z.string().optional(),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

/* ── Credentials card shown after successful registration ── */
const CredentialsCard = ({
  result,
  onClose,
}: {
  result: RegisterFarmerResult;
  onClose: () => void;
}) => {
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);

  const copy = async (text: string, field: "email" | "password") => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <div>
          <p className="font-medium text-green-800">
            {result.user.fullName} registered successfully
          </p>
          <p className="mt-0.5 text-sm text-green-700">
            They have been added to your cooperative. Share the temporary credentials below so they can log in.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Temporary credentials</p>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Email</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-background px-2 py-1 text-sm font-mono border">
              {result.user.email}
            </code>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={() => copy(result.user.email, "email")}
            >
              {copiedField === "email" ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Temporary password</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-background px-2 py-1 text-sm font-mono border">
              {result.tempPassword}
            </code>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={() => copy(result.tempPassword, "password")}
            >
              {copiedField === "password" ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          The farmer should log in and change their password on first access.
        </p>
      </div>

      <Button className="w-full" onClick={onClose}>
        Done
      </Button>
    </div>
  );
};

/* ── Search-and-select tab ── */
const SearchTab = ({ cooperativeId }: { cooperativeId: string }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FarmerSearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, error } = useAddCooperativeMember();
  const { data, isFetching } = useSearchFarmers(query);
  const results = data?.data ?? [];

  const handleSelect = (farmer: FarmerSearchResult) => {
    setSelected(farmer);
    setQuery(farmer.user.fullName);
  };

  const handleAdd = () => {
    if (!selected) return;
    mutate(
      { cooperativeId, farmerId: selected.id },
      {
        onSuccess: () => toast.success(`${selected.user.fullName} added as a member.`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const showDropdown = query.trim().length >= 2 && !selected;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <Input
          ref={inputRef}
          className="pl-9"
          placeholder="Search by name, phone or email…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
          autoFocus
        />

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
                        <p className="text-sm font-medium truncate">{farmer.user.fullName}</p>
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

      <div className="flex justify-end">
        <Button onClick={handleAdd} disabled={!selected || isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add member
        </Button>
      </div>
    </div>
  );
};

/* ── Register-new-farmer tab ── */
const RegisterTab = ({ onSuccess }: { onSuccess: (result: RegisterFarmerResult) => void }) => {
  const { mutate, isPending, error } = useRegisterFarmerForCooperative();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (values: RegisterFormValues) => {
    mutate(values, {
      onSuccess: (res) => onSuccess(res.data),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label>Full name *</Label>
          <Input {...register("fullName")} placeholder="Jean Bosco Uwimana" />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Email *</Label>
          <Input {...register("email")} type="email" placeholder="jean@email.com" />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Phone</Label>
          <Input {...register("phone")} placeholder="+250 7XX XXX XXX" />
        </div>

        <div className="col-span-2 space-y-1">
          <Label>National ID *</Label>
          <Input {...register("nationalId")} placeholder="1199880012345678" />
          {errors.nationalId && (
            <p className="text-xs text-destructive">{errors.nationalId.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Province</Label>
          <Input {...register("province")} placeholder="e.g. Eastern" />
        </div>

        <div className="space-y-1">
          <Label>District</Label>
          <Input {...register("district")} placeholder="e.g. Kayonza" />
        </div>

        <div className="space-y-1">
          <Label>Date of birth</Label>
          <Input {...register("dateOfBirth")} type="date" />
        </div>

        <div className="space-y-1">
          <Label>Gender</Label>
          <Select onValueChange={(v) => setValue("gender", v as "MALE" | "FEMALE" | "OTHER")}>
            <SelectTrigger>
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-1">
          <Label>Primary crop</Label>
          <Input {...register("primaryCrop")} placeholder="e.g. Maize" />
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message}
        </p>
      )}

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register & add to cooperative
        </Button>
      </div>
    </form>
  );
};

/* ── Main dialog ── */
export const AddMemberDialog = ({ cooperativeId }: Props) => {
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<RegisterFarmerResult | null>(null);

  useEffect(() => {
    if (!open) setCredentials(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Add member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a member</DialogTitle>
          <DialogDescription>
            Search for an existing farmer by name, phone, or email — or register a new one on their behalf.
          </DialogDescription>
        </DialogHeader>

        {credentials ? (
          <CredentialsCard result={credentials} onClose={() => setOpen(false)} />
        ) : (
          <Tabs defaultValue="search">
            <TabsList className="w-full">
              <TabsTrigger value="search" className="flex-1">Search existing</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Register new farmer</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-4">
              <SearchTab cooperativeId={cooperativeId} />
            </TabsContent>

            <TabsContent value="register" className="mt-4">
              <RegisterTab onSuccess={(result) => setCredentials(result)} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
