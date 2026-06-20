import type { ScreeningTier } from "@/lib/scoring";
import { tierClass } from "@/lib/scoring";

export function ScoreBadge({
  tier,
  score,
}: {
  tier: ScreeningTier;
  score: number | null;
}) {
  return (
    <span className={`score-badge ${tierClass(tier)}`}>
      {score === null ? "DQ" : score.toFixed(1)}
      <span>{tier}</span>
    </span>
  );
}
