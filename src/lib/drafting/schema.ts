import { z } from "zod";

export const draftModes = [
  "first-touch",
  "re-engagement",
  "follow-up",
  "event-invite",
] as const;

export type DraftMode = (typeof draftModes)[number];

export const draftModeLabels: Record<DraftMode, string> = {
  "first-touch": "First touch",
  "re-engagement": "Re-engagement",
  "follow-up": "Meeting follow-up",
  "event-invite": "Event invitation",
};

export const draftInputSchema = z.object({
  organisationSlug: z.string().min(1).max(80),
  recipientFirstName: z.string().trim().min(1).max(40),
  recipientRole: z.string().trim().max(80).optional().default("Founder"),
  mode: z.enum(draftModes),
  angle: z.string().trim().min(10).max(500),
});

export const generatedDraftSchema = z.object({
  subject: z.string().min(1).max(120),
  body: z.string().min(1).max(2000),
});

export const draftOutputSchema = z.object({
  ...generatedDraftSchema.shape,
  provider: z.enum(["mock-v1", "openai"]),
  model: z.string().min(1).max(80),
  promptVersion: z.string().min(1).max(40),
  contextUsed: z.array(z.string()).min(1).max(8),
});

export type DraftInput = z.infer<typeof draftInputSchema>;
export type DraftOutput = z.infer<typeof draftOutputSchema>;
export type GeneratedDraft = z.infer<typeof generatedDraftSchema>;
