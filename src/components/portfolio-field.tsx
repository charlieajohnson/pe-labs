import Image from "next/image";
import type { CSSProperties } from "react";
import type { Organisation } from "@/data/organisations";
import { formatEurMillions } from "@/lib/format";
import { screenOrganisation } from "@/lib/scoring";

const markerPositions = [
  [18, 24],
  [32, 17],
  [47, 28],
  [66, 18],
  [80, 31],
  [22, 43],
  [39, 47],
  [57, 42],
  [74, 52],
  [14, 62],
  [30, 70],
  [49, 65],
  [63, 73],
  [84, 68],
  [26, 87],
  [43, 82],
  [58, 91],
  [72, 84],
  [88, 89],
  [10, 34],
] as const;

export function PortfolioField({
  organisations,
  selected,
}: {
  organisations: Organisation[];
  selected: Organisation;
}) {
  const selectedScore = screenOrganisation(selected);

  return (
    <figure className="portfolio-field hero-tableau">
      <Image
        src="/atelier/pe-labs-hero-tableau.webp"
        alt="Renaissance-style analyst reviewing company dossiers, market maps and correspondence in a private-market intelligence atelier"
        className="tableau-image"
        width={1536}
        height={1024}
        priority
        sizes="(max-width: 980px) 100vw, 46vw"
      />
      <div
        className="tableau-fallback"
        aria-hidden="true"
        style={
          {
            "--selected-x": "42%",
            "--selected-y": "58%",
          } as CSSProperties
        }
      >
        <div className="field-grid" />
        <div className="fallback-ledger ledger-one" />
        <div className="fallback-ledger ledger-two" />
        <div className="fallback-ledger ledger-three" />
      </div>
      {organisations.slice(0, 20).map((organisation, index) => {
        const [x, y] = markerPositions[index] ?? [50, 50];
        const isSelected = organisation.slug === selected.slug;
        return (
          <span
            key={organisation.slug}
            className={isSelected ? "field-marker selected" : "field-marker"}
            style={
              {
                "--x": `${x}%`,
                "--y": `${y}%`,
              } as CSSProperties
            }
          >
            <span>{organisation.countryCode}</span>
          </span>
        );
      })}
      <div className="case-packet">
        <span className="eyebrow">Current demo universe</span>
        <strong>{organisations.length} synthetic European companies</strong>
        <div className="case-line" />
        <h2>{selected.name}</h2>
        <p className="tableau-detail">
          {selected.subSector} · {selected.ownership} ·{" "}
          {formatEurMillions(selected.revenueEurM)} revenue
        </p>
        <div className="case-chips">
          <span>Screen {selectedScore.score?.toFixed(1) ?? "DQ"}</span>
          <span>{selectedScore.tier}</span>
          <span>{selected.confidence} confidence</span>
        </div>
        <div className="case-thread" aria-hidden="true">
          Source fields · Screening rubric · Outreach context
        </div>
      </div>
    </figure>
  );
}
