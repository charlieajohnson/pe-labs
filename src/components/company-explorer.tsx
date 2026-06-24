"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { OrganisationCard } from "@/components/organisation-card";
import type { Organisation } from "@/data/organisations";
import { screenOrganisation } from "@/lib/scoring";

export function CompanyExplorer({
  organisations,
  sectors,
  selectedSlug,
}: {
  organisations: Organisation[];
  sectors: string[];
  selectedSlug?: string;
}) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return organisations.filter((organisation) => {
      const matchesSector = sector === "all" || organisation.sector === sector;
      const haystack = [
        organisation.name,
        organisation.city,
        organisation.country,
        organisation.sector,
        organisation.subSector,
        organisation.businessModel,
        organisation.ownership,
      ]
        .join(" ")
        .toLowerCase();
      return matchesSector && (!needle || haystack.includes(needle));
    });
  }, [organisations, query, sector]);

  return (
    <section aria-label="Company universe">
      <div className="toolbar panel">
        <label className="search-field">
          <Search size={18} strokeWidth={1.7} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, sector, country or ownership..."
            aria-label="Search companies"
          />
        </label>
        <select
          value={sector}
          onChange={(event) => setSector(event.target.value)}
          aria-label="Filter by sector"
        >
          <option value="all">All sectors</option>
          {sectors.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="result-meta">
        <span>{filtered.length} organisations</span>
        <span>Metrics last refreshed May 2026</span>
      </div>
      {filtered.length ? (
        <div className="company-grid">
          {filtered.map((organisation) => (
            <OrganisationCard
              key={organisation.slug}
              organisation={organisation}
              result={screenOrganisation(organisation)}
              selected={organisation.slug === selectedSlug}
            />
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <div>
            <strong>No matching organisations</strong>
            <p>Try a broader sector, country or company name.</p>
          </div>
        </div>
      )}
    </section>
  );
}
