---
name: verify-change
description: Design and execute a risk-based verification strategy for a software change, bug fix, refactor, migration, configuration update, or release candidate. Use when Codex needs to prove that a change works, choose proportional tests, investigate whether validation is sufficient, or report what remains unverified. Trace claims to evidence across static checks, focused tests, integration boundaries, and runtime behavior instead of merely running the entire test suite.
---

# Change Verification

Produce the smallest evidence set that convincingly supports the change's
claims and protects its highest-risk invariants.

## Protocol

1. Identify the exact change range and read applicable repository instructions.
   Preserve unrelated user changes.
2. Write a claim ledger: each intended behavior, preserved invariant, affected
   boundary, likely failure mode, and the evidence that could falsify it. Use
   `references/verification-matrix.md`.
3. Classify risk by consequence, reachability, novelty, and reversibility. Raise
   rigor for authorization, money, destructive writes, migrations, concurrency,
   public APIs, and silent corruption.
4. Inspect existing test/build commands and CI configuration. Do not guess a
   command when the repository declares one.
5. Order checks for fast information:
   - syntax/type/static validation;
   - focused tests for changed logic and regression input;
   - integration tests across affected boundaries;
   - broader suite/build/package checks;
   - runtime smoke, migration, compatibility, performance, or security checks
     only when the risk model calls for them.
6. Before each expensive check, state which claim it tests. Do not run broad
   suites merely to create confidence theater.
7. Interpret results, not exit codes alone. Confirm tests were discovered,
   assertions exercised the changed path, expected failures did not get
   swallowed, snapshots/artifacts are meaningful, and warnings are relevant.
8. For a bug fix, demonstrate the regression test targets the original failure.
   Prefer fail-before/pass-after evidence when safely obtainable without
   discarding work; otherwise explain the causal link.
9. For migrations or irreversible operations, verify on disposable data and
   inspect forward, backward/rollback, partial-failure, and repeated-run paths.
10. Stop when every material claim has evidence or an explicit gap. Never claim
    "fully verified" from a partial environment.

## Guardrails

- Do not mutate production, publish, deploy, or exercise real side effects
  without explicit authority.
- Do not weaken assertions, delete failing tests, or regenerate snapshots solely
  to obtain green output.
- Distinguish product failures, test defects, environmental failures, and checks
  that never ran.
- Treat flaky success as inconclusive until the nondeterminism is bounded.
- Report skipped, inaccessible, or environment-dependent checks as gaps with
  their risk—not as passes.

## Output

Lead with the verification verdict: supported, partially supported, or not
supported. Summarize evidence by claim, then failures and residual risk. Include
exact commands and concise results so another engineer can reproduce the proof.
