---
name: diagnose-root-cause
description: Diagnose software failures through reproduction, boundary localization, competing hypotheses, and discriminating experiments. Use when Codex is asked to investigate a bug, flaky test, crash, incorrect result, performance regression, production symptom, or unexplained behavior and should determine the cause before implementing a fix. Produce an evidence-backed causal explanation and verification plan; do not patch unless the user also asks for a fix.
---

# Root Cause Diagnosis

Find the earliest incorrect transition that explains the observed symptom.

## Protocol

1. Preserve the original evidence: exact command/request, input, environment,
   versions, timestamps, complete error, and frequency. Redact secrets.
2. Reproduce with the narrowest faithful path. If reproduction is unsafe or
   unavailable, use existing logs/tests and label the conclusion accordingly.
3. Write the expected and observed behavior in falsifiable terms. Separate the
   primary symptom from secondary errors produced during recovery or cleanup.
4. Map the path from input to symptom. At each boundary, identify the expected
   invariant and the observed value/state.
5. Maintain 2–5 competing hypotheses. For each, record supporting evidence,
   contradicting evidence, and one experiment whose outcomes distinguish it
   from the others.
6. Run the cheapest high-information experiment first. Prefer observation or a
   temporary diagnostic over production mutation. Change one variable at a
   time.
7. Localize the earliest divergence. Then explain the causal chain from that
   divergence to the user-visible symptom.
8. Search sibling paths and history only after localization. Use them to find
   blast radius and regression origin, not to replace causal evidence.
9. Propose the smallest fix boundary and a regression test that fails before
   the fix and passes after it. Do not implement unless requested.

## Guardrails

- Do not treat correlation, the last stack frame, or a recently changed line as
  root cause without a mechanism.
- Do not "debug" by making several speculative edits and seeing whether tests
  turn green.
- Do not overfit to one example; check the input partition around the failure.
- If evidence cannot distinguish causes, report the remaining hypotheses and
  the exact observation needed. Use confidence calibrated to evidence.
- For flaky/concurrent failures, model ordering, shared state, time, retries,
  and resource exhaustion explicitly.
- For performance failures, decompose wall time and resource consumption before
  optimizing code that merely appears hot.

## Output

Use `references/diagnosis-report.md`. Lead with the proven or most likely cause,
then the causal chain and decisive evidence. Keep exploration history only when
it helps another engineer verify the conclusion.
