# Proof-carrying run checklist

Use exact artifact locators for every verdict. Missing runtime proof is not repaired by an architecture document.

## Artifact coverage

| Artifact | Minimum proof |
|---|---|
| Request + `RunContext` | Request/run/trace/session/tenant IDs; user and agent identity; principal chain; intent; safety mode; complete budget |
| Context Pack | Immutable pack/version and compatibility; tenant/data classification; decision, policy, tools, memory, eval targets |
| `CompiledContext` | Provenance-bearing blocks; manifests; runtime controls; structured omissions; context ledger and hash |
| Policy decision | Decision ID, matched rules, normalized inputs, allow/deny/obligations, enforcement point |
| Approval | Gate, approver principal/role, decision, expiry, reason, frozen evidence/arguments hash |
| Tool call/result | Shared call ID, adapter/capability, schema/version, arguments, identity, risk/mode, policy decision, idempotency, status, mutations, receipt |
| `DecisionRecord` | Decision/status/outcome, actor, subjects, evidence, policy, approvals, tools, controls, scorecard, lineage, audit seal, replay handle |
| Trace bundle | Correlated spans for compile, model, policy, approvals, tools, evals, errors, finalization |
| Release lineage | Runtime, model route, prompt/skill, pack, policy, tool, evaluator, environment/sandbox versions and hashes |
| Replay + recovery | Pinned inputs/transcripts, side-effect policy, replay result/diff, rollback/retraction/compensation proof |

## Causal invariants

### Identity and authority

- Tenant and trace IDs agree end-to-end.
- Identity claims are valid for the run and tool time window.
- Delegation only narrows intents, capabilities, data ceiling, output schema, budget, and effect policy.
- Effective capability is the intersection of identity, delegation, manifest, policy, approval, sandbox, and object scope.
- Approval does not mint a capability or bypass containment.

### Context and evidence

- Every block identifies source refs, origin, integrity, freshness, instruction treatment, inclusion reason, and content hash.
- Data-only/untrusted block IDs agree with runtime admission controls.
- Privileged arguments derive from verified sources or explicit user intent.
- Required evidence is admitted, resolvable, current, trusted, correct-tenant, and not superseded.
- Evidence gates show required, satisfied, unresolved, rejected, conflicts, sufficiency, and `commit_allowed` consistently.
- Omissions and truncations have reason, estimated tokens, priority, and source refs.

### Policy, action, and decision

- Active rules and gates resolve to the pack and DecisionSpec.
- Native ActionRisk and any legacy approval projection agree with the capability and actual effect.
- Write retries are idempotent; target objects are authorized, not merely schema-valid.
- Tool results honestly represent errors/empty/junk results; no unsupported success claim exists.
- The decision outcome belongs to `allowed_outcomes`, and status is consistent with missing evidence, approvals, or execution state.
- Compile-time controls survive into `controls_active`/audit material.
- Policy, utility, safety, latency, and economics meet the active target or explain the block/escalation.

### Audit, replay, and recovery

- Canonical hash/signature/previous-hash verify when the implementation supports sealing.
- Replay uses recorded transcripts for effects and declares transcript-only, sandbox, or live-disallowed behavior.
- Replay differences are typed: evidence, policy, tool transcript, compiled context, scorecard, or tamper.
- The externally observed postcondition agrees with the agent claim.
- Recovery evidence points to a working rollback, retraction, or compensation path; irreversible effects have explicit acceptance and approval.

## Severity guide

- **P0:** unauthorized or unbounded effect, cross-tenant/data disclosure, missing deterministic policy/approval, fabricated success, no idempotency for harmful retry, unreconstructable release, no incident stop/recovery path.
- **P1:** incomplete evidence/provenance, missing trajectory validation, unjoinable telemetry, budget/fallback gaps, replay mismatch without immediate unsafe effect.
- **P2:** maintainability, clarity, or maturity gap with no current control bypass.

## Report skeleton

```markdown
# ContextOS run audit — <run or decision>

Verdict: PASS | CONDITIONAL | FAIL
Claimed outcome: ...
Observed effect: ...

## Artifact coverage
| Artifact | Status | Locator | Notes |

## Findings
| Severity | Invariant | Verdict | Evidence | Consequence |

## Causal timeline
request -> compile -> plan/policy -> approval -> tool -> decision -> postcondition -> replay

## Fix queue
| Order | Gap | Owner | Expected proof | Blocks |

## Unknowns and skipped checks
```
