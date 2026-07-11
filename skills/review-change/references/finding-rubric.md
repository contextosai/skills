# Review finding rubric

## Priority

- **P0 — stop immediately:** broad irreversible loss, active critical security
  exposure, or system-wide outage on a normal path.
- **P1 — block merge:** serious correctness/security/data issue on a realistic
  path; no safe workaround or high blast radius.
- **P2 — fix soon:** bounded regression with meaningful impact and a practical
  trigger; workaround or limited blast radius exists.
- **P3 — optional:** real but low-impact defect. Do not use for style, refactors,
  or vague hardening ideas.

Priority is consequence × reachability × blast radius, not reviewer certainty.
If confidence is too low to prove a defect, ask an open question instead.

## Boundary prompts

Use the smallest relevant subset:

| Surface | Invariants to check |
|---|---|
| API/schema | compatibility, defaults, validation order, unknown fields |
| State/data | atomicity, ownership, migration, cache coherence, idempotency |
| Auth/trust | identity propagation, object scope, deny path, egress |
| Concurrency | ordering, cancellation, shared mutation, duplicate work |
| Failure | typed errors, cleanup, retry safety, partial success, fallback honesty |
| Operations | bounded resources, telemetry, rollout, rollback, config loading |

## Finding structure

**[P#] <Imperative description of the required correction>** — Under
`<specific trigger>`, `<changed behavior>` violates `<invariant>`, causing
`<consequence>`. `<existing guard/test>` does not prevent it because `<reason>`.

Attach the comment to the smallest changed line range that causes the problem,
even when the consequence appears later.
