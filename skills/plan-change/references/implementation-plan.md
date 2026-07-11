# Implementation plan template

## Outcome

State the externally observable change, non-goals, and acceptance criteria.

## Current path and change seam

`input → entry → orchestration → domain/state → side effect/output`

Cite relevant `path:line` locations. Name the smallest coherent seam and the
invariants that cross it.

## Decisions

| Decision | Choice | Evidence/rationale | Rejected alternative |
|---|---|---|---|
| | | | |

Include only consequential decisions.

## Implementation slices

For each ordered slice:

1. **Outcome:** independently observable behavior completed.
2. **Touch points:** files, symbols, schemas, configuration.
3. **Logic:** exact contract or state transition to add/change.
4. **Failure/compatibility:** relevant deny, retry, old/new, or rollback path.
5. **Proof:** focused checks and expected evidence.

## Rollout and recovery

Describe migration order, feature flags, telemetry, canary criteria, rollback,
and cleanup only where the change requires them.

## Open questions

List only questions that block execution or materially alter the design. Name
the evidence needed to close each one.
