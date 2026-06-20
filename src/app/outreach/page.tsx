import type { Metadata } from "next";
import { OutreachStudio } from "@/components/outreach-studio";
import { WorkflowBar } from "@/components/workflow-bar";
import { getOrganisation, organisations } from "@/data/organisations";
import { getPublicDraftProvider } from "@/lib/drafting/resolve-provider";

export const metadata: Metadata = {
  title: "Relationship drafting",
  description:
    "Turn structured company context into concise, relevant outreach through a swappable provider.",
};

export default async function OutreachPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company } = await searchParams;
  const initialSlug =
    company && getOrganisation(company) ? company : organisations[0].slug;
  const providerMode = getPublicDraftProvider();

  return (
    <div className="page-shell">
      <WorkflowBar active="engage" />
      <div className="page-intro">
        <div>
          <span className="eyebrow">Relationship drafting</span>
          <h1>Write with a reason.</h1>
        </div>
        <p>
          Structured company context, relationship stage and one clear angle go
          in. A concise, reviewable draft comes out. Provider boundaries keep
          generation server-side, schema-validated and replaceable.
        </p>
      </div>
      <OutreachStudio
        organisations={organisations}
        initialSlug={initialSlug}
        providerMode={providerMode}
      />
    </div>
  );
}
