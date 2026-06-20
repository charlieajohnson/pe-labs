import type { Organisation } from "@/data/organisations";

export type ScreeningTier =
  | "High priority"
  | "Attractive"
  | "Watch"
  | "Low fit"
  | "Disqualified";

export type DimensionResult = {
  key: string;
  label: string;
  score: number;
  max: number;
  rationale: string;
};

export type GateResult = {
  key: string;
  label: string;
  pass: boolean;
  evidence: string;
};

export type ScreeningResult = {
  organisationSlug: string;
  score: number | null;
  rawScore: number;
  tier: ScreeningTier;
  recommendation: string;
  gates: GateResult[];
  dimensions: DimensionResult[];
};

const round = (value: number) => Math.round(value * 10) / 10;
const roundPoints = (value: number) => Math.round(value * 100) / 100;

function revenueQuality(organisation: Organisation): DimensionResult {
  const recurring = organisation.recurringRevenuePct;
  const score =
    recurring >= 85 ? 2 : recurring >= 70 ? 1.6 : recurring >= 50 ? 1.1 : 0.5;
  return {
    key: "revenue-quality",
    label: "Revenue quality",
    score,
    max: 2,
    rationale: `${recurring}% recurring revenue ${
      recurring >= 85
        ? "supports strong visibility."
        : recurring >= 70
          ? "provides a solid contracted base."
          : "leaves material exposure to transactional or services revenue."
    }`,
  };
}

function scale(organisation: Organisation): DimensionResult {
  const ebitda = organisation.ebitdaEurM;
  const score =
    ebitda >= 4 && ebitda <= 12
      ? 1.5
      : (ebitda >= 2 && ebitda < 4) || (ebitda > 12 && ebitda <= 16)
        ? 1.1
        : 0.6;
  return {
    key: "scale",
    label: "Scale",
    score,
    max: 1.5,
    rationale: `€${ebitda.toFixed(1)}m EBITDA ${
      score === 1.5
        ? "sits inside the illustrative platform range."
        : score === 1.1
          ? "is investable but near an edge of the preferred range."
          : "sits outside the preferred platform range."
    }`,
  };
}

function growth(organisation: Organisation): DimensionResult {
  const value = organisation.revenueGrowthPct;
  const score =
    value >= 25
      ? 1.5
      : value >= 15
        ? 1.2
        : value >= 8
          ? 0.8
          : value >= 4
            ? 0.4
            : 0.1;
  return {
    key: "growth",
    label: "Growth",
    score,
    max: 1.5,
    rationale: `${value}% revenue growth ${
      value >= 15
        ? "indicates meaningful organic momentum."
        : value >= 8
          ? "is healthy but requires a specific acceleration thesis."
          : "is below the level expected for a growth-led case."
    }`,
  };
}

function profitability(organisation: Organisation): DimensionResult {
  const margin = (organisation.ebitdaEurM / organisation.revenueEurM) * 100;
  const score =
    margin >= 25
      ? 1.5
      : margin >= 18
        ? 1.2
        : margin >= 12
          ? 0.8
          : margin >= 7
            ? 0.4
            : 0.1;
  return {
    key: "profitability",
    label: "Profitability",
    score,
    max: 1.5,
    rationale: `${margin.toFixed(0)}% EBITDA margin ${
      margin >= 18
        ? "shows attractive operating leverage."
        : margin >= 12
          ? "is credible with room for further leverage."
          : "requires a clear path to stronger unit economics."
    }`,
  };
}

function marketFocus(organisation: Organisation): DimensionResult {
  const score = roundPoints((organisation.marketFocus / 5) * 1.25);
  return {
    key: "market-focus",
    label: "Market focus",
    score,
    max: 1.25,
    rationale:
      organisation.marketFocus >= 5
        ? `A sharply defined ${organisation.subSector.toLowerCase()} niche supports specialist positioning.`
        : organisation.marketFocus >= 4
          ? `The ${organisation.subSector.toLowerCase()} focus is clear, with some adjacent exposure.`
          : "The addressable market is broad enough to weaken specialist positioning.",
  };
}

function productDepth(organisation: Organisation): DimensionResult {
  const score = roundPoints((organisation.productDepth / 5) * 1);
  return {
    key: "product-depth",
    label: "Product depth",
    score,
    max: 1,
    rationale:
      organisation.productDepth >= 5
        ? "Named workflow coverage and proprietary data indicate deep product value."
        : organisation.productDepth >= 4
          ? "The product appears embedded, although technical differentiation needs validation."
          : "Services or platform dependencies may limit defensibility.",
  };
}

