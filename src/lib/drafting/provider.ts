import type { Organisation } from "@/data/organisations";
import type { DraftInput, DraftOutput } from "./schema";

export interface DraftProvider {
  readonly id: DraftOutput["provider"];
  generate(input: DraftInput, organisation: Organisation): Promise<DraftOutput>;
}

function formatAngle(angle: string) {
  const cleaned = angle.trim().replace(/[.!?]+$/, "");
  return `${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
}

function firstTouch(
  input: DraftInput,
  organisation: Organisation,
): Pick<DraftOutput, "subject" | "body"> {
  const angle = formatAngle(input.angle);
  return {
    subject: `${organisation.name} / introduction`,
    body: `Hi ${input.recipientFirstName},\n\nI have been looking at ${organisation.subSector.toLowerCase()} businesses across Europe and came across ${organisation.name}. The combination of ${organisation.recurringRevenuePct}% recurring revenue and ${organisation.revenueGrowthPct}% growth stood out, particularly given the progress you appear to be making outside ${organisation.country}.\n\nI would be interested to compare notes on ${angle}. We spend a lot of time with specialist software businesses at this stage and would be happy to share what we are seeing elsewhere in the market.\n\nIf useful, would you be open to a short conversation in the next few weeks?\n\nBest,\nAlex`,
  };
}

function reEngagement(
  input: DraftInput,
  organisation: Organisation,
): Pick<DraftOutput, "subject" | "body"> {
  const angle = formatAngle(input.angle);
  return {
    subject: `${organisation.name} / catching up`,
    body: `Hi ${input.recipientFirstName},\n\nI noticed that ${organisation.signals[0].toLowerCase()} It seemed a good reason to get back in touch.\n\nWe remain interested in how ${organisation.name} is developing, particularly the international side of the business. I would welcome the chance to hear how you are thinking about ${angle} and to share a few relevant observations from the market.\n\nWould a brief catch-up be useful?\n\nBest,\nAlex`,
  };
}

function followUp(
  input: DraftInput,
  organisation: Organisation,
): Pick<DraftOutput, "subject" | "body"> {
  const angle = formatAngle(input.angle);
  return {
    subject: `${organisation.name} / follow-up`,
    body: `Hi ${input.recipientFirstName},\n\nThank you again for the conversation. I found the discussion on ${angle} particularly useful.\n\nThe combination of ${organisation.businessModel.toLowerCase()}, ${organisation.internationalRevenuePct}% international revenue and the depth of the ${organisation.subSector.toLowerCase()} proposition gives us plenty to think about. We will reflect on the points you raised and come back with a more considered view.\n\nIn the meantime, I have attached the market note we discussed.\n\nBest,\nAlex`,
  };
}

function eventInvite(
  input: DraftInput,
  organisation: Organisation,
): Pick<DraftOutput, "subject" | "body"> {
  const angle = formatAngle(input.angle);
  return {
    subject: `European software dinner / ${organisation.city}`,
    body: `Hello ${input.recipientFirstName},\n\nWe are bringing together a small group of founders and operators in ${organisation.city} next month for an informal dinner on scaling specialist software businesses across Europe.\n\nGiven ${organisation.name}'s work in ${organisation.subSector.toLowerCase()}, I thought the discussion on ${angle} could be relevant. The format is deliberately small, with no presentations and plenty of time for candid conversation.\n\nIf you are free, we would be delighted to include you.\n\nBest,\nAlex`,
  };
}

export const mockDraftProvider: DraftProvider = {
  id: "mock-v1",
  async generate(input, organisation) {
    const draft =
      input.mode === "first-touch"
        ? firstTouch(input, organisation)
        : input.mode === "re-engagement"
          ? reEngagement(input, organisation)
          : input.mode === "follow-up"
            ? followUp(input, organisation)
            : eventInvite(input, organisation);

    return {
      ...draft,
      provider: "mock-v1",
      model: "deterministic-template",
      promptVersion: "mock-v1",
      contextUsed: [
        `${organisation.recurringRevenuePct}% recurring revenue`,
        `${organisation.revenueGrowthPct}% revenue growth`,
        `${organisation.internationalRevenuePct}% international revenue`,
        organisation.signals[0],
      ],
    };
  },
};
