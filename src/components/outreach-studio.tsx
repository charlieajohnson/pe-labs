"use client";

import { Check, Clipboard, LoaderCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import type { Organisation } from "@/data/organisations";
import { moduleHref } from "@/lib/company-flow";
import {
  type DraftMode,
  type DraftOutput,
  draftModeLabels,
  draftModes,
} from "@/lib/drafting/schema";
import { formatEurMillions } from "@/lib/format";

type OutreachStudioProps = {
  organisations: Organisation[];
  initialSlug: string;
  providerMode: "mock" | "openai";
};

export function OutreachStudio({
  organisations,
  initialSlug,
  providerMode,
}: OutreachStudioProps) {
  const router = useRouter();
  const [organisationSlug, setOrganisationSlug] = useState(initialSlug);
  const [recipientFirstName, setRecipientFirstName] = useState("Sophie");
  const [recipientRole, setRecipientRole] = useState("Founder & CEO");
  const [mode, setMode] = useState<DraftMode>("first-touch");
  const [angle, setAngle] = useState(
    "how specialist software teams are building repeatable international growth without losing product focus",
  );
  const [draft, setDraft] = useState<DraftOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const organisation = useMemo(
    () =>
      organisations.find((item) => item.slug === organisationSlug) ??
      organisations[0],
    [organisationSlug, organisations],
  );

  function selectOrganisation(slug: string) {
    setOrganisationSlug(slug);
    setDraft(null);
    setCopied(false);
    router.replace(moduleHref("outreach", slug), { scroll: false });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organisationSlug,
          recipientFirstName,
          recipientRole,
          mode,
          angle,
        }),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error || "Draft generation failed.");
      setDraft(body as DraftOutput);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Draft generation failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyDraft() {
    if (!draft) return;
    await navigator.clipboard.writeText(
      `Subject: ${draft.subject}\n\n${draft.body}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="outreach-layout">
      <section className="panel form-panel">
        <div className="panel-title">
          <h2>Draft context</h2>
          <span className="provider-badge">
            {providerMode === "openai"
              ? "Live OpenAI provider · rate limited"
              : "Synthetic provider boundary"}
          </span>
        </div>

        <div className="context-card">
          <div>
            <strong>{organisation.name}</strong>
            <p>
              {organisation.subSector} · {organisation.city},{" "}
              {organisation.country}
            </p>
          </div>
          <div className="context-stats">
            <span>
              Revenue{" "}
              <strong>{formatEurMillions(organisation.revenueEurM)}</strong>
            </span>
            <span>
              Growth <strong>{organisation.revenueGrowthPct}%</strong>
            </span>
          </div>
          <div className="context-used context-card-chips">
            <span>{organisation.ownership}</span>
            <span>{organisation.businessModel}</span>
            <span>{organisation.region}</span>
            <span>{organisation.confidence} confidence</span>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="organisation">Organisation</label>
              <select
                id="organisation"
                value={organisationSlug}
                onChange={(event) => selectOrganisation(event.target.value)}
              >
                {organisations.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name} · {item.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="recipient-name">Recipient first name</label>
              <input
                id="recipient-name"
                value={recipientFirstName}
                onChange={(event) => setRecipientFirstName(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="recipient-role">Recipient role</label>
              <input
                id="recipient-role"
                value={recipientRole}
                onChange={(event) => setRecipientRole(event.target.value)}
              />
            </div>
            <div className="field full">
              <label htmlFor="mode">Draft type</label>
              <select
                id="mode"
                value={mode}
                onChange={(event) => setMode(event.target.value as DraftMode)}
              >
                {draftModes.map((item) => (
                  <option key={item} value={item}>
                    {draftModeLabels[item]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field full">
              <label htmlFor="angle">Reason to write</label>
              <textarea
                id="angle"
                value={angle}
                onChange={(event) => setAngle(event.target.value)}
                minLength={10}
                maxLength={500}
                required
              />
            </div>
          </div>
          {error ? (
            <p className="error-message" role="alert">
              {error}
            </p>
          ) : null}
          <div className="form-foot">
            <p>
              Alex is a fictional investment professional. This public demo uses
              only the synthetic context shown here.
            </p>
            <button type="submit" className="button" disabled={loading}>
              {loading ? (
                <LoaderCircle size={15} className="spin" />
              ) : (
                <Mail size={15} />
              )}
              {loading ? "Drafting..." : draft ? "Draft again" : "Create draft"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel draft-panel" aria-live="polite">
        <div className="panel-title">
          <h2>Draft output</h2>
          {draft ? (
            <span>{draftModeLabels[mode]}</span>
          ) : (
            <span>Ready when you are</span>
          )}
        </div>
        {draft ? (
          <div className="draft-content">
            <div className="draft-subject">Subject: {draft.subject}</div>
            <div className="draft-body">{draft.body}</div>
            <div className="draft-actions">
              <div>
                <span className="eyebrow">Context used</span>
                <div className="context-used">
                  {draft.contextUsed.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <p className="draft-provenance">
                  {draft.provider === "openai" ? draft.model : "Mock template"}
                  {" · "}
                  {draft.promptVersion}
                </p>
              </div>
              <button
                type="button"
                className="button secondary small"
                onClick={copyDraft}
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        ) : (
          <div className="draft-empty">
            <div>
              <Mail size={34} strokeWidth={1.3} />
              <strong>Build from useful context</strong>
              <p>
                Select a company, choose the relationship stage and give the
                draft one specific reason to exist.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
