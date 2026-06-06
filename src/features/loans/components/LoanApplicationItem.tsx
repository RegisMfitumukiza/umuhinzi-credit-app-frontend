import { useState } from "react";
import { Loader2, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

import { useUpdateLoanApplicationStatus } from "../hooks/useUpdateLoanApplicationStatus";
import { useDeleteLoanApplication } from "../hooks/useDeleteLoanApplication";
import { LoanApplicationStatusBadge } from "./LoanApplicationStatusBadge";
import { ReviewApplicationDialog } from "./ReviewApplicationDialog";
import {
  formatCurrency,
  LOAN_APPLICATION_STATUS_LABELS,
  LOAN_PURPOSE_LABELS,
  type LoanApplication,
  type LoanApplicationStatus,
} from "../types";

interface Props {
  application: LoanApplication;
  isReviewer?: boolean;
}

const REVIEWER_STATUS_MOVES: Record<
  LoanApplicationStatus,
  Array<"UNDER_REVIEW" | "APPROVED" | "REJECTED" | "CANCELLED">
> = {
  PENDING: ["UNDER_REVIEW", "CANCELLED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: [],
  REJECTED: [],
  CANCELLED: [],
};

export const LoanApplicationItem = ({ application, isReviewer = false }: Props) => {
  const [reviewOpen, setReviewOpen] = useState(false);
  const { mutate: cancel, isPending: cancelling } =
    useUpdateLoanApplicationStatus();
  const { mutate: deleteApp, isPending: deleting } = useDeleteLoanApplication();

  const canCancel = application.status === "PENDING";
  const canDelete = application.status === "PENDING";
  const allowedMoves = isReviewer
    ? REVIEWER_STATUS_MOVES[application.status] ?? []
    : [];

  const handleCancel = () => {
    cancel(
      { id: application.id, payload: { status: "CANCELLED" } },
      {
        onSuccess: () => toast.success("Application cancelled."),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleDelete = () => {
    deleteApp(application.id, {
      onSuccess: () => toast.success("Application deleted."),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">
              {formatCurrency(application.requestedAmount)}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              {LOAN_PURPOSE_LABELS[application.purpose]}
            </span>
            {application.farmer && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {application.farmer.user.fullName}
                </span>
              </>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {application.institution && (
              <span>{application.institution.name}</span>
            )}
            {application.purposeDescription && (
              <span className="truncate max-w-xs">
                {application.purposeDescription}
              </span>
            )}
            {application.rejectionReason && (
              <span className="text-red-600">
                Rejected: {application.rejectionReason}
              </span>
            )}
            <span>{new Date(application.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LoanApplicationStatusBadge
            status={application.status as LoanApplicationStatus}
          />

          {isReviewer && allowedMoves.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setReviewOpen(true)}
            >
              Review
            </Button>
          )}

          {!isReviewer && canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  <span className="ml-1">Cancel</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel application?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel your{" "}
                    {LOAN_APPLICATION_STATUS_LABELS[application.status].toLowerCase()}{" "}
                    loan application for{" "}
                    {formatCurrency(application.requestedAmount)}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>
                    Yes, cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {!isReviewer && canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete application?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {isReviewer && allowedMoves.length > 0 && (
        <ReviewApplicationDialog
          application={application}
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          allowedStatusMoves={allowedMoves}
        />
      )}
    </>
  );
};
