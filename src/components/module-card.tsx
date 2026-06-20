import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type ModuleCardProps = {
  number: string;
  title: string;
  description: string;
  href: Route;
  action: string;
  icon: LucideIcon;
  tone: "sage" | "clay" | "gold";
};

export function ModuleCard({
  number,
  title,
  description,
  href,
  action,
  icon: Icon,
  tone,
}: ModuleCardProps) {
  return (
    <Link href={href} className={`module-card tone-${tone}`}>
      <div className="module-topline">
        <span>{number}</span>
        <Icon size={22} strokeWidth={1.7} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <span className="module-action">
        {action} <ArrowUpRight size={16} />
      </span>
    </Link>
  );
}
