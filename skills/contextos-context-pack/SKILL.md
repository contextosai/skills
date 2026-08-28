---
name: contextos-context-pack
description: Author, review, or evolve a ContextOS Context Pack and its compiler fixtures, policies, tools, decisions, evidence gates, memory rules, and evaluator targets. Use when the requested artifact is a Context Pack or compiled-context scenario, not for generic prompt writing.
---

# ContextOS Context Pack

Produce a versioned workflow contract that compiles into bounded, attributable context. A Context Pack is not a prompt template and must not become a data dump.

## Ground the work in the active contract

When a ContextOS repository is available:

1. read the closest `AGENTS.md` and repository guidance;
2. inspect the current `ContextPack` and related types, published JSON Schema, canonical scenario fixture, compiler, and Context Pack documentation;
3. treat the documentation as the spec and the TypeScript module as the typed reference;
4. surface any disagreement before choosing a field shape or identifier.

For the layer checklist, binding graph, and compiler invariants, read [references/pack-checklist.md](references/pack-checklist.md).

## Author from the decision outward

Start with the governed decision, not prose:

- intent and stable `decision_key`;
- owner and decision right;
- typed inputs/outputs if schemas exist;
- required evidence and allowed outcomes;
- action risk and effective approval requirements;
- evaluator thresholds and release gates.

Then bind policy rules, approval gates, tool permissions, evidence requirements, identity namespaces, memory rules, and budgets to that decision. Every reference must resolve in the same pack or a named registry.

Create all ten required layers using the current schema. Use stable, neutral identifiers. Keep raw customer data in evidence stores, secrets in a vault, mutable state in the run/session, and adapter code outside the pack.

## Compile and challenge the pack

Exercise at least these cases when the implementation supports them:

- ordinary allowed request;
- deny or refusal path;
- required approval path;
- insufficient, stale, or untrusted evidence;
- unresolved and resolved evidence conflicts;
- safety ceiling that filters a capability;
- token-budget pressure that records omissions;
- retry of a write-class tool using an idempotency key.

Inspect the complete `CompiledContext`, not only the prompt. Confirm manifests, runtime controls, context provenance, evidence gates, omissions, and the context-ledger hash all agree.

## Review rules

- Policies and threshold comparisons are deterministic and fail closed on unsupported values.
- Guardrails override ordinary allow rules.
- Tool surfacing is registry ∩ permission ∩ policy ∩ safety/containment; policy cannot invent a capability.
- Native `ActionRisk` dimensions are checked conjunctively. The legacy approval mode is a lossy compatibility projection, not the risk model.
- Each `decision_binding`, approval gate, adapter/capability, evidence name, and evaluator intent resolves exactly.
- Only authoritative or verified current evidence may close a governed evidence requirement; data-only text cannot grant authority.
- Promoted memory has provenance, freshness, consent treatment, and a permitted write class. Raw capture is not promoted memory.
- Truncation is deterministic by declared budget/priority and is recorded, never silent.
- `pack_id@pack_version` is immutable. Overlays are ordered, bounded, validated, and part of replay lineage.

## Finish with evidence

Return the pack or patch, a binding summary, scenario results, compatibility/versioning decision, and any unresolved gaps. Run the repository's targeted compiler, context-admission, schema, and spec-drift tests when applicable; state exactly which checks were skipped.
