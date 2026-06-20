"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "./brand-mark";

const links = [
  { href: "/companies", label: "Intelligence" },
  { href: "/screening", label: "Screening" },
  { href: "/outreach", label: "Outreach" },
] satisfies Array<{ href: Route; label: string }>;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark />
        <nav className="main-nav" aria-label="Primary navigation">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "active" : undefined}
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
