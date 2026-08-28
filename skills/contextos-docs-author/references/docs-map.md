# ContextOS docs publishing map

## Current source layout

| Concern | Current source |
|---|---|
| MDX content | `src/content/docs/**/*.mdx` |
| Loader/static params | `src/lib/mdx.ts` and `src/app/docs/[[...slug]]/page.tsx` |
| Navigation, command palette, prev/next | `src/lib/docs-nav.ts` |
| Desktop/mobile shells | `src/components/docs/DocsSidebar.tsx`, `MobileDocsNav.tsx`, and docs layout |
| MDX component registry | `src/app/docs/[[...slug]]/page.tsx` `components` map |
| Route redirects | `next.config.ts` |
| Diagrams | `src/components/diagrams/` plus renderer mapping/fallback |
| Canonical demo identifiers | `src/lib/contextos/scenario.ts` |

Current code imports `docsNav` into both sidebar components and uses it for adjacent navigation and owning sections. Some older repository prose says the layout hardcodes navigation; verify the live code and flag that guidance conflict instead of editing `layout.tsx` as a second nav source.

## Page classes

### Foundation

Required `##` headings for a new page:

1. Definition
2. Why it exists
3. How it works
4. Interfaces
5. Failure modes
6. Operational concerns
7. Evaluation metrics
8. Example
9. Common misconceptions

Additional sections may appear between them. Do not add a new test allowlist exception.

### Implementation

Cover the actual deployable/runtime contract:

- definition and boundary;
- fields/layers and semantic rules;
- binding and resolution order;
- validation and failure behavior;
- versioning/compatibility;
- full canonical example or runnable path;
- operational metrics and lifecycle.

### Reference

Prefer exact lookup tables, schemas, invariants, names, and links. Avoid duplicating long explanations owned by a foundation or implementation page.

### Tutorial

State prerequisites, build one artifact, run it, inspect observable output, challenge one failure path, and link to the canonical contract. Examples must compile or validate when the repo provides a harness.

### Use case

Map actors, intent, decisions, evidence, tools/effects, approval, failures, records, and business metrics without introducing client-specific identifiers.

## Frontmatter

Minimum:

```yaml
---
title: A precise page title
description: "One useful sentence describing the page promise."
---
```

Match nearby usage for optional fields:

- `status`
- `last_reviewed` (`YYYY-MM-DD`)
- `primitive.planes`, `caption`, `inputs`, `outputs`, `lifecycle`, `keyTypes`, `approvalModes`

Primitive metadata is rendered only when the required arrays are populated. Do not add decorative metadata that no consumer uses.

## Integration decisions

- File creation publishes a route through static params, but navigation requires an intentional `docsNav` entry.
- Existing visual fallback covers most pages. Add a slug-specific diagram mapping only when it materially improves comprehension and does not duplicate an inline visual.
- A custom JSX tag in MDX must be imported and added to the renderer component map.
- A route move/rename needs a redirect; preserve inbound links.
- On-ramp JSON examples in Context Pack/how-it-works/quickstart are policed against the canonical scenario.
- Schema lists and LLM discovery files are curated surfaces, not automatic mirrors of all docs.

## Validation matrix

| Change | Checks |
|---|---|
| Any docs content | `tests/docs-frontmatter.test.ts` |
| Foundation page | `tests/docs-templates.test.ts` |
| Canonical runtime examples/terms | `tests/spec-reference-drift.test.ts` |
| Loader/slug behavior | `tests/mdx-loader.test.ts` |
| Component/nav/renderer | typecheck, lint, build, route preview |
| Schema index | schema-surface/runtime-schemas tests |
| LLM discovery | llms-surface test and route output |

Also run `git diff --check`. State when a route preview, production build, or live-site comparison was not run.
