"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ScoreBadge } from "@/components/score-badge";
import type { Organisation } from "@/data/organisations";
import { formatEurMillions, formatPercent } from "@/lib/format";
import { type ScreeningTier, screenOrganisation } from "@/lib/scoring";

const tiers: Array<ScreeningTier | "All tiers"> = [
  "All tiers",
  "High priority",
  "Attractive",
  "Watch",
  "Low fit",
  "Disqualified",
];

export function ScreeningExplorer({
  organisations,
}: {
  organisations: Organisation[];
}) {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<(typeof tiers)[number]>("All tiers");
  const [sort, setSort] = useState("score");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return organisations
      .map((organisation) => ({
        organisation,
        result: screenOrganisation(organisation),
      }))
      .filter(({ organisation, result }) => {
        const matchesQuery =
          !needle ||
          [
            organisation.name,
            organisation.sector,
            organisation.subSector,
            organisation.country,
          ]
            .join(" ")
            .toLowerCase()
            .includes(needle);
        return matchesQuery && (tier === "All tiers" || result.tier === tier);
      })
      .sort((a, b) => {
        if (sort === "growth")
          return (
            b.organisation.revenueGrowthPct - a.organisation.revenueGrowthPct
          );
        if (sort === "revenue")
          return b.organisation.revenueEurM - a.organisation.revenueEurM;
        return (b.result.score ?? -1) - (a.result.score ?? -1);
      });
  }, [organisations, query, sort, tier]);

  return (
    <section aria-label="Investment screening table">
      <div className="toolbar panel">
        <label className="search-field">
          <Search size={18} strokeWidth={1.7} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the ranked universe..."
            aria-label="Search ranked companies"
          />
        </label>
        <select
          value={tier}
          onChange={(event) =>
            setTier(event.target.value as (typeof tiers)[number])
          }
          aria-label="Filter by screening tier"
        >
          {tiers.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort companies"
        >
          <option value="score">Sort: score</option>
          <option value="growth">Sort: growth</option>
          <option value="revenue">Sort: revenue</option>
        </select>
      </div>
      <div className="result-meta">
        <span>{rows.length} screening results</span>
        <span>Illustrative rubric v1.0</span>
      </div>
      {rows.length ? (
        <div className="screening-list panel">
          <div className="screening-row header" aria-hidden="true">
            <span>Company</span>
            <span>Sector</span>
            <span>Revenue</span>
            <span>Growth</span>
            <span>Ownership</span>
            <span>Screen</span>
          </div>
          {rows.map(({ organisation, result }) => (
            <Link
              key={organisation.slug}
              href={`/companies/${organisation.slug}`}
              className="screening-row"
            >
              <div className="screening-company">
                <span className="company-monogram">
                  {organisation.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <strong>{organisation.name}</strong>
                  <span>
                    {organisation.city}, {organisation.country}
                  </span>
                </div>
              </div>
              <div className="screen-cell">
                {organisation.sector}
                <small>{organisation.subSector}</small>
              </div>
              <div className="screen-cell">
                {formatEurMillions(organisation.revenueEurM)}
                <small>
                  {formatEurMillions(organisation.ebitdaEurM)} EBITDA
                </small>
              </div>
              <div className="screen-cell">
                {formatPercent(organisation.revenueGrowthPct)}
                <small>{organisation.recurringRevenuePct}% recurring</small>
              </div>
              <div className="screen-cell">
                {organisation.ownership}
                <small>
                  {organisation.internationalRevenuePct}% international
                </small>
              </div>
              <ScoreBadge tier={result.tier} score={result.score} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <div>
            <strong>No screening results</strong>
            <p>Clear the filters or try a broader search.</p>
          </div>
        </div>
      )}
    </section>
  );
}
