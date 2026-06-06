import { CheckCircle2, Circle, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";

import { useFarmerCompleteness } from "../hooks/useFarmerCompleteness";

const SETTINGS_KEYS = new Set(["phone", "province", "district", "profileImage"]);
const FARM_KEYS = new Set(["farm", "crop"]);

export const ProfileCompletenessCard = () => {
  const { data: completeness, isLoading } = useFarmerCompleteness();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Profile completeness</CardTitle>
        <CardDescription>Complete your profile to get verified</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !completeness ? null : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{completeness.percentage}%</span>
                <span className="text-muted-foreground">
                  {completeness.completedCount}/{completeness.totalChecks} done
                </span>
              </div>
              <Progress value={completeness.percentage} className="h-2" />
              {completeness.isReadyForVerification && completeness.percentage < 100 && (
                <p className="text-xs text-green-600">
                  Ready for admin verification — complete remaining items to strengthen your profile.
                </p>
              )}
            </div>

            <ul className="space-y-2">
              {completeness.items.map((item) => (
                <li key={item.key} className="flex items-start gap-2 text-sm">
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                  )}
                  <span className={item.done ? "text-muted-foreground line-through" : ""}>
                    {item.label}
                    {!item.done && SETTINGS_KEYS.has(item.key) && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (Profile Settings)
                      </span>
                    )}
                    {!item.done && FARM_KEYS.has(item.key) && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (Farms section)
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
