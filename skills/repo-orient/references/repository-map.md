# Repository map template

## Purpose and shape

One paragraph: what runs, what it serves, and the verified repository shape.

## Execution path

`external input → entry point → orchestration → domain logic → state/I/O → output`

Annotate each hop with `path:line`. Include configuration that selects the path.

## Concern map

| Concern | Definition | Runtime wiring | Tests/verification | Operational surface |
|---|---|---|---|---|
| <requested concern> | | | | |

## Boundaries and invariants

- **Public/API:** compatibility constraints.
- **Data/state:** ownership, transactions, migrations, caches.
- **Trust:** authentication, authorization, secret/data boundaries.
- **Runtime:** process, queue, network, retry, concurrency boundaries.
- **Release:** build artifacts, flags, deployment units, rollback.

Include only boundaries touched by the concern.

## Best change location

Name the smallest coherent change surface and why adjacent alternatives are
less correct. Identify tests and documentation that should move with it.

## Unknowns

List material unknowns, the evidence already checked, and the cheapest next
inspection that would resolve each one.
