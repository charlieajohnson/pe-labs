"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  moduleHref,
  selectedCompanySlugFromRoute,
  type WorkflowModule,
} from "@/lib/company-flow";
import { BrandMark } from "./brand-mark";

const links = [
  { module: "intelligence", path: "/companies", label: "Intelligence" },
  { module: "screening", path: "/screening", label: "Screening" },
  { module: "outreach", path: "/outreach", label: "Outreach" },
] satisfies Array<{ module: WorkflowModule; path: string; label: string }>;

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSlug = selectedCompanySlugFromRoute(
    pathname,
    searchParams.get("company"),
  );

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark />
        <nav className="main-nav" aria-label="Primary navigation">
          {links.map((link) => {
            const active = pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={moduleHref(link.module, selectedSlug)}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="demo-status" title="All data is synthetic">
          <span /> Synthetic demo
        </div>
      </div>
    </header>
  );
}

export function SiteHeaderFallback() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark />
        <nav className="main-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.path} href={moduleHref(link.module)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="demo-status" title="All data is synthetic">
          <span /> Synthetic demo
        </div>
      </div>
    </header>
  );
}
