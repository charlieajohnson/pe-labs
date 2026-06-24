# Component Map

## Routes

- `src/app/page.tsx`: home, hero, connected workflow and featured companies
- `src/app/companies/page.tsx`: company intelligence universe
- `src/app/companies/[slug]/page.tsx`: company detail and initial screen
- `src/app/screening/page.tsx`: investment screening overview
- `src/app/outreach/page.tsx`: relationship drafting entry point

## Components

- `src/components/site-header.tsx`: sticky brand and module navigation
- `src/components/site-footer.tsx`: footer and synthetic boundary copy
- `src/components/brand-mark.tsx`: PE Labs mark
- `src/components/workflow-bar.tsx`: in-page module workflow
- `src/components/module-card.tsx`: home module cards
- `src/components/company-explorer.tsx`: company search and filter surface
- `src/components/organisation-card.tsx`: company card
- `src/components/screening-explorer.tsx`: ranked screening table
- `src/components/outreach-studio.tsx`: drafting desk and provider boundary
- `src/components/score-radar.tsx`: score visualisation
- `src/components/score-badge.tsx`: screening tier badge

## Data And Logic

- `src/data/organisations.ts`: synthetic company universe
- `src/lib/scoring.ts`: deterministic screening rubric
- `src/lib/drafting/*`: mock and optional live provider boundary
