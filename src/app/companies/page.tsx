import type { Metadata } from "next";
import { CompanyExplorer } from "@/components/company-explorer";
import { WorkflowBar } from "@/components/workflow-bar";
import { organisations, sectors } from "@/data/organisations";
import { resolveSelectedCompany } from "@/lib/company-flow";

export const metadata: Metadata = {
  title: "Company intelligence",
  description:
    "Search and inspect a synthetic universe of European technology companies.",
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company } = await searchParams;
  const selected = company ? resolveSelectedCompany(company) : undefined;

  return (
    <div className="page-shell">
      <WorkflowBar active="find" selectedSlug={selected?.slug} />
      <div className="page-intro">
        <div>
          <span className="eyebrow">Company intelligence</span>
          <h1>Find the signal.</h1>
        </div>
        <p>
          Search twenty synthetic European technology businesses. Each profile
          combines financial, ownership, workforce and market signals in one
          decision-ready view.
        </p>
      </div>
      <CompanyExplorer
        organisations={organisations}
        sectors={sectors}
        selectedSlug={selected?.slug}
      />
    </div>
  );
}
