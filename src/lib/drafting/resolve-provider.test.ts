import { afterEach, describe, expect, it } from "vitest";
import {
  DraftProviderConfigurationError,
  getDraftProvider,
  getPublicDraftProvider,
} from "./resolve-provider";

const originalProvider = process.env.DRAFT_PROVIDER;
const originalKey = process.env.OPENAI_API_KEY;

afterEach(() => {
  if (originalProvider === undefined) delete process.env.DRAFT_PROVIDER;
  else process.env.DRAFT_PROVIDER = originalProvider;

  if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalKey;
});

describe("draft provider resolution", () => {
  it("uses the deterministic provider by default", () => {
    delete process.env.DRAFT_PROVIDER;
    expect(getDraftProvider().id).toBe("mock-v1");
    expect(getPublicDraftProvider()).toBe("mock");
  });

  it("fails closed when live drafting has no server-side key", () => {
    process.env.DRAFT_PROVIDER = "openai";
    delete process.env.OPENAI_API_KEY;
    expect(() => getDraftProvider()).toThrow(DraftProviderConfigurationError);
  });
});
