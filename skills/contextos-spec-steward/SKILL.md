---
name: contextos-spec-steward
description: Change the ContextOS canonical specification and typed reference implementation without semantic drift, conflicting conventions, or unnecessary scope. Use for runtime-model, terminology, compiler, or cross-plane spec changes in the ContextOS repository; not for ordinary site styling.
---

# ContextOS Spec Steward

Make the smallest coherent change to the public spec and its typed reference. New patterns belong in the spec only after validation in a working system; label proposals instead of presenting unproven concepts as canonical.

## Establish current truth

1. Locate the repository root and read the closest `AGENTS.md` plus repository architecture guidance.
2. Read the primary spec page, adjacent foundation/implementation pages, current TypeScript types/compiler/scenario, published schemas, and relevant tests.
3. Search before claiming a primitive or control is absent. Include the foundations docs, implementation docs, typed reference, schemas, and—when the claim is about publication—the actual rendered/live surface if available.
4. If instructions, docs, code, or schemas disagree, stop and state the conflict. Do not silently blend conventions.

Read [references/change-map.md](references/change-map.md) for semantic touch sets and validation routing.

## Classify the change

Determine whether the request is:

- explanatory wording with no contract change;
- canonical terminology or taxonomy change;
- type/schema/envelope evolution;
- compiler behavior change;
- canonical scenario/example change;
- new operational pattern or proposed extension.

Write down the invariant being changed and the compatibility expectation before editing. For schema-level work, apply the same compatibility-first sequence across types, producers, schemas, examples, docs, and tests.

## Preserve ContextOS invariants

- The docs are the spec; `src/lib/contextos/` is the small deterministic typed reference, not a production runtime.
- Routing, policy, retry, budget, admission, risk, and threshold decisions are deterministic and fail closed. No random or clock-dependent branching.
- The five planes retain clear ownership; cross-cutting types are seams, not excuses to collapse boundaries.
- Native `ActionRisk` dimensions remain independent. `ApprovalMode` is only a compatibility projection.
- Retrieved evidence and memory are data-only; untrusted content never grants authority.
- Required evidence conflicts remain visible and block commit until resolved by an accountable rule or reviewer.
- External effects flow through typed tool envelopes, scoped identity, policy, approval where required, postcondition checks, and recoverability semantics.
- Tests enforce intent. Do not weaken them or widen allowlists to make new content pass.

## Edit surgically

Use the coupling map as a maximum coherent set, not a checklist of files to touch. Update only surfaces whose observable contract changes. Keep canonical IDs and examples sourced from the scenario fixture rather than copying stale variants.

When adding a concept, define:

- plane owner and boundary;
- inputs/outputs and typed seam;
- enforcement point;
- failure mode and fail-closed behavior;
- evidence, audit, and replay implications;
- compatibility/migration posture;
- evaluation and operational ownership.

Call out non-canonical extensions explicitly. Do not add a type solely because prose benefits from a convenient noun.

## Verify

Run the narrowest relevant tests first, then typecheck/lint/full tests/build in proportion to the surface. Inspect the diff for accidental terminology changes and verify published routes/assets when touched.

Report changed invariants, coupled surfaces actually updated, compatibility decision, checks run, and anything unverified.
