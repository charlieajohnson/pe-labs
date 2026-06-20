import type { Metadata } from "next";
import { MetricCard } from "@/components/metric-card";
import { ScreeningExplorer } from "@/components/screening-explorer";
import { WorkflowBar } from "@/components/workflow-bar";
import { organisations } from "@/data/organisations";
import { screenAll } from "@/lib/scoring";

export const metadata: Metadata = {
  title: "Investment screening",
  description:
    "Compare synthetic companies using explicit qualification gates and an inspectable score.",
};

export default function ScreeningPage() {
  const screened = screenAll(organisations);
  const qualified = screened.filter(({ result }) => result.score !== null);
  const highPriority = screened.filter(
    ({ result }) => result.tier === "High priority",
  );
  const median = qualified
    .map(({ result }) => result.score ?? 0)
    .sort((a, b) => a - b)[Math.floor(qualified.length / 2)];

  return (
    <div className="page-shell">
      <WorkflowBar active="screen" />
      <div className="page-intro">
        <div>
          <span className="eyebrow">Investment screening</span>
          <h1>Make the logic visible.</h1>
        </div>
        <p>
          Five qualification gates stop obvious mismatches. Qualified companies
          are ranked on eight explicit dimensions, with every score tied to a
          structured input.
        </p>
      </div>
      <div className="metric-grid">
        <MetricCard
          label="Universe"
          value={String(organisations.length)}
          detail="Synthetic organisations"
        />
        <MetricCard
          label="Qualified"
          value={String(qualified.length)}
          detail="All gates passed"
        />
        <MetricCard
          label="High priority"
          value={String(highPriority.length)}
          detail="Score of 8.0 or above"
          emphasis
        />
        <MetricCard
          label="Median score"
          value={median.toFixed(1)}
          detail="Qualified universe"
        />
        <MetricCard
          label="Disqualified"
          value={String(screened.length - qualified.length)}
          detail="Stopped before ranking"
        />
      </div>
      <ScreeningExplorer organisations={organisations} />
    </div>
  );
}
