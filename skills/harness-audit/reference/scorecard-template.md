# Harness Audit Scorecard — <agent name>

**Target:** `<repo path>` · **Framework:** <detected> · **Date:** <YYYY-MM-DD>
**Audit mode:** <code+traces | code-only> · **Intended band:** <declared or inferred>
**Traces:** <happy-path trace ID/version> / <boundary trace ID/version> · or _none_

## Verdict

- **Evidenced maturity:** <Prototype | Controlled beta | Production | Regulated/high-risk>
- **Intended maturity:** <band> → **Gap:** <headline>
- **Launch decision:** <BLOCKED | BETA-CONSTRAINED | READY WITH OWNED GAPS>
- **Verdict confidence:** <High | Medium | Low> — <reason tied to evidence coverage>
- **Arithmetic:** <Pass> Pass + <Partial> Partial + <Fail> Fail + <N/A> N/A = **44**

> Lead with the highest-risk boundary-path finding and why it matters under
> production stress. Do not lead with a percentage.

## Scope and limitations

- **Surfaces mapped:** <model, context/memory, tools, policy/identity, output, telemetry, release>
- **Excluded or inaccessible:** <external services, CI, traces, generated code, none>
- **Assumptions:** <intended band, deployment mode, data/tool risk>
- **Evidence caveats:** <stale/unknown versions, sampling, code-only controls>

## Outcome rollup

| Outcome | Pass | Partial | Fail | N/A | Worst gap | Notes |
|---|---:|---:|---:|---:|---|---|
| Context-aware | | | | | | |
| Policy-governed | | | | | | |
| Tool-controlled | | | | | | |
| Validated | | | | | | |
| Observable | | | | | | |
| Reversible | | | | | | |
| Measurable | | | | | | |
| Continuously improving | | | | | | |
| **Total** | | | | | | **Must equal 44** |

## Control detail

Use `Score = Pass | Partial | Fail | N/A`. Cite safe `path:line` references for
enforcement and verification. For Fail, list where you looked. For Partial,
state both what exists and the missing link. `Evidence level = behavioral |
wiring | definition | assertion | none`.

| # | Outcome | Control | Score | Sev | Evidence level | Evidence or search performed |
|---:|---|---|---|---|---|---|
| 1 | Policy-governed | Agent charter | | P0 | | |
| 2 | Policy-governed | Autonomy boundary | | P0 | | |
| 3 | Observable | Intent taxonomy | | P1 | | |
| 4 | Reversible | Planner/executor split | | P0 | | |
| 5 | Context-aware | Context source registry | | P0 | | |
| 6 | Context-aware | Context compiler | | P0 | | |
| 7 | Context-aware | Grounding and evidence | | P1 | | |
| 8 | Context-aware | Context budget control | | P1 | | |
| 9 | Context-aware | Memory read policy | | P0 | | |
| 10 | Context-aware | Memory write policy | | P0 | | |
| 11 | Context-aware | Contradiction handling | | P1 | | |
| 12 | Policy-governed | Policy engine | | P0 | | |
| 13 | Policy-governed | Data classification | | P0 | | |
| 14 | Policy-governed | Privacy controls | | P0 | | |
| 15 | Tool-controlled | Tool manifest | | P0 | | |
| 16 | Tool-controlled | Tool gateway | | P0 | | |
| 17 | Tool-controlled | Tool risk class | | P0 | | |
| 18 | Tool-controlled | Identity and authorization | | P0 | | |
| 19 | Tool-controlled | Secret handling | | P0 | | |
| 20 | Tool-controlled | Network and sandbox controls | | P0 | | |
| 21 | Policy-governed | Human approval | | P0 | | |
| 22 | Measurable | Escalation path | | P1 | | |
| 23 | Reversible | State machine | | P1 | | |
| 24 | Reversible | Idempotency | | P0 | | |
| 25 | Reversible | Durable execution | | P1 | | |
| 26 | Validated | Offline evals | | P0 | | |
| 27 | Validated | Trajectory evals | | P1 | | |
| 28 | Validated | Online validation | | P0 | | |
| 29 | Validated | Red-team coverage | | P0 | | |
| 30 | Observable | Observability | | P0 | | |
| 31 | Observable | Standard telemetry | | P1 | | |
| 32 | Measurable | Cost and latency controls | | P1 | | |
| 33 | Measurable | Model/provider routing | | P1 | | |
| 34 | Measurable | Fallback behavior | | P1 | | |
| 35 | Reversible | Release tuple | | P0 | | |
| 36 | Reversible | Replayability | | P0 | | |
| 37 | Reversible | Rollback and compensation | | P0 | | |
| 38 | Continuously improving | Incident response | | P0 | | |
| 39 | Measurable | Business measurement | | P1 | | |
| 40 | Continuously improving | Continuous improvement | | P1 | | |
| 41 | Tool-controlled | Resource/object scope binding | | P0 | | |
| 42 | Policy-governed | Outbound disclosure control | | P0 | | |
| 43 | Policy-governed | Inter-agent communication policy | | P0 | | |
| 44 | Validated | Honest failure under tool error | | P1 | | |

## Blocking failures

List every P0 Fail/Partial. If allowing a controlled-beta exception, state each
compensating control and why the agent is read-only, isolated, and supervised.

1. **<# control>** — <why it blocks the intended band>

## Fix queue

Order by dependency and risk reduction, not control number. Keep the active
queue small; group gaps only when one implementation artifact closes them
together.

| Priority | Gap(s) | Sev | Concrete fix | Expected evidence that flips score | Owner | Read next |
|---:|---|---|---|---|---|---|
| 1 | | | | | _(assign)_ | <ContextOS doc> |

## Re-audit

- **First closure:** <one load-bearing fix to complete well>
- **Next trigger:** <before launch / after P0 closure / before risky tool rollout>
- **Runtime re-checks:** <trace-dependent controls, especially #30, #36, #44>
- **Access needed:** <evidence needed for Unverified controls>
- **N/A rationale:** <#43 single-agent, or none>
