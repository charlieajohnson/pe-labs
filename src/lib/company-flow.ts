import type { Route } from "next";
import { getOrganisation, organisations } from "@/data/organisations";

export type WorkflowModule = "intelligence" | "screening" | "outreach";

export const defaultCompanySlug = "alder-pine-systems";

export function resolveSelectedCompany(slug: string | null | undefined) {
  return (
    (slug ? getOrganisation(slug) : undefined) ??
    getOrganisation(defaultCompanySlug) ??
    organisations[0]
  );
}

export function companyDetailHref(slug: string) {
  return `/companies/${encodeURIComponent(slug)}` as Route;
}

export function moduleHref(module: WorkflowModule, slug?: string | null) {
  if (module === "intelligence") {
    return slug ? companyDetailHref(slug) : ("/companies" as Route);
  }

  const path = module === "screening" ? "/screening" : "/outreach";
  return (slug ? `${path}?company=${encodeURIComponent(slug)}` : path) as Route;
}

export function selectedCompanySlugFromRoute(
  pathname: string,
  querySlug?: string | null,
) {
  if (querySlug) return querySlug;

  const match = pathname.match(/^\/companies\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}
