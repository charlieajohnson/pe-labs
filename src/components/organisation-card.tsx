import Link from "next/link";
import type { Organisation } from "@/data/organisations";
import { formatEurMillions } from "@/lib/format";
import type { ScreeningResult } from "@/lib/scoring";
import { ScoreBadge } from "./score-badge";

export function OrganisationCard({
  organisation,
  result,
  selected = false,
}: {
  organisation: Organisation;
  result: ScreeningResult;
  selected?: boolean;
}) {
  return (
    <Link
      href={`/companies/${organisation.slug}`}
      className={selected ? "company-card selected" : "company-card"}
      aria-current={selected ? "true" : undefined}
    >
      <div className="company-card-top">
        <span className="company-monogram">
          {organisation.name.slice(0, 2).toUpperCase()}
        </span>
        <ScoreBadge tier={result.tier} score={result.score} />
      </div>
      <h2>{organisation.name}</h2>
      <span className="location">
        {organisation.city}, {organisation.country} · {organisation.subSector}
      </span>
      <p className="description">{organisation.description}</p>
      <div className="company-card-stats">
        <div>
          <span>Revenue</span>
          <strong>{formatEurMillions(organisation.revenueEurM)}</strong>
        </div>
        <div>
          <span>Growth</span>
          <strong>{organisation.revenueGrowthPct}%</strong>
        </div>
        <div>
          <span>Recurring</span>
          <strong>{organisation.recurringRevenuePct}%</strong>
        </div>
      </div>
    </Link>
  );
}
