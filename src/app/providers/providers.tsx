import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { Toaster } from "@/shared/components/ui/sonner";

import { AuthProvider } from "@/features/auth";
import { queryClient } from "@/lib/query-client";
import { ThemeProvider } from "next-themes";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({
  children,
}: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}

            <Toaster
              richColors
              position="top-right"
            />
          </AuthProvider>
        </ThemeProvider>

        <ReactQueryDevtools
          initialIsOpen={false}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};