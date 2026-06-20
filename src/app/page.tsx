import { ArrowRight, ChartNoAxesCombined, Mail, Search } from "lucide-react";
import Link from "next/link";
import { ModuleCard } from "@/components/module-card";
import { OrganisationCard } from "@/components/organisation-card";
import { organisations } from "@/data/organisations";
import { screenAll } from "@/lib/scoring";

export default function HomePage() {
  const featured = screenAll(organisations)
    .filter(({ result }) => result.score !== null)
    .slice(0, 3);

  return (
    <div className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">A working portfolio · 2026</span>
          <h1>
            Better signals for <em>better decisions.</em>
          </h1>
          <p className="hero-summary">
            Three connected demonstrations of applied AI in private equity: turn
            fragmented company data into an investment view, then into the next
            useful action.
          </p>
          <div className="hero-actions">
            <Link href="/companies" className="button">
              Explore the company universe <ArrowRight size={16} />
            </Link>
            <Link href="/screening" className="button secondary">
              View ranked screens
            </Link>
          </div>
        </div>
        <div
          className="hero-landscape"
          role="img"
          aria-label="Abstract pastoral landscape"
        >
          <div className="landscape-note">
            <span>Current demo universe</span>
            <strong>20 synthetic European companies</strong>
          </div>
        </div>
      </section>

      <section aria-labelledby="modules-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">One connected workflow</span>
            <h2 id="modules-title">From market map to conversation</h2>
          </div>
          <p>
            Each module uses the same structured company context. No hidden
            database, no live client data and no black-box score.
          </p>
        </div>
        <div className="module-grid">
          <ModuleCard
            number="01 / Find"
            title="Company intelligence"
            description="Search a synthetic European company universe and open a concise, evidence-aware investment profile."
            href="/companies"
            action="Explore companies"
            icon={Search}
            tone="sage"
          />
          <ModuleCard
            number="02 / Screen"
            title="Investment screening"
            description="Apply explicit qualification gates and an inspectable ten-point rubric across every company."
            href="/screening"
            action="Review the ranking"
            icon={ChartNoAxesCombined}
            tone="clay"
          />
          <ModuleCard
            number="03 / Engage"
            title="Relationship drafting"
            description="Turn structured company context and an angle into concise outreach through a swappable provider boundary."
            href="/outreach"
            action="Draft an email"
            icon={Mail}
            tone="gold"
          />
        </div>
      </section>

      <section aria-labelledby="featured-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Ranked by the demo screen</span>
            <h2 id="featured-title">Highest-priority companies</h2>
          </div>
          <p>
            Scores are deterministic and reproducible. Every point can be traced
            back to a source field.
          </p>
        </div>
        <div className="company-grid">
          {featured.map(({ organisation, result }) => (
            <OrganisationCard
              key={organisation.slug}
              organisation={organisation}
              result={result}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
