---
name: contextos-docs-author
description: Create or revise ContextOS MDX documentation while preserving frontmatter, foundation templates, navigation, component registration, canonical examples, URL stability, and spec/reference alignment. Use for docs pages, not blog posts or contract implementation alone.
---

# ContextOS Docs Author

Publish a documentation page that fits the reader journey and does not create spec drift.

## Inspect the local publishing surface

Read the repository instructions, the nearest related docs, current navigation source, MDX loader/renderer, component registry, redirects, and relevant tests. Verify actual imports before following a possibly stale statement about where navigation is hardcoded; if repository guidance conflicts with code, report the conflict rather than editing both blindly.

Read [references/docs-map.md](references/docs-map.md) for page classes, coupled files, and validation routing.

## Choose the page contract

- Every docs MDX page has non-empty `title` and `description` frontmatter.
- A new foundation page uses the standard `##` sections: Definition, Why it exists, How it works, Interfaces, Failure modes, Operational concerns, Evaluation metrics, Example, Common misconceptions. Do not expand an allowlist to avoid the template.
- Implementation pages prioritize executable contracts, field semantics, invariants, lifecycle, validation, and examples.
- Reference pages act as routing tables or precise lookup surfaces.
- Tutorials produce one observable artifact at a time and keep identifiers aligned with the canonical scenario.

Optional metadata such as status, review date, primitive planes, lifecycle, inputs, outputs, and key types should match neighboring pages and real consumers.

## Write without changing the spec accidentally

- Use the five-plane vocabulary and canonical type names consistently.
- Search the foundations, implementation docs, TypeScript types, scenario fixture, and schemas before claiming something is absent or canonical.
- Link to the authoritative page instead of redefining a primitive in multiple places.
- Use canonical example identifiers from the current scenario for on-ramp pages.
- Mark proposals and implementation-specific extensions clearly.
- Treat ActionRisk as multidimensional and approval mode as compatibility vocabulary.
- Do not imply that retrieved text, memory, approval, or a model can widen technical authority.

## Integrate the page

- Add a discoverable nav entry in the current single source of truth when the page belongs in the reader journey.
- Register any custom MDX component in the renderer before using it.
- Prefer existing components and code-native diagrams. Do not add a bespoke component when prose, a table, Mermaid, or an existing diagram suffices.
- Add a redirect when moving or renaming a published route.
- Update LLM discovery or schema indexes only when the new page changes those curated surfaces.

## Verify

Run the frontmatter and docs-template tests for content changes. Run spec-reference drift tests when canonical examples or runtime terms change; MDX loader tests when rendering changes; typecheck/lint/build when TypeScript, components, navigation, or routes change. Preview the affected route when practical.

Report the page's role in the reader journey, integration points changed, and any preview/build/live check not performed.
