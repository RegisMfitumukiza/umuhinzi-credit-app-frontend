import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  CreditCard,
  Building2,
  Users,
  Landmark,
  Bell,
  User,
  LogOut,
  CalendarDays,
  BarChart3,
  PawPrint,
  DollarSign,
  ShoppingCart,
  Lightbulb,
  Coins,
  Activity,
  ShieldCheck,
} from "lucide-react";

import { AppLogo } from "@/shared/components/common/AppLogo";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { ROUTES } from "@/shared/constants/routes";
import { ROLE_LABELS } from "@/shared/constants/role-labels";
import type { UserRole } from "@/features/auth/types";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
};

const roleNavItems: Record<UserRole, NavItem[]> = {
  FARMER: [
    { label: "Dashboard", icon: LayoutDashboard, to: ROUTES.FARMER_DASHBOARD },
    { label: "My Farms", icon: Sprout, to: ROUTES.FARMER_FARMS },
    { label: "My Loans", icon: CreditCard, to: ROUTES.FARMER_LOANS },
    { label: "My Livestock", icon: PawPrint, to: ROUTES.FARMER_LIVESTOCK },
    { label: "Credit Score", icon: BarChart3, to: ROUTES.FARMER_CREDIT_SCORE },
    { label: "Finances", icon: DollarSign, to: ROUTES.FARMER_FINANCE },
    { label: "Input Costs", icon: Coins, to: ROUTES.FARMER_INPUT_COSTS },
    { label: "Productivity", icon: Activity, to: ROUTES.FARMER_PRODUCTIVITY },
    { label: "Recommendations", icon: Lightbulb, to: ROUTES.FARMER_RECOMMENDATIONS },
  ],
  ADMIN: [
    { label: "Users", icon: Users, to: ROUTES.ADMIN_DASHBOARD },
    { label: "Loans", icon: CreditCard, to: ROUTES.ADMIN_LOANS },
    { label: "Seasons", icon: CalendarDays, to: ROUTES.ADMIN_SEASONS },
    { label: "Market Prices", icon: ShoppingCart, to: ROUTES.ADMIN_MARKET_PRICES },
    { label: "Recommendations", icon: Lightbulb, to: ROUTES.ADMIN_RECOMMENDATIONS },
  ],
  INSTITUTION: [
    { label: "Dashboard", icon: Building2, to: ROUTES.INSTITUTION_DASHBOARD },
    { label: "Loans", icon: CreditCard, to: ROUTES.INSTITUTION_LOANS },
    { label: "Yield Verification", icon: ShieldCheck, to: ROUTES.YIELD_VERIFICATION },
  ],
  COOPERATIVE_MANAGER: [
    { label: "Dashboard", icon: Users, to: ROUTES.COOPERATIVE_DASHBOARD },
    { label: "Yield Verification", icon: ShieldCheck, to: ROUTES.YIELD_VERIFICATION },
    { label: "Market Prices", icon: ShoppingCart, to: ROUTES.COOPERATIVE_MARKET_PRICES },
  ],
  GOVERNMENT_PARTNER: [
    { label: "Dashboard", icon: Landmark, to: ROUTES.GOVERNMENT_DASHBOARD },
  ],
};

const commonNavItems: NavItem[] = [
  { label: "Notifications", icon: Bell, to: ROUTES.NOTIFICATIONS },
  { label: "Profile", icon: User, to: ROUTES.PROFILE },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const isNavActive = (to: string, pathname: string) => {
  const depth = to.split("/").filter(Boolean).length;
  if (depth <= 1) return pathname === to;
  return pathname === to || pathname.startsWith(to + "/");
};

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = roleNavItems[user.role] ?? [];

  return (
    <Sidebar collapsible="icon">
      {/* Brand header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Umuhinzi Credit">
              <div className="flex items-center gap-2 cursor-default">
                <AppLogo iconSize="sm" showText={false} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Umuhinzi Credit</span>
                  <span className="truncate text-xs opacity-60">Credit Platform</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Role-specific navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavActive(item.to, location.pathname)}
                    tooltip={item.label}
                  >
                    <Link to={item.to}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Common items for all roles */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                    tooltip={item.label}
                  >
                    <Link to={item.to}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User info + logout */}
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={user.fullName} asChild>
              <div className="cursor-default">
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarFallback className="rounded-md bg-primary/15 text-primary text-xs font-medium">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="truncate text-xs opacity-60">
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              tooltip="Sign out"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
