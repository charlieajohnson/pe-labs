import type { Metadata } from "next";
import { CompanyExplorer } from "@/components/company-explorer";
import { WorkflowBar } from "@/components/workflow-bar";
import { organisations, sectors } from "@/data/organisations";

export const metadata: Metadata = {
  title: "Company intelligence",
  description:
    "Search and inspect a synthetic universe of European technology companies.",
};

export default function CompaniesPage() {
  return (
    <div className="page-shell">
      <WorkflowBar active="find" />
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
      <CompanyExplorer organisations={organisations} sectors={sectors} />
    </div>
  );
}
