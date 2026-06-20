import { describe, expect, it } from "vitest";
import { openAIPrompt } from "./openai-provider";

describe("OpenAI drafting prompt", () => {
  it("pins the public writing and grounding constraints", () => {
    expect(openAIPrompt.version).toBe("outreach-v1");
    expect(openAIPrompt.instructions).toContain("British English");
    expect(openAIPrompt.instructions).toContain(
      "supplied synthetic company facts",
    );
    expect(openAIPrompt.instructions).toContain("Do not use em dashes");
  });
});