function internationalisation(organisation: Organisation): DimensionResult {
  const value = organisation.internationalRevenuePct;
  const score =
    value >= 60 ? 0.75 : value >= 35 ? 0.55 : value >= 20 ? 0.35 : 0.15;
  return {
    key: "internationalisation",
    label: "International",
    score,
    max: 0.75,
    rationale: `${value}% international revenue ${
      value >= 60
        ? "demonstrates a repeatable cross-border proposition."
        : value >= 35
          ? "provides evidence of early cross-border repeatability."
          : "leaves geographic expansion largely unproven."
    }`,
  };
}

function dealability(organisation: Organisation): DimensionResult {
  const score =
    organisation.ownership === "Founder-owned" ||
    organisation.ownership === "Family-owned"
      ? 0.5
      : organisation.ownership === "Private equity-backed"
        ? 0.3
        : 0.15;
  return {
    key: "dealability",
    label: "Dealability",
    score,
    max: 0.5,
    rationale: `${organisation.ownership} status ${
      score === 0.5
        ? "could support flexible bilateral engagement."
        : score === 0.3
          ? "suggests a process-driven exit with valuation tension."
          : "introduces carve-out or strategic-owner complexity."
    }`,
  };
}

function getGates(organisation: Organisation): GateResult[] {
  return [
    {
      key: "b2b",
      label: "Primarily B2B",
      pass: organisation.b2b,
      evidence: organisation.b2b
        ? "Revenue is primarily generated from business customers."
        : "The company is primarily consumer-facing.",
    },
    {
      key: "ebitda-range",
      label: "€1m–€20m EBITDA",
      pass: organisation.ebitdaEurM >= 1 && organisation.ebitdaEurM <= 20,
      evidence: `Illustrative EBITDA is €${organisation.ebitdaEurM.toFixed(1)}m.`,
    },
    {
      key: "private",
      label: "Privately held",
      pass: !organisation.listed,
      evidence: organisation.listed
        ? "The company is publicly listed."
        : `${organisation.ownership} and not publicly listed.`,
    },
    {
      key: "europe",
      label: "European presence",
      pass: organisation.europeanPresence,
      evidence: `${organisation.city}, ${organisation.country}.`,
    },
    {
      key: "availability",
      label: "No recent change of control",
      pass: !organisation.recentlyAcquired,
      evidence: organisation.recentlyAcquired
        ? "A change of control occurred within the past three years."
        : "No recent change of control is recorded.",
    },
  ];
}

function tierFor(score: number): ScreeningTier {
  if (score >= 8) return "High priority";
  if (score >= 6.5) return "Attractive";
  if (score >= 5) return "Watch";
  return "Low fit";
}

export function screenOrganisation(
  organisation: Organisation,
): ScreeningResult {
  const gates = getGates(organisation);
  const dimensions = [
    revenueQuality(organisation),
    scale(organisation),
    growth(organisation),
    profitability(organisation),
    marketFocus(organisation),
    productDepth(organisation),
    internationalisation(organisation),
    dealability(organisation),
  ];
  const rawScore = round(
    dimensions.reduce((total, dimension) => total + dimension.score, 0),
  );
  const failed = gates.filter((gate) => !gate.pass);
  const tier = failed.length > 0 ? "Disqualified" : tierFor(rawScore);

  return {
    organisationSlug: organisation.slug,
    score: failed.length > 0 ? null : rawScore,
    rawScore,
    tier,
    recommendation:
      failed.length > 0
        ? `Stop at screening: ${failed.map((gate) => gate.label.toLowerCase()).join(", ")}.`
        : tier === "High priority"
          ? "Prioritise for thesis validation and management access."
          : tier === "Attractive"
            ? "Advance after resolving the two weakest dimensions."
            : tier === "Watch"
              ? "Monitor for a clearer growth, ownership or scale catalyst."
              : "Do not prioritise without a materially different thesis.",
    gates,
    dimensions,
  };
}

export function screenAll(organisations: Organisation[]) {
  return organisations
    .map((organisation) => ({
      organisation,
      result: screenOrganisation(organisation),
    }))
    .sort((a, b) => (b.result.score ?? -1) - (a.result.score ?? -1));
}

export function tierClass(tier: ScreeningTier) {
  return tier.toLowerCase().replaceAll(" ", "-");
}
