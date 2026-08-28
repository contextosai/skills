# Runtime contract surface map

Confirm this inventory against the active repository before changing it. The current public schema policy exposes one authoritative file per contract.

## Current schema bundle

| Contract | Public schema | Primary TypeScript surface | Primary docs |
|---|---|---|---|
| `RunContext` | `public/schemas/run-context.v1.schema.json` | `RunContext`, identity, budget types | API Contracts; Governance/Identity |
| `invokeAgent` | `invoke-agent.v1.schema.json` | `InvokeRequest` | API Contracts |
| `AgentDelegationEnvelope` | `agent-delegation.v1.schema.json` | `AgentDelegationEnvelope` | API Contracts; Orchestration |
| `ContextPack` | `context-pack.v2.schema.json` | `ContextPack` and ten layers | Context Pack; API Schemas |
| `CompiledContext` | `compiled-context.v1.schema.json` | compiled prompt/manifests/controls/budget/ledger | Context Pack; compiler reference |
| `ToolEnvelope` | `tool-envelope.v1.schema.json` | `ToolCallEnvelope`, `ToolResultEnvelope` | API Contracts; Adapter Mesh |
| `DecisionRecord` | `decision-record.v1.schema.json` | decision, approval, policy, scorecard, lineage/audit types | Decision Record/Catalog; API Contracts |
| `ReplayPacket` | `replay-packet.v1.schema.json` | `ReplayPacket` | Decision Record; Evaluation/Improvement |

`src/content/docs/reference/api-schemas.mdx` must link every current schema. `tests/schema-surface.test.ts` owns the exact public set; `tests/runtime-schemas.test.ts` verifies the runtime subset and IDs.

## Shared-definition parity

When a definition appears in multiple schemas, compare parsed JSON objects rather than visual similarity.

- `ActionRisk`: Context Pack declaration, CompiledContext manifest metadata, and ToolEnvelope execution request/effective risk.
- `ActionRiskEvaluation`: compiler output and any audit/execution consumer.
- `ContextAdmissionControls`, `EvidenceGate`, and `EvidenceConflictMarker`: CompiledContext and DecisionRecord.
- identity/principal/data-classification enums: every envelope that carries them.
- trace, lineage, status, and replay enums: their producers and downstream audit records.

If duplication is unavoidable in standalone schemas, tests should assert semantic identity.

## Flow invariants

```text
RunContext + invokeAgent
  -> ContextPack
  -> CompiledContext
  -> ToolCallEnvelope / ToolResultEnvelope
  -> DecisionRecord
  -> ReplayPacket
```

Across this flow preserve:

- request/run/trace/session/tenant correlation;
- user, agent, delegation, and principal-chain authority;
- pack, policy, model, tool, evaluator, and environment lineage;
- evidence references, admission, conflicts, sufficiency, and omissions;
- active refusal/escalation/approval/redaction controls;
- risk, policy decision, approval, object scope, idempotency, and receipts for effects;
- scorecard and decision status semantics;
- transcript-only/sandbox/live-disallowed replay behavior.

## Compatibility review

For every changed field record:

| Question | Why it matters |
|---|---|
| May an old producer omit it? | Determines `required` and canonical-producer behavior |
| May an old consumer ignore it safely? | Determines additive compatibility |
| What does absence mean? | Must be legacy/unknown, never silently trusted |
| Did meaning or unit change? | Same name can still be breaking |
| Did an enum narrow or a validation tighten? | Existing valid payloads may now fail |
| Does hashing/signing include it? | Replay equality and audit seals can change |
| Does it propagate to DecisionRecord/replay? | New controls must survive to audit |
| Is a migration/default deterministic? | Avoid environment- or time-dependent behavior |

## Test routing

- `tests/schema-surface.test.ts`: exact schema files and shared-def parity.
- `tests/runtime-schemas.test.ts`: parseability, draft IDs, docs routing.
- `tests/spec-reference-drift.test.ts`: canonical IDs, compiled output, type/docs taxonomy.
- `tests/compiler-hardening.test.ts`: fail-closed policy/risk/budget/tool behavior.
- `tests/context-admission.test.ts`: provenance, freshness, evidence gates, conflicts, omissions.
- Typecheck: producer/consumer compile compatibility.

Add behavioral tests at the first deterministic boundary that enforces the new invariant. Avoid tests that only search for new wording.
