# Schema evolution plan

## State transition

- **Current invariant:**
- **Target invariant:**
- **Producers/consumers:**
- **Coexistence window:**
- **Irreversible point:**

## Compatibility matrix

| Scenario | Supported? | Mechanism | Verification |
|---|---|---|---|
| Old reader + new data | | | |
| New reader + old data | | | |
| Mixed application versions | | | |
| Delayed/replayed event or record | | | |
| Code rollback after each phase | | | |

## Phases and gates

| Phase | Change | Entry criteria | Exit evidence | Stop/repair action |
|---|---|---|---|---|
| Expand | | | | |
| Migrate | | | | |
| Verify | | | | |
| Contract | | | | |

## Backfill controls

Specify batch key, size, idempotency, checkpoint, throttle, expected duration,
load SLOs, retry/dead-letter behavior, reconciliation query, and progress metric.

## Data proof

Define preflight profiling, row/count/checksum reconciliation, constraint
validation, application-level sampling, and post-contract monitoring.

## Recovery

Separate traffic/code rollback from data reversal. Name preserved source data,
repair tooling, decision thresholds, and owner for each phase.
