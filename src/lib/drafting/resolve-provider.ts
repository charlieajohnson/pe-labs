import { createOpenAIDraftProvider } from "./openai-provider";
import { type DraftProvider, mockDraftProvider } from "./provider";

export class DraftProviderConfigurationError extends Error {}

export function getDraftProvider(): DraftProvider {
  if (process.env.DRAFT_PROVIDER !== "openai") return mockDraftProvider;

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new DraftProviderConfigurationError(
      "Live drafting is not configured.",
    );
  }

  return createOpenAIDraftProvider(apiKey);
}

export function getPublicDraftProvider() {
  return process.env.DRAFT_PROVIDER === "openai" ? "openai" : "mock";
}
