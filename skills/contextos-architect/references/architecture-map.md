# Architecture map

Use this reference to turn one workflow into a concrete ContextOS design. Adapt artifact names to the target stack; preserve the control semantics.

## Start with the governed outcome

| Question | Minimum answer |
|---|---|
| Who initiates the run? | User/service/agent principal, tenant, delegation chain |
| What is the stable intent? | Versioned intent ID and fallback behavior |
| What decision is governed? | Decision key, owner, decision right, allowed outcomes |
| What proves it? | Required evidence names, integrity/freshness rules, conflict policy |
| What can change? | Capability, target object scope, ActionRisk, postcondition |
| What bounds execution? | Token, tool, latency, cost, retry, and session budgets |
| What is the failure posture? | Refuse, ask, degrade, retry, escalate, or abort |
| How is harm reversed? | Rollback, retraction, compensation, or explicit non-recoverability |

## Five-plane design questions

| Plane | Design questions | Minimum artifacts | Immediate failure signal |
|---|---|---|---|
| Intelligence | Which ontology, identity namespace, evidence sources, graph snapshots, and memories are eligible? Who owns freshness and access? | Ontology/version, source registry, identity model, snapshot rule, memory promotion policy | Undocumented retrieval, mutable identity, raw conversation summaries treated as durable truth |
| Context | How is eligible material selected, labeled, budgeted, omitted, and hashed per request? | Context Pack, compiler, block provenance, evidence gates, budget report, context ledger | Prompt string concatenation with no manifest or silent truncation |
| Decision | How are planning, precondition verification, execution, scoring, and consolidation bounded? | DecisionSpec, plan/checkpoints, critic verdicts, DecisionRecord | Model goes directly from prompt to effect or emits only free-form text for governed work |
| Action | Which declared capabilities are visible, authorized, object-scoped, validated, idempotent, and recoverable? | Tool manifest, gateway, call/result envelopes, credentials, receipt/recovery protocol | Model-selected arbitrary tool or direct adapter dispatch |
| Trust | Which deterministic rules, approvals, evals, traces, replay cases, rollout gates, and incident controls govern every other plane? | Policy bundle, approval records, scorecard, trace schema, ReplayPacket, release manifest, kill switch | Rules only in prompt, unjoinable logs, unpinned release, or no rollback owner |

## Canonical run flow

```text
invoke request + RunContext
  -> resolve pinned Context Pack
  -> compile -> CompiledContext
  -> plan -> critic.verify
  -> Tool Gateway calls -> ToolEnvelope receipts
  -> critic.score -> consolidate
  -> DecisionRecord
  -> ReplayPacket when sampled, failed, corrected, or promoted
```

Identity, tenant, trace, budgets, and release lineage must remain joinable across the entire flow.

## Thin-slice deliverables

A minimum useful slice has:

1. one intent and DecisionSpec;
2. one read capability and one governed write;
3. one policy bundle and one real approval or explicit bounded no-approval path;
4. one evidence-backed allowed case plus deny, missing-evidence, tool-error, and retry cases;
5. one CompiledContext, DecisionRecord, correlated trace, scorecard, and replay result;
6. one operator kill switch and recovery procedure.

Do not begin with a universal ontology, every workflow, or a large agent fleet.

## Rollout gates

| Stage | Runtime posture | Gate to advance |
|---|---|---|
| `0%_shadow` | Candidate runs in parallel with no outcome effect | Scorecard deltas within declared bounds for a sufficient replay/live sample |
| `1%_internal` | Internal users, full telemetry | Zero safety/policy regressions |
| `5%_low_risk` | Limited low-blast-radius intents | Corrections and escalations trend downward |
| `25%_monitored` | Broader cohort with tail sampling | Stable scorecards across cohorts and acceptable operational load |
| `100%` | Full rollout; prior tuple remains pinned | Clean monitored canary window |

Every stage has a tested kill switch that restores the prior complete release tuple, not only a previous prompt.

## Design output matrix

For each proposed component, record:

- plane and owner;
- input/output contract;
- deterministic enforcement point;
- persisted evidence;
- failure and fail-closed behavior;
- version and compatibility rule;
- evaluation metric;
- rollout and rollback mechanism.
