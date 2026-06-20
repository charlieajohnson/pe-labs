import { describe, expect, it } from "vitest";
import { getOrganisation, organisations } from "@/data/organisations";
import { screenAll, screenOrganisation } from "./scoring";

describe("screening engine", () => {
  it("keeps qualified scores inside the ten-point scale", () => {
    for (const organisation of organisations) {
      const result = screenOrganisation(organisation);
      expect(result.rawScore).toBeGreaterThanOrEqual(0);
      expect(result.rawScore).toBeLessThanOrEqual(10);
      for (const dimension of result.dimensions) {
        expect(dimension.score).toBeLessThanOrEqual(dimension.max);
      }
      if (result.score !== null) expect(result.score).toBe(result.rawScore);
    }
  });

  it("stops companies that fail a qualification gate", () => {
    const consumerCompany = getOrganisation("rowan-commerce");
    expect(consumerCompany).toBeDefined();
    if (!consumerCompany) throw new Error("Fixture not found");
    const result = screenOrganisation(consumerCompany);
    expect(result.tier).toBe("Disqualified");
    expect(result.score).toBeNull();
    expect(result.gates.find((gate) => gate.key === "b2b")?.pass).toBe(false);
  });

  it("ranks qualified companies before disqualified companies", () => {
    const results = screenAll(organisations);
    const firstDisqualified = results.findIndex(
      ({ result }) => result.score === null,
    );
    const lastQualified = results.findLastIndex(
      ({ result }) => result.score !== null,
    );
    expect(firstDisqualified).toBeGreaterThan(lastQualified);
  });
});
