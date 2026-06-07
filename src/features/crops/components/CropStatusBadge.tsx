import { Badge } from "@/shared/components/ui/badge";
import type { CropStatus } from "../types";
import { CROP_STATUS_LABELS } from "../types";

const variantMap: Record<
  CropStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  PLANNED: "outline",
  PLANTED: "secondary",
  GROWING: "default",
  HARVESTED: "default",
  FAILED: "destructive",
};

const colorMap: Record<CropStatus, string> = {
  PLANNED: "",
  PLANTED: "bg-blue-100 text-blue-700 border-blue-200",
  GROWING: "bg-green-100 text-green-700 border-green-200",
  HARVESTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  FAILED: "",
};

type Props = { status: CropStatus };

export const CropStatusBadge = ({ status }: Props) => {
  const extra = colorMap[status];
  return (
    <Badge
      variant={variantMap[status]}
      className={extra || undefined}
    >
      {CROP_STATUS_LABELS[status]}
    </Badge>
  );
};
