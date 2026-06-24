import { describe, expect, it } from "vitest";
import {
  companyDetailHref,
  moduleHref,
  resolveSelectedCompany,
} from "./company-flow";

describe("selected company workflow routing", () => {
  it("resolves a valid selected company and falls back deterministically", () => {
    expect(resolveSelectedCompany("alder-pine-systems").slug).toBe(
      "alder-pine-systems",
    );
    expect(resolveSelectedCompany("missing-company").slug).toBe(
      "alder-pine-systems",
    );
    expect(resolveSelectedCompany(undefined).slug).toBe("alder-pine-systems");
  });

  it("carries selected company context across workflow modules", () => {
    expect(moduleHref("intelligence", "alder-pine-systems")).toBe(
      "/companies/alder-pine-systems",
    );
    expect(moduleHref("screening", "alder-pine-systems")).toBe(
      "/screening?company=alder-pine-systems",
    );
    expect(moduleHref("outreach", "alder-pine-systems")).toBe(
      "/outreach?company=alder-pine-systems",
    );
  });

  it("uses company detail pages as canonical intelligence records", () => {
    expect(companyDetailHref("alder-pine-systems")).toBe(
      "/companies/alder-pine-systems",
    );
  });
});
