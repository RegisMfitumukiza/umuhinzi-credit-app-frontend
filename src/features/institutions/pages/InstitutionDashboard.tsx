import { AlertCircle, Clock, ShieldOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

import { AppLoader } from "@/shared/components/common/AppLoader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

import { useMyInstitution } from "../hooks/useMyInstitution";
import { CreateInstitutionForm } from "../components/CreateInstitutionForm";
import { EditInstitutionCard } from "../components/EditInstitutionCard";
import { InstitutionStatusBadge } from "../components/InstitutionStatusBadge";
import {
  INSTITUTION_TYPE_LABELS,
  REGULATED_INSTITUTION_TYPES,
  type Institution,
} from "../types";

const InstitutionDashboard = () => {
  const { data: institution, isLoading } = useMyInstitution();

  if (isLoading) return <AppLoader message="Loading institution..." />;

  if (!institution) return <SetupView />;

  switch (institution.status) {
    case "PENDING":
      return <PendingView institution={institution} />;
    case "ACTIVE":
      return <ActiveView institution={institution} />;
    case "SUSPENDED":
      return <SuspendedView institution={institution} />;
    case "DEACTIVATED":
      return <DeactivatedView />;
    default:
      return null;
  }
};

/* ─── Setup: no institution yet ─── */
const SetupView = () => (
  <div className="mx-auto max-w-2xl">
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">Register your institution</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Submit your institution profile to access lending and credit services.
        An admin will review and activate it once the required details are provided.
      </p>
    </div>
    <Card>
      <CardContent className="pt-6">
        <CreateInstitutionForm />
      </CardContent>
    </Card>
  </div>
);

/* ─── Pending: awaiting admin review ─── */
const PendingView = ({ institution }: { institution: Institution }) => (
  <div className="mx-auto max-w-2xl space-y-4">
    <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
      <div>
        <p className="font-medium text-yellow-800">Awaiting admin approval</p>
        <p className="mt-0.5 text-sm text-yellow-700">
          Your institution has been submitted and is under review. Make sure{" "}
          <strong>district</strong> is filled in
          {REGULATED_INSTITUTION_TYPES.includes(institution.type) && (
            <>
              {" "}and both <strong>registration</strong> and <strong>license numbers</strong> are provided
            </>
          )}{" "}
          — they are required for activation.
        </p>
      </div>
    </div>
    <EditInstitutionCard institution={institution} />
  </div>
);

/* ─── Active: full dashboard ─── */
const ActiveView = ({ institution }: { institution: Institution }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold">{institution.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {INSTITUTION_TYPE_LABELS[institution.type]}
        {institution.district ? ` · ${institution.district}` : ""}
      </p>
    </div>

    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <EditInstitutionCard institution={institution} />
      </div>

      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Institution summary</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 space-y-3 text-sm">
            <SummaryRow label="Status">
              <InstitutionStatusBadge status={institution.status} />
            </SummaryRow>
            <SummaryRow label="Type">
              {INSTITUTION_TYPE_LABELS[institution.type]}
            </SummaryRow>
            {institution.registrationNumber && (
              <SummaryRow label="Registration no.">
                {institution.registrationNumber}
              </SummaryRow>
            )}
            {institution.licenseNumber && (
              <SummaryRow label="License no.">
                {institution.licenseNumber}
              </SummaryRow>
            )}
            {institution.email && (
              <SummaryRow label="Email">{institution.email}</SummaryRow>
            )}
            {institution.phone && (
              <SummaryRow label="Phone">{institution.phone}</SummaryRow>
            )}
            {institution.district && (
              <SummaryRow label="Location">
                {[
                  institution.village,
                  institution.cell,
                  institution.sector,
                  institution.district,
                  institution.province,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </SummaryRow>
            )}
            <SummaryRow label="Member since">
              {new Date(institution.createdAt).toLocaleDateString()}
            </SummaryRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Loan services</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Review applications, approve and disburse loans for farmers in your portfolio.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to={ROUTES.INSTITUTION_LOANS}>Manage loans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

/* ─── Suspended ─── */
const SuspendedView = ({ institution }: { institution: Institution }) => (
  <div className="mx-auto max-w-2xl space-y-4">
    <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
      <ShieldOff className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
      <div>
        <p className="font-medium text-orange-800">Institution suspended</p>
        <p className="mt-0.5 text-sm text-orange-700">
          Your institution has been suspended by an admin. Contact support for more information.
        </p>
      </div>
    </div>
    <EditInstitutionCard institution={institution} />
  </div>
);

/* ─── Deactivated ─── */
const DeactivatedView = () => (
  <div className="mx-auto max-w-md">
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
      <div>
        <p className="font-medium text-gray-700">Institution deactivated</p>
        <p className="mt-0.5 text-sm text-gray-600">
          This institution has been deactivated. Contact an admin if you believe this is an error.
        </p>
      </div>
    </div>
  </div>
);

/* ─── Helpers ─── */
const SummaryRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4">
    <span className="shrink-0 text-muted-foreground">{label}</span>
    <span className="text-right font-medium">{children}</span>
  </div>
);

export default InstitutionDashboard;
