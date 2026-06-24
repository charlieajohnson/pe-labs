"use client";

import { ArrowRight, Check, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ScoreBadge } from "@/components/score-badge";
import type { Organisation } from "@/data/organisations";
import { companyDetailHref, moduleHref } from "@/lib/company-flow";
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

const sourceFieldsByDimension: Record<string, string> = {
  "revenue-quality": "recurringRevenuePct",
  scale: "ebitdaEurM",
  growth: "revenueGrowthPct",
  profitability: "ebitdaEurM / revenueEurM",
  "market-focus": "marketFocus + subSector",
  "product-depth": "productDepth",
  internationalisation: "internationalRevenuePct",
  dealability: "ownership",
};

export function ScreeningExplorer({
  organisations,
  initialSlug,
}: {
  organisations: Organisation[];
  initialSlug: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<(typeof tiers)[number]>("All tiers");
  const [sort, setSort] = useState("score");
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);

  useEffect(() => {
    setSelectedSlug(initialSlug);
  }, [initialSlug]);

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

  const selectedOrganisation =
    organisations.find((organisation) => organisation.slug === selectedSlug) ??
    organisations[0];
  const selectedResult = screenOrganisation(selectedOrganisation);

  function selectOrganisation(slug: string) {
    setSelectedSlug(slug);
    router.replace(moduleHref("screening", slug), { scroll: false });
  }

  return (
    <section aria-label="Investment screening table">
      <div className="selected-screen panel">
        <div className="selected-screen-header">
          <div>
            <span className="eyebrow">Selected company screen</span>
            <h2>{selectedOrganisation.name}</h2>
            <p>
              {selectedOrganisation.subSector} · {selectedOrganisation.city},{" "}
              {selectedOrganisation.country}
            </p>
          </div>
          <div className="selected-score">
            <strong>
              {selectedResult.score === null
                ? "DQ"
                : selectedResult.score.toFixed(1)}
            </strong>
            <ScoreBadge
              tier={selectedResult.tier}
              score={selectedResult.score}
            />
          </div>
        </div>
        <p className="screening-note">{selectedResult.recommendation}</p>
        <div className="selected-actions">
          <Link
            href={companyDetailHref(selectedOrganisation.slug)}
            className="button secondary small"
          >
            Open intelligence profile
          </Link>
          <Link
            href={moduleHref("outreach", selectedOrganisation.slug)}
            className="button small"
          >
            Send to outreach <ArrowRight size={14} />
          </Link>
        </div>
        <div className="screening-detail-grid">
          <div>
            <div className="panel-title compact">
              <h3>Qualification gates</h3>
              <span>
                {selectedResult.gates.filter((gate) => gate.pass).length} /{" "}
                {selectedResult.gates.length} passed
              </span>
            </div>
            <div className="gate-list compact">
              {selectedResult.gates.map((gate) => (
                <div key={gate.key} className="gate-row">
                  <span className={gate.pass ? "gate-icon" : "gate-icon fail"}>
                    {gate.pass ? <Check size={12} /> : <X size={12} />}
                  </span>
                  <div>
                    <strong>{gate.label}</strong>
                    <p>{gate.evidence}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="panel-title compact">
              <h3>Score ledger</h3>
              <span>Source fields</span>
            </div>
            <div className="dimension-list compact">
              {selectedResult.dimensions.map((dimension) => (
                <div key={dimension.key} className="dimension-row">
                  <div className="dimension-head">
                    <span>{dimension.label}</span>
                    <strong>
                      {dimension.score.toFixed(
                        dimension.max % 0.5 === 0 ? 1 : 2,
                      )}{" "}
                      /{" "}
                      {dimension.max.toFixed(dimension.max % 0.5 === 0 ? 1 : 2)}
                    </strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(dimension.score / dimension.max) * 100}%`,
                      }}
                    />
                  </div>
                  <p>{dimension.rationale}</p>
                  <span className="source-chip">
                    Source field:{" "}
                    {sourceFieldsByDimension[dimension.key] ?? dimension.key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
            <button
              key={organisation.slug}
              type="button"
              className={
                organisation.slug === selectedOrganisation.slug
                  ? "screening-row selected"
                  : "screening-row"
              }
              onClick={() => selectOrganisation(organisation.slug)}
              aria-current={
                organisation.slug === selectedOrganisation.slug
                  ? "true"
                  : undefined
              }
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
            </button>
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
