---
name: evolve-schema-safely
description: Design, implement, or review compatible and reversible database, event, API payload, configuration, or persisted-data schema evolution. Use for migrations, column or field changes, backfills, constraint changes, data transformations, serialization upgrades, zero-downtime deploys, or rollback planning where old and new code or data may coexist. Require explicit expand-migrate-contract sequencing, data invariants, operational bounds, and recovery evidence.
---

# Evolve a Schema Safely

Treat schema evolution as a distributed state transition, not a single DDL or
file-format edit.

## Protocol

1. Identify producers, consumers, storage, ownership, volume, update frequency,
   deployment topology, and the maximum period old/new versions can coexist.
2. State current and target invariants. Profile real data safely for nulls,
   duplicates, malformed values, cardinality, skew, and referential gaps; do not
   infer cleanliness from application types.
3. Classify compatibility for old reader/new writer, new reader/old writer,
   rollback, replay, and delayed consumers. Include caches, replicas, queues,
   exports, analytics, and offline jobs when touched.
4. Prefer **expand → migrate → verify → contract**:
   - expand with additive, backward-compatible shape;
   - deploy tolerant readers and controlled dual/single writers;
   - backfill in bounded, resumable, idempotent batches;
   - verify convergence and constraint readiness;
   - contract only after old versions and lagging data are gone.
5. Define transaction scope, locking, load limits, throttling, checkpointing,
   retry semantics, and behavior under partial failure.
6. Make rollback truthful. Distinguish code rollback, traffic rollback, forward
   repair, and data reversal. Destructive transformations may not be reversible
   without a preserved source or compensating artifact.
7. Rehearse on representative disposable data. Verify repeated execution,
   interruption/resume, mixed versions, boundary values, and rollback/repair.
8. Gate each phase with measurable entry/exit criteria and telemetry. Remove
   compatibility code only after evidence shows it is unused.

## Guardrails

- Never run a production migration, backfill, destructive statement, or live
  data repair without explicit authority.
- Do not add a non-null/unique/foreign-key constraint before proving existing
  and concurrent writes satisfy it.
- Do not use unbounded updates or assume transactional DDL/rollback semantics.
- Avoid dual writes without defined ordering, failure reconciliation, and a
  source of truth.
- Treat event and serialized schemas as durable APIs; historical data and
  delayed consumers are part of compatibility.

## Output

Use `references/migration-plan.md`. Lead with compatibility strategy and the
irreversible point, then phases, gates, recovery, and proof.
