import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Globe, Landmark, Loader2, Sprout, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/lib/utils";

import { useRegister } from "../hooks/useRegister";
import {
  registerSchema,
  type RegisterSchemaType,
} from "../schemas/auth.schema";
import type { RegisterPayload } from "../types";

type RoleOption = {
  value: RegisterPayload["role"];
  label: string;
  description: string;
  icon: LucideIcon;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "FARMER",
    label: "Farmer",
    description: "Credit assessment & loans",
    icon: Sprout,
  },
  {
    value: "INSTITUTION",
    label: "Financial Institution",
    description: "Manage credit applications",
    icon: Landmark,
  },
  {
    value: "COOPERATIVE_MANAGER",
    label: "Cooperative Manager",
    description: "Manage cooperative members",
    icon: Users,
  },
  {
    value: "GOVERNMENT_PARTNER",
    label: "Government Partner",
    description: "Monitor credit programs",
    icon: Globe,
  },
];

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending, error } = useRegister();

  const {
    register: field,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "FARMER",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: RegisterSchemaType) => {
    const payload: RegisterPayload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
      ...(data.phone ? { phone: data.phone } : {}),
    };
    register(payload, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Jean Baptiste Hakizimana"
          autoComplete="name"
          {...field("fullName")}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-email">Email address</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...field("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">
          Phone number{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+250 7XX XXX XXX"
          autoComplete="tel"
          {...field("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-password">Password</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            className="pr-10"
            {...field("password")}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>I am a</Label>
        <div className="grid grid-cols-2 gap-2">
          {ROLE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedRole === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setValue("role", opt.value, { shouldValidate: true })
                }
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-medium leading-tight">
                  {opt.label}
                </span>
                <span className="text-xs leading-tight text-muted-foreground">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </form>
  );
};
