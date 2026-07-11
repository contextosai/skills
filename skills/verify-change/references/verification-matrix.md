# Verification matrix

## Claim ledger

| Claim or invariant | Risk if wrong | Failure mode | Best falsifying check | Result/evidence |
|---|---|---|---|---|
| | | | | |

Every material behavior claim needs at least one check that could fail if the
implementation were wrong. A test that cannot distinguish old and new behavior
does not verify the change.

## Evidence ladder

Choose evidence appropriate to the claim:

1. **Static:** parse, lint, type, schema, dependency, policy validation.
2. **Focused behavioral:** unit/component test at the changed invariant.
3. **Boundary:** integration/contract test across process, database, network,
   identity, serialization, or framework wiring.
4. **System/runtime:** smoke/E2E using the built artifact and realistic config.
5. **Operational:** rollout, rollback, migration rehearsal, load, fault, or
   security testing.

Higher is not universally better. Combine the lowest-cost levels that expose
the actual failure modes. Static success cannot prove runtime wiring; E2E
success may hide which invariant was exercised.

## Verdict

- **Supported:** all material claims have passing, relevant evidence and no
  unresolved high-risk contradiction.
- **Partially supported:** core behavior works, but named environments,
  boundaries, or risk paths remain unverified.
- **Not supported:** a material claim failed, relevant checks did not execute,
  or evidence contradicts the intended behavior.

## Residual-risk statement

`<surface>` remains unverified because `<constraint>`. Failure would cause
`<impact>`. The next useful check is `<specific command/environment/artifact>`.
