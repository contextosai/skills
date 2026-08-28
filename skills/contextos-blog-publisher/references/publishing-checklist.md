# ContextOS blog publishing checklist

Inspect `BLOG_PUBLISHING_GUIDELINES.internal.md`, current loaders/metadata code, category map, neighboring posts, and distribution tests before editing. Current code is authoritative when older guidance diverges.

## Article brief

Record:

- audience: engineer, PM, executive/leader, operator, security/compliance owner, or use-case buyer;
- job: mental model, checklist, build-along, failure analysis, use-case map, or research synthesis;
- central claim and evidence sources;
- durable artifact;
- canonical runtime primitive/docs link;
- distinct search/distribution intent;
- one category and 2–5 read-next destinations;
- visual concept and expected reader action.

Search existing titles, descriptions, tags, category assignments, and search-topic primaries before deciding the angle.

## Frontmatter

Required by distribution tests:

```yaml
---
title: "Specific, factual, promise-bearing title"
date: "YYYY-MM-DD"
author: "Piyush"
description: "Compact problem-and-promise sentence."
tags: ["Stable Audience/Topic", "Runtime Primitive", "Format", "Maturity", "Use Case"]
---
```

The description must be non-empty and no more than 360 characters; editorial guidance prefers roughly 170 or fewer. Do not use `ContextOS` as a universal tag.

Optional fields supported by the current metadata layer:

- `socialTitle`: sharper distribution headline; canonical article headline remains `title`.
- `seoTitle`: search-oriented metadata title without changing the canonical article title.
- `socialImage`: `/og/blog/<slug>.png`.
- `dateModified` or legacy `updated`.
- `audience`: `engineer`, `pm`, `exec`, or `operator`.
- `proficiencyLevel`: `Beginner`, `Intermediate`, or `Expert`.
- `status`: `current`, `needs-review`, or `archived`.
- `dependencies` or `testedWith`.
- `software`: structured software metadata only when the post genuinely centers a named project.

The loader derives safe defaults for several optional fields. Add explicit values when editorial intent differs from inference; do not add redundant metadata mechanically.

## Editorial checks

- Opening names the concrete production tension before introducing ContextOS.
- Claims about the spec match current canonical docs/types/schemas.
- Current external claims use primary sources and show inference as inference.
- The article contains a checklist, scorecard, template, code path, decision map, rollout, or architecture artifact.
- Links use the canonical docs for runtime terms.
- Conclusion adds a concrete operating implication.
- Final section is exactly `## What to read next` with 2–5 deliberate links.

## Category and discovery

- Add the slug to exactly one `CATEGORY_POSTS` entry in `src/lib/blog-categories.ts`.
- Do not rely on a fallback category for a new post.
- Add a category only when multiple posts justify it.
- Keep the curated reading path short and sequential.
- Do not assign two primary URLs to the same search topic.
- Confirm every read-next and curated slug exists.

## Social image gate

For a priority cover:

1. generate a systems-oriented editorial image, not a generic robot/chip/brain;
2. include exact verbatim headline and `contextosai.com`, with no extra pseudo-text;
3. keep all text high-contrast and inside generous crop-safe margins;
4. inspect exact spelling, punctuation, duplication, readability, and thumbnail hierarchy;
5. store a PNG at `public/og/blog/<slug>.png` sized exactly `1200x630` without distorting text;
6. set `socialImage` frontmatter and preserve the original generated asset unless deletion was requested.

Regenerate rather than accepting malformed embedded typography.

## Verification

Minimum:

```text
git diff --check
npm test -- --run tests/blog-distribution.test.ts   # adapt to the repo's actual Vitest invocation
```

Prefer the repository's known working targeted command, e.g. `npx vitest run tests/blog-distribution.test.ts`, when the package script does not forward flags as expected.

Additionally:

- run the full test suite for publishing packages;
- run typecheck when category/metadata/renderer code changes;
- run lint when TypeScript/React changes;
- inspect the post route and social preview when practical;
- verify every checked-in social image is exactly `1200x630`;
- state whether dev-server, browser, social-card, and live-site checks were performed.
