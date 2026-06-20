import { afterEach, describe, expect, it } from "vitest";
import { POST } from "./route";

const originalProvider = process.env.DRAFT_PROVIDER;

afterEach(() => {
  if (originalProvider === undefined) delete process.env.DRAFT_PROVIDER;
  else process.env.DRAFT_PROVIDER = originalProvider;
});

describe("draft API", () => {
  it("returns schema-validated mock output by default", async () => {
    delete process.env.DRAFT_PROVIDER;
    const request = new Request("http://localhost/api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organisationSlug: "alder-pine-systems",
        recipientFirstName: "Sophie",
        recipientRole: "Founder & CEO",
        mode: "first-touch",
        angle: "international growth in specialist software",
      }),
    });

    const response = await POST(request);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.provider).toBe("mock-v1");
  });

  it("rejects oversized requests before parsing", async () => {
    const request = new Request("http://localhost/api/draft", {
      method: "POST",
      headers: { "content-length": "8193" },
      body: "{}",
    });

    const response = await POST(request);
    expect(response.status).toBe(413);
  });
});
