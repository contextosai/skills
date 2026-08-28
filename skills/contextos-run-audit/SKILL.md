---
name: contextos-run-audit
description: Audit a ContextOS proof-carrying run using RunContext, CompiledContext, ToolEnvelope, DecisionRecord, trace, scorecard, and ReplayPacket artifacts. Use for incident review, launch evidence, or record completeness; do not use for a whole-repository harness maturity audit.
---

# ContextOS Run Audit

Determine whether one governed claim or effect is actually supported by its execution artifacts. The audit rule is: no artifact, no pass.

## Set scope

Identify the run, decision, claimed outcome, target environment, and audit purpose. Accept equivalent artifact names in non-ContextOS stacks, but require equivalent evidence.

When the current ContextOS source is available, inspect the active types and published schemas before judging fields. Read [references/proof-checklist.md](references/proof-checklist.md) for artifact invariants, severity, and the report shape.

## Build the evidence ledger

Locate or request:

- request envelope and `RunContext`;
- pinned Context Pack and `CompiledContext`;
- policy decisions and approval events;
- tool call/result envelopes and external receipts;
- `DecisionRecord` and evaluator scorecard;
- correlated trace bundle;
- release tuple or equivalent lineage pins;
- replay packet/result and rollback, retraction, or compensation evidence.

Record an exact locator for every artifact: file and line, record ID, trace/span ID, content hash, or query result. A design document can explain intent but cannot prove runtime enforcement.

## Audit the causal chain

1. **Identity and tenancy:** principals, delegation, tenant, scopes, expiry, and trace IDs remain consistent; child authority and sub-budget only narrow the parent.
2. **Compiled context:** every block has provenance; retrieved/memory blocks are data-only; omissions and truncations are explicit; the context hash and pack reference are pinned.
3. **Evidence:** required evidence is resolvable, current, sufficiently trusted, in scope, and conflict-free. An unresolved required conflict blocks commit.
4. **Policy and approval:** matched rules, decision binding, effective risk, gate, approver, expiry, and frozen evidence agree with the eventual action.
5. **Tool effect:** capability and arguments were manifested, validated, authorized, object-scoped, idempotent where needed, and correlated to a result/receipt.
6. **Decision:** status and outcome are allowed by the active `DecisionSpec`; controls active at compile time survive into the record; scorecard thresholds are met.
7. **Postcondition and recovery:** external state was observed independently of the agent's claim, and rollback/retraction/compensation or explicit non-recoverability is recorded.
8. **Replay:** inputs and transcripts are pinned, live side effects are not repeated, and any mismatch is a typed diff rather than a vague failure.

## Verdicts

Score each applicable check:

- `PASS`: runtime artifact directly proves the invariant.
- `PARTIAL`: a real control exists but coverage or evidence is incomplete.
- `FAIL`: the invariant is absent, contradicted, or bypassed.
- `N/A`: the surface genuinely does not exist for this run, with rationale.

Do not convert missing artifacts to `N/A`. Treat unsupported, malformed, expired, or unverifiable values as fail-closed conditions.

## Report

Lead with the audit verdict and the highest-severity causal breaks. Include:

- scope and claimed outcome;
- artifact coverage table;
- findings ordered by severity, each with evidence and consequence;
- compact causal timeline from request to effect;
- replay/recovery status;
- dependency-ordered fix queue with expected proof;
- unknowns and checks not performed.

Do not mutate production state or replay live side effects during an audit unless the user explicitly authorizes a controlled environment.
