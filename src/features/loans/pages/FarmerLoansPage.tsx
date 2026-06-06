import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { useLoanApplications } from "../hooks/useLoanApplications";
import { useLoans } from "../hooks/useLoans";
import { CreateLoanApplicationForm } from "../components/CreateLoanApplicationForm";
import { LoanApplicationItem } from "../components/LoanApplicationItem";
import { LoanItem } from "../components/LoanItem";
import {
  LOAN_APPLICATION_STATUS_LABELS,
  LOAN_STATUS_LABELS,
  type LoanApplicationStatus,
  type LoanStatus,
} from "../types";

const ALL = "__all__";

const FarmerLoansPage = () => {
  const [tab, setTab] = useState<"applications" | "loans">("applications");
  const [applyOpen, setApplyOpen] = useState(false);
  const [appStatus, setAppStatus] = useState<LoanApplicationStatus | "">("");
  const [loanStatus, setLoanStatus] = useState<LoanStatus | "">("");
  const [appPage, setAppPage] = useState(1);
  const [loanPage, setLoanPage] = useState(1);

  const { data: appData, isLoading: appsLoading, isFetching: appsFetching } =
    useLoanApplications({
      page: appPage,
      limit: 20,
      ...(appStatus && { status: appStatus }),
    });

  const { data: loanData, isLoading: loansLoading, isFetching: loansFetching } =
    useLoans({
      page: loanPage,
      limit: 20,
      ...(loanStatus && { status: loanStatus }),
    });

  const applications = appData?.data ?? [];
  const appPagination = appData?.pagination;
  const loans = loanData?.data ?? [];
  const loanPagination = loanData?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Loans</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Apply for agricultural credit and track your repayments.
          </p>
        </div>
        <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Apply for a loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New loan application</DialogTitle>
            </DialogHeader>
            <CreateLoanApplicationForm onSuccess={() => setApplyOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="applications">
            Applications
            {appData?.pagination && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({appData.pagination.total})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="loans">
            Loans
            {loanData?.pagination && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({loanData.pagination.total})
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "applications" && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">
                Applications
                {appPagination && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({appPagination.total} total)
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {appsFetching && !appsLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Select
                  value={appStatus || ALL}
                  onValueChange={(v) => {
                    setAppStatus(v === ALL ? "" : (v as LoanApplicationStatus));
                    setAppPage(1);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All statuses</SelectItem>
                    {(
                      Object.entries(
                        LOAN_APPLICATION_STATUS_LABELS
                      ) as [LoanApplicationStatus, string][]
                    ).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <Separator />

          {appsLoading ? (
            <CardContent className="py-10 flex justify-center">
              <AppLoader message="Loading applications…" />
            </CardContent>
          ) : applications.length === 0 ? (
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No applications found. Apply for your first loan above.
            </CardContent>
          ) : (
            <div className="divide-y">
              {applications.map((app) => (
                <LoanApplicationItem key={app.id} application={app} />
              ))}
            </div>
          )}

          {appPagination && appPagination.totalPages > 1 && (
            <>
              <Separator />
              <div className="flex items-center justify-between px-6 py-3 text-sm">
                <span className="text-muted-foreground">
                  Page {appPagination.currentPage} of {appPagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!appPagination.hasPreviousPage}
                    onClick={() => setAppPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!appPagination.hasNextPage}
                    onClick={() => setAppPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {tab === "loans" && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">
                Loans
                {loanPagination && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({loanPagination.total} total)
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {loansFetching && !loansLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Select
                  value={loanStatus || ALL}
                  onValueChange={(v) => {
                    setLoanStatus(v === ALL ? "" : (v as LoanStatus));
                    setLoanPage(1);
                  }}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All statuses</SelectItem>
                    {(
                      Object.entries(LOAN_STATUS_LABELS) as [
                        LoanStatus,
                        string,
                      ][]
                    ).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <Separator />

          {loansLoading ? (
            <CardContent className="py-10 flex justify-center">
              <AppLoader message="Loading loans…" />
            </CardContent>
          ) : loans.length === 0 ? (
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No loans yet. Approved applications become loans.
            </CardContent>
          ) : (
            <div className="divide-y">
              {loans.map((loan) => (
                <LoanItem key={loan.id} loan={loan} canRepay />
              ))}
            </div>
          )}

          {loanPagination && loanPagination.totalPages > 1 && (
            <>
              <Separator />
              <div className="flex items-center justify-between px-6 py-3 text-sm">
                <span className="text-muted-foreground">
                  Page {loanPagination.currentPage} of{" "}
                  {loanPagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!loanPagination.hasPreviousPage}
                    onClick={() => setLoanPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!loanPagination.hasNextPage}
                    onClick={() => setLoanPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default FarmerLoansPage;
