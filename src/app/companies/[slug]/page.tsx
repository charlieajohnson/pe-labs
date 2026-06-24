import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MetricCard } from "@/components/metric-card";
import { ScoreRadar } from "@/components/score-radar";
import { WorkflowBar } from "@/components/workflow-bar";
import { getOrganisation, organisations } from "@/data/organisations";
import { moduleHref } from "@/lib/company-flow";
import { formatDate, formatEurMillions, formatPercent } from "@/lib/format";
import { screenOrganisation, tierClass } from "@/lib/scoring";

export function generateStaticParams() {
  return organisations.map((organisation) => ({ slug: organisation.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const organisation = getOrganisation(slug);
  if (!organisation) return {};
  return {
    title: organisation.name,
    description: organisation.description,
  };
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const organisation = getOrganisation(slug);
  if (!organisation) notFound();

  const result = screenOrganisation(organisation);
  const margin = (organisation.ebitdaEurM / organisation.revenueEurM) * 100;

  return (
    <div className="page-shell detail-header">
      <WorkflowBar active="find" selectedSlug={organisation.slug} />
      <div className="breadcrumb">
        <Link href="/companies">
          <ArrowLeft size={13} />
        </Link>
        <Link href="/companies">Company intelligence</Link>
        <span>/</span>
        <span>{organisation.name}</span>
      </div>

      <div className="detail-title">
        <div>
          <span className="eyebrow">
            {organisation.sector} · {organisation.city}, {organisation.country}
          </span>
          <h1>{organisation.name}</h1>
          <p>
            {organisation.businessModel} · {organisation.ownership} · Founded{" "}
            {organisation.founded}
          </p>
        </div>
        <div className="detail-actions">
          <Link
            href={moduleHref("screening", organisation.slug)}
            className="button secondary small"
          >
            Screen this company
          </Link>
          <Link
            href={moduleHref("outreach", organisation.slug)}
            className="button small"
          >
            Draft outreach <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard
          label="Revenue"
          value={formatEurMillions(organisation.revenueEurM)}
          detail="Illustrative LTM"
        />
        <MetricCard
          label="EBITDA"
          value={formatEurMillions(organisation.ebitdaEurM)}
          detail={`${margin.toFixed(0)}% margin`}
        />
        <MetricCard
          label="Revenue growth"
          value={formatPercent(organisation.revenueGrowthPct)}
          detail="Year on year"
        />
        <MetricCard
          label="Recurring revenue"
          value={`${organisation.recurringRevenuePct}%`}
          detail="Estimated share"
        />
        <MetricCard
          label="Employees"
          value={organisation.employees.toLocaleString("en-GB")}
          detail={`${formatPercent(organisation.employeeGrowthPct)} year on year`}
          emphasis
        />
      </div>

      <div className="detail-layout">
        <div>
          <section className="panel content-panel">
            <div className="panel-title">
              <h2>Company view</h2>
              <span>{organisation.confidence} confidence</span>
            </div>
            <p className="narrative">{organisation.description}</p>
            <div className="context-used">
              <span>{organisation.subSector}</span>
              <span>{organisation.businessModel}</span>
              <span>{organisation.region}</span>
              <span>{organisation.ownership}</span>
            </div>
          </section>

          <section className="panel content-panel">
            <div className="panel-title">
              <h2>Synthetic source fields</h2>
              <span>No live client data</span>
            </div>
            <div className="source-field-grid">
              {[
                ["Business model", organisation.businessModel],
                ["Ownership", organisation.ownership],
                ["Revenue", formatEurMillions(organisation.revenueEurM)],
                ["EBITDA", formatEurMillions(organisation.ebitdaEurM)],
                ["Recurring revenue", `${organisation.recurringRevenuePct}%`],
                [
                  "International revenue",
                  `${organisation.internationalRevenuePct}%`,
                ],
              ].map(([label, value]) => (
                <div key={label} className="source-field">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="panel content-panel">
            <div className="panel-title">
              <h2>Investment thesis</h2>
              <span>What could be true</span>
            </div>
            <ul className="bullet-list">
              {organisation.thesis.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="panel content-panel">
            <div className="panel-title">
              <h2>Risks to resolve</h2>
              <span>Before advancing</span>
            </div>
            <ul className="bullet-list risks">
              {organisation.risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="panel content-panel">
            <div className="panel-title">
              <h2>Screening dimensions</h2>
              <span>Deterministic v1.0</span>
            </div>
            <div className="dimension-list">
              {result.dimensions.map((dimension) => (
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
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <section className="panel content-panel">
            <div className="panel-title">
              <h2>Initial screen</h2>
              <span>Out of 10</span>
            </div>
            <div className="screen-summary">
              <div className="score-number">
                <strong>
                  {result.score === null ? "DQ" : result.score.toFixed(1)}
                </strong>
                <span className={tierClass(result.tier)}>{result.tier}</span>
              </div>
              <ScoreRadar dimensions={result.dimensions} />
            </div>
            <p className="narrative">{result.recommendation}</p>
          </section>

          <section className="panel content-panel">
            <div className="panel-title">
              <h3>Qualification gates</h3>
              <span>
                {result.gates.filter((gate) => gate.pass).length} /{" "}
                {result.gates.length} passed
              </span>
            </div>
            <div className="gate-list">
              {result.gates.map((gate) => (
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
          </section>

          <section className="panel content-panel">
            <div className="panel-title">
              <h3>Recent signals</h3>
              <span>As at {formatDate(organisation.dataAsOf)}</span>
            </div>
            <ul className="bullet-list">
              {organisation.signals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
