---
name: refactor-safely
description: Restructure existing code while preserving externally observable behavior through explicit invariants, characterization evidence, small reversible steps, and continuous verification. Use when the user asks to refactor, simplify, extract, reorganize, modularize, deduplicate, split a component, improve architecture, or pay down technical debt without intentionally changing product behavior. Distinguish refactoring from feature work and stop scope drift from hiding inside structural edits.
---

# Refactor Safely

Change structure while keeping the behavior contract stable.

## Protocol

1. Define the refactor boundary and list observable behavior that must not
   change: API, side effects, ordering, errors, timing-sensitive semantics,
   persistence, telemetry, and extension points.
2. Trace callers and consumers across the boundary. Include reflection,
   registration, configuration, serialization, and framework conventions that
   symbol search may miss.
3. Assess existing proof. If behavior is weakly specified, add the smallest
   characterization tests around high-risk invariants before restructuring.
   Do not encode accidental behavior without evaluating whether callers rely on
   it.
4. Choose a seam that permits incremental movement. Prefer mechanical moves,
   then semantic cleanup; do not combine both when the diff would obscure
   behavior changes.
5. Execute one reversible transformation at a time. Keep old and new paths from
   diverging during transition; use adapters or delegation briefly when needed.
6. Verify after each meaningful step with focused checks, then run boundary and
   broader tests proportional to risk.
7. Compare before/after public surface, generated artifacts, state transitions,
   error behavior, and performance where relevant.
8. Remove transitional code only after all callers migrate and proof covers the
   new path. Search for stale imports, registrations, flags, and documentation.

## Guardrails

- Do not sneak bug fixes or feature changes into a behavior-preserving claim.
  Split and label intentional behavior changes.
- Do not equate compilation with behavioral equivalence.
- Do not introduce an abstraction before identifying at least one stable
  invariant it owns.
- Avoid wrappers that merely relocate complexity or duplicate sources of truth.
- Preserve user edits and repository conventions; prefer the smallest reviewable
  sequence over a sweeping rewrite.

## Output

For planning-only requests, use `references/refactor-ledger.md`. For
implementation requests, maintain the ledger while editing and report preserved
invariants, intentional deviations, checks run, and residual risks.
