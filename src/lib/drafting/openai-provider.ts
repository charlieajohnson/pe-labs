import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { Organisation } from "@/data/organisations";
import type { DraftProvider } from "./provider";
import { type DraftInput, generatedDraftSchema } from "./schema";

const DEFAULT_MODEL = "gpt-5.5";
const PROMPT_VERSION = "outreach-v1";

const instructions = `You draft concise, credible private-equity relationship emails.

Return a subject and body in professional British English. Use only the supplied synthetic company facts and user-provided angle. Never invent familiarity, meetings, attachments, performance claims or market evidence. Keep the body between 80 and 160 words. Use short paragraphs, one clear reason for writing and one low-pressure call to action. Do not use em dashes. Sign off as Alex. Do not mention PE Labs, AI, prompts, scores or synthetic data.`;

function buildContext(input: DraftInput, organisation: Organisation) {
  return {
    task: {
      mode: input.mode,
      recipientFirstName: input.recipientFirstName,
      recipientRole: input.recipientRole,
      reasonToWrite: input.angle,
    },
    company: {
      name: organisation.name,
      city: organisation.city,
      country: organisation.country,
      sector: organisation.sector,
      subSector: organisation.subSector,
      businessModel: organisation.businessModel,
      ownership: organisation.ownership,
      revenueEurM: organisation.revenueEurM,
      revenueGrowthPct: organisation.revenueGrowthPct,
      recurringRevenuePct: organisation.recurringRevenuePct,
      internationalRevenuePct: organisation.internationalRevenuePct,
      description: organisation.description,
      signals: organisation.signals,
    },
  };
}

function sanitiseDraft(value: { subject: string; body: string }) {
  return {
    subject: value.subject.replaceAll("—", "-").trim(),
    body: value.body.replaceAll("—", "-").trim(),
  };
}

export function createOpenAIDraftProvider(apiKey: string): DraftProvider {
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
  const client = new OpenAI({ apiKey, maxRetries: 1, timeout: 20_000 });

  return {
    id: "openai",
    async generate(input, organisation) {
      const response = await client.responses.parse({
        model,
        instructions,
        input: JSON.stringify(buildContext(input, organisation)),
        reasoning: { effort: "low" },
        max_output_tokens: 700,
        text: {
          format: zodTextFormat(generatedDraftSchema, "pe_labs_email_draft"),
          verbosity: "low",
        },
      });

      if (!response.output_parsed) {
        throw new Error("The model returned no structured draft.");
      }

      return {
        ...sanitiseDraft(response.output_parsed),
        provider: "openai",
        model,
        promptVersion: PROMPT_VERSION,
        contextUsed: [
          `${organisation.recurringRevenuePct}% recurring revenue`,
          `${organisation.revenueGrowthPct}% revenue growth`,
          `${organisation.internationalRevenuePct}% international revenue`,
          organisation.signals[0],
        ],
      };
    },
  };
}

export const openAIPrompt = { instructions, version: PROMPT_VERSION };
