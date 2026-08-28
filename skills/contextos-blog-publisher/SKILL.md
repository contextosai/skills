---
name: contextos-blog-publisher
description: Create, revise, or package a ContextOS blog post with editorial positioning, accurate runtime terminology, frontmatter, category routing, read-next links, social metadata, and optional cover art. Use for blog publishing; not for canonical spec pages.
---

# ContextOS Blog Publisher

Ship a complete editorial package, not an isolated MDX body. A blog may explain or challenge the spec, but it must not silently redefine it.

## Build the article brief

Before drafting, identify:

- a specific audience and reader job;
- the concrete problem before the ContextOS framing;
- one durable artifact: checklist, scorecard, template, code path, decision map, rollout plan, or architecture diagram;
- canonical docs and related posts it should route to;
- evidence sources and any time-sensitive claims that need verification;
- a distinct category and intended next reader action.

Reject or reshape a topic that duplicates an existing post, blends conflicting terms, lacks an artifact, or has no clear audience.

Read [references/publishing-checklist.md](references/publishing-checklist.md) for metadata, category, visual, and verification requirements.

## Draft the post

- Open sharply with the production problem, not a generic statement that AI is changing.
- Keep the canonical page title factual and search-oriented. Use `socialTitle` for a sharper but defensible distribution hook.
- Link runtime primitives to their canonical docs; do not restate remembered field shapes when the current spec can be inspected.
- Separate sourced facts, repository observations, and the author's inference.
- End with `## What to read next` and 2–5 deliberate links spanning the same audience, deeper technical material, and the relevant primitive/use case.
- Avoid a generic conclusion that only says the concept matters.

If the post makes current product, research, legal, security, or market claims, verify them against primary sources and preserve citations. Do not browse merely to decorate stable ContextOS explanations.

## Package discovery and distribution

Add required frontmatter and deliberately assign the slug to exactly one blog category. Keep tags stable and useful; do not use `ContextOS` as a universal tag. Do not change the canonical title only to improve a social headline.

For a priority social cover, use the available image-generation workflow and inspect the result at full size and thumbnail size. The checked-in PNG must be exactly `1200x630`, use the exact headline and `contextosai.com`, keep text crop-safe, and contain no malformed or invented text. Preserve the original generated asset unless deletion was requested.

## Verify

Run the blog distribution tests and `git diff --check`. Run typecheck/lint when category, metadata, React, or rendering code changes; run the full tests in proportion to the change. Preview the post and social card when practical.

Report the article promise, category/read-next placement, sources checked, assets produced, and any browser/social/live verification skipped.
