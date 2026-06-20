import { getOrganisation } from "@/data/organisations";
import {
  DraftProviderConfigurationError,
  getDraftProvider,
} from "@/lib/drafting/resolve-provider";
import { draftInputSchema, draftOutputSchema } from "@/lib/drafting/schema";

export const maxDuration = 30;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_192) {
    return Response.json(
      { error: "Request payload is too large." },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = draftInputSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid draft request.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const organisation = getOrganisation(parsed.data.organisationSlug);
  if (!organisation) {
    return Response.json({ error: "Organisation not found." }, { status: 404 });
  }

  try {
    const output = await getDraftProvider().generate(parsed.data, organisation);
    return Response.json(draftOutputSchema.parse(output), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof DraftProviderConfigurationError) {
      return Response.json({ error: error.message }, { status: 503 });
    }

    console.error("Draft generation failed", error);
    return Response.json(
      { error: "Draft generation is temporarily unavailable." },
      { status: 502 },
    );
  }
}
