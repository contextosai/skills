---
name: contextos-contract-sync
description: Add or evolve ContextOS runtime contracts across TypeScript types, JSON Schemas, canonical examples, documentation, and drift tests. Use for RunContext, ContextPack, CompiledContext, ToolEnvelope, DecisionRecord, ReplayPacket, or delegation changes; not for prose-only edits.
---

# ContextOS Contract Sync

Keep every executable representation of a runtime contract semantically aligned and versioned. Do not treat successful JSON parsing as proof of compatibility.

## Inventory the affected surface

Read the repository instructions, then locate:

- TypeScript declaration and every producer/consumer;
- published JSON Schema and its `$defs` dependencies;
- canonical scenario/compiler or test harness;
- implementation and reference documentation;
- drift, schema-surface, runtime-schema, compiler, and admission tests.

Read [references/surface-map.md](references/surface-map.md) for the current contract bundle, parity invariants, and test routing. Confirm the active repository still matches that map before editing.

## Decide compatibility first

Classify the change:

- **Additive:** an optional field or compatible enum-free extension that legacy producers/consumers may omit.
- **Tightening:** stronger validation or newly required behavior; requires migration analysis even if the filename stays the same.
- **Breaking:** removed/renamed field, changed meaning, narrowed enum accepted by existing producers, or new required field; use a major contract version and explicit migration.

Separate schema compatibility from runtime trust. An additive field may remain optional for old payloads while the canonical producer always emits it; consumers must treat absence as legacy/unknown, never trusted.

## Change the contract coherently

1. Update the TypeScript semantic type and comments.
2. Update deterministic producers and consumers; unsupported values fail closed.
3. Update every published schema copy of shared definitions. Preserve draft 2020-12 and canonical `$id` conventions.
4. Update canonical examples from the reference scenario or actual compiler output.
5. Update the API schema index and explanatory docs.
6. Add or strengthen tests that compare semantic definitions and producer output; do not merely assert wording.
7. Remove superseded public schema versions only when the repository's single-authoritative-surface policy and migration plan require it. Never leave ambiguous duplicates.

## Check cross-contract invariants

- `trace_id`, tenant, identity, and lineage propagate across request, compiled context, tools, decision, and replay.
- delegation scopes and sub-budgets narrow the parent.
- `ActionRisk` has identical definitions where declared, compiled, and executed.
- compiled context admission/evidence-gate definitions remain identical in the DecisionRecord audit surface.
- tool call and result IDs correlate; policy decision and approval references resolve.
- evidence, omissions, controls, hashes, and release pins required for replay survive to the audit record.
- replay consumes recorded transcripts and does not repeat live effects.

## Validate

Run targeted schema-surface, runtime-schema, spec-drift, compiler, and context-admission tests as applicable, followed by typecheck and the full test suite. Parse every published schema and inspect the exact public schema file set.

Return a compatibility note, changed-surface matrix, migration implications, test evidence, and any consumer behavior that remains unverified.
