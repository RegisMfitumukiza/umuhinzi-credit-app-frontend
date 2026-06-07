import { format } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { CreditScoreTrend } from "../types";
import { TRAJECTORY_LABELS, TRAJECTORY_STYLES } from "../types";

type Props = { trend: CreditScoreTrend };

export const CreditScoreTrendChart = ({ trend }: Props) => {
  if (!trend.hasData || trend.scoreHistory.length < 2) return null;

  const chartData = [...trend.scoreHistory]
    .sort(
      (a, b) =>
        new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime()
    )
    .map((item) => ({
      date: format(new Date(item.generatedAt), "MMM d"),
      score: item.score,
    }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold">Score Trend</h3>
            <p className="text-xs text-muted-foreground">
              {trend.insight}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={TRAJECTORY_STYLES[trend.trajectory]}
            >
              {TRAJECTORY_LABELS[trend.trajectory]}
            </Badge>
            {trend.scoreDelta !== 0 && (
              <span
                className={`text-xs font-medium ${
                  trend.scoreDelta > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {trend.scoreDelta > 0 ? "+" : ""}
                {trend.scoreDelta} pts overall
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 12, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
              formatter={(value: number) => [value, "Score"]}
            />
            {/* Risk threshold lines */}
            <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="4 4" strokeWidth={1} />
            <ReferenceLine y={50} stroke="#eab308" strokeDasharray="4 4" strokeWidth={1} />
            <ReferenceLine y={30} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 bg-green-500" /> Low risk (≥70)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 bg-yellow-500" /> Medium (≥50)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 bg-orange-500" /> High (≥30)
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
