import { RISK_LEVEL_COLORS, getRiskLevel } from "../types";

type Props = { score: number };

export const ScoreGauge = ({ score }: Props) => {
  const clamped = Math.max(0, Math.min(100, score));
  const riskLevel = getRiskLevel(clamped);
  const color = RISK_LEVEL_COLORS[riskLevel];

  /* Semicircle gauge: center (100,90), radius 75, arc left→right through visual top */
  const t = clamped / 100;
  const endX = 100 - 75 * Math.cos(Math.PI * t);
  const endY = 90 - 75 * Math.sin(Math.PI * t);
  const largeArc = 0; // always ≤ 180°

  return (
    <svg viewBox="0 0 200 110" className="w-full max-w-[240px] mx-auto">
      {/* Track */}
      <path
        d="M 25 90 A 75 75 0 0 1 175 90"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Fill */}
      {clamped > 0 && (
        <path
          d={`M 25 90 A 75 75 0 ${largeArc} 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
        />
      )}
      {/* Score number */}
      <text
        x="100"
        y="80"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        fill={color}
      >
        {clamped}
      </text>
      <text
        x="100"
        y="98"
        textAnchor="middle"
        fontSize="11"
        fill="#9ca3af"
      >
        out of 100
      </text>
    </svg>
  );
};
