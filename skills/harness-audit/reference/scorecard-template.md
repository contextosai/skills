# Harness Audit Scorecard — <agent name>

**Target:** `<repo path>` · **Framework:** <detected> · **Date:** <YYYY-MM-DD>
**Traces inspected:** <happy-path ref> / <boundary ref> · or _code-only (trace-dependent controls flagged for runtime re-audit)_

## Verdict

- **Evidenced maturity band:** <Prototype | Controlled beta | Production | Regulated/high-risk>
- **Claimed band:** <what the team operates at> → **Gap:** <one-line headline>
- **Launch decision:** <BLOCKED — N P0 failures | Beta-constrained — N P1 gaps | Ready, P1 gaps owned>

> One paragraph: the single most important thing this harness is missing and why
> it matters under production stress. Lead with the boundary-path finding.

## Outcome rollup

| Outcome | Pass | Partial | Fail | Worst severity | Notes |
|---|---:|---:|---:|---|---|
| Context-aware | | | | | |
| Policy-governed | | | | | |
| Tool-controlled | | | | | |
| Validated | | | | | |
| Observable | | | | | |
| Reversible | | | | | |
| Measurable | | | | | |
| Continuously improving | | | | | |

## Control detail

One row per scored control. Cite `path:line` for every Pass; say where you
looked for every Fail.

| # | Control | Score | Sev | Evidence (`path:line`) or "not found" |
|---:|---|---|---|---|
| 1 | Agent charter | | P0 | |
| … | … | | | |

## Blocking failures (P0 Fail/Partial)

List each P0 that blocks production, with the one-sentence reason it stops launch.

1. **<control>** — <why it blocks>

## Fix queue

Ordered by the dependency chain (most load-bearing first), not by control number.

| Priority | Gap | Sev | Fix | Expected evidence (flips to Pass) | Owner | Read next |
|---:|---|---|---|---|---|---|
| 1 | | | | | _(assign)_ | <ContextOS doc> |

## Re-audit

- **Fix one well, then re-run** — do not open 40 parallel workstreams.
- **Next audit trigger:** <before launch / after P0s closed / before high-risk tool rollout>
- **Trace-dependent controls to re-check at runtime:** <list, if this was a code-only audit>
