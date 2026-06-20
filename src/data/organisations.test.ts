import { describe, expect, it } from "vitest";
import { organisations } from "./organisations";

describe("synthetic organisation universe", () => {
  it("contains exactly twenty uniquely addressable organisations", () => {
    expect(organisations).toHaveLength(20);
    expect(
      new Set(organisations.map((organisation) => organisation.slug)).size,
    ).toBe(20);
  });

  it("uses reserved example domains only", () => {
    for (const organisation of organisations) {
      expect(organisation.domain.endsWith(".example")).toBe(true);
    }
  });

  it("has complete investment context", () => {
    for (const organisation of organisations) {
      expect(organisation.thesis.length).toBeGreaterThan(0);
      expect(organisation.risks.length).toBeGreaterThan(0);
      expect(organisation.signals.length).toBeGreaterThan(0);
      expect(organisation.revenueEurM).toBeGreaterThan(0);
    }
  });
});
