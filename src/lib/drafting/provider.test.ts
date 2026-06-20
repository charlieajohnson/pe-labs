import { describe, expect, it } from "vitest";
import { getOrganisation } from "@/data/organisations";
import { mockDraftProvider } from "./provider";
import { draftInputSchema, draftOutputSchema } from "./schema";

describe("mock drafting provider", () => {
  it("returns validated structured output grounded in the selected company", async () => {
    const organisation = getOrganisation("alder-pine-systems");
    expect(organisation).toBeDefined();
    if (!organisation) throw new Error("Fixture not found");
    const input = draftInputSchema.parse({
      organisationSlug: organisation.slug,
      recipientFirstName: "Sophie",
      recipientRole: "Founder & CEO",
      mode: "first-touch",
      angle: "international expansion in specialist software",
    });
    const output = draftOutputSchema.parse(
      await mockDraftProvider.generate(input, organisation),
    );
    expect(output.body).toContain(organisation.name);
    expect(output.body).toContain("Sophie");
    expect(output.contextUsed).toHaveLength(4);
    expect(output.provider).toBe("mock-v1");
    expect(output.model).toBe("deterministic-template");
  });
});
