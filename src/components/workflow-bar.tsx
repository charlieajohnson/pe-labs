import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { moduleHref, type WorkflowModule } from "@/lib/company-flow";

const steps = [
  { module: "intelligence", label: "Find", active: "find" },
  { module: "screening", label: "Screen", active: "screen" },
  { module: "outreach", label: "Engage", active: "engage" },
] satisfies Array<{
  module: WorkflowModule;
  label: string;
  active: "find" | "screen" | "engage";
}>;

export function WorkflowBar({
  active,
  selectedSlug,
}: {
  active: "find" | "screen" | "engage";
  selectedSlug?: string;
}) {
  return (
    <nav className="workflow-bar" aria-label="Workflow">
      {steps.map((step, index) => (
        <div key={step.label} className="workflow-step-wrap">
          <Link
            href={moduleHref(step.module, selectedSlug)}
            className={
              active === step.active ? "workflow-step active" : "workflow-step"
            }
            aria-current={active === step.active ? "page" : undefined}
          >
            <span>0{index + 1}</span>
            {step.label}
          </Link>
          {index < steps.length - 1 ? <ArrowRight size={14} /> : null}
        </div>
      ))}
    </nav>
  );
}
