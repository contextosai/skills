# Refactor ledger

## Boundary

- **Inside:** symbols/modules allowed to change structurally.
- **Outside:** callers, APIs, data, or behavior that must remain compatible.
- **Motivation:** concrete complexity, duplication, coupling, or change cost.

## Behavior contract

| Invariant | Current evidence | Risk | Before/after proof |
|---|---|---|---|
| | | | |

Include success, error, ordering, side-effect, and persistence behavior only
when externally observable.

## Transformation sequence

| Step | Mechanical or semantic | Reversible change | Checkpoint proof |
|---:|---|---|---|
| 1 | | | |

Keep semantic changes separate and explicitly approved.

## Hidden coupling checklist

- Dynamic imports, reflection, registries, dependency injection
- Serialization names and persisted representations
- Framework file/name conventions and generated code
- Mocks, fixtures, snapshots, monkeypatching, or subclass extension points
- Logs, metrics, events, CLI output, and error types consumed externally

## Completion

Confirm migrated callers, deleted transition paths, unchanged public surface,
passing proof, and any measured performance difference.
