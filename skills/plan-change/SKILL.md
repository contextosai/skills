---
name: plan-change
description: Produce an implementation-ready plan for a software change by inspecting the actual repository, tracing affected execution paths, resolving material design decisions, and defining verification and rollout evidence. Use when the user asks for an implementation plan, technical approach, task breakdown, design proposal grounded in an existing codebase, or wants to know how a feature or fix should be built before editing begins. Do not use for generic product roadmaps or when the user has asked to implement immediately.
---

# Plan a Change

Create a plan another engineer can execute without rediscovering the system.

## Protocol

1. Read repository instructions and inspect worktree state. Preserve unrelated
   user changes.
2. Restate the desired observable behavior, non-goals, and acceptance criteria.
   Infer only low-risk details; surface choices that materially change scope,
   compatibility, data, security, or user experience.
3. Trace the current path from entry point to terminal effect. Locate runtime
   wiring, domain logic, state, tests, configuration, and operational controls.
4. Identify the behavioral delta and invariants that must remain true. Include
   error, retry, authorization, concurrency, and rollback paths only when
   touched.
5. Select the smallest coherent design. Explain important alternatives and why
   they lose in this repository; omit decorative option lists.
6. Order steps by dependency and proof. Each step must name concrete files or
   symbols, the logic change, its contract with adjacent code, and verification.
7. Include data/schema transition, compatibility, rollout, observability, and
   rollback steps when relevant. Never hide them under “update config.”
8. Re-read the plan against acceptance criteria. Ensure every criterion maps to
   implementation and verification, and every risky mutation has a recovery
   path.

## Plan quality bar

- Cite `path:line` evidence for the current architecture and chosen edit points.
- Separate facts, decisions, assumptions, and unresolved questions.
- Avoid steps like “implement feature,” “add tests,” or “handle errors.” State
  which behavior changes, where, and how it is proven.
- Keep task granularity aligned with independently verifiable outcomes, not
  arbitrary file-by-file edits.
- Do not include code unless a small interface sketch resolves ambiguity.

## Output

Use `references/implementation-plan.md`. Lead with the approach and key
decisions, then provide ordered implementation slices, verification, and
rollout. If one unresolved decision would produce substantially different
plans, stop and ask for it rather than pretending the branches are equivalent.
