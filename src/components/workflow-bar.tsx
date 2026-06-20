import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

const steps = [
  { href: "/companies", label: "Find" },
  { href: "/screening", label: "Screen" },
  { href: "/outreach", label: "Engage" },
] satisfies Array<{ href: Route; label: string }>;

export function WorkflowBar({
  active,
}: {
  active: "find" | "screen" | "engage";
}) {
  return (
    <nav className="workflow-bar" aria-label="Workflow">
      {steps.map((step, index) => (
        <div key={step.label} className="workflow-step-wrap">
          <Link
            href={step.href}
            className={
              active === step.label.toLowerCase()
                ? "workflow-step active"
                : "workflow-step"
            }
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
