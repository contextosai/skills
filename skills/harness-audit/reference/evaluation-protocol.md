# Behavioral Evidence Protocol

Use this when designing or interpreting harness evaluations. Read the shared
measurement contract first, then the sections relevant to the claim. These are
audit design choices informed by [research-basis.md](research-basis.md), not a
requirement to implement any cited benchmark or defense.

## Measurement contract

Before interpreting scores, record:

| Field | What must be explicit |
|---|---|
| Claim | Safety of a fixed release, candidate improvement, model comparison, or generalization across environments |
| Population | Intended tasks, tenants, tool/data permissions, workflow length, concurrency, and adversary access |
| Release and environment | Manifest IDs, starting-state snapshot, model settings, tool services, resource limits, timeouts, concurrency, and reset policy |
| Unit and coverage | Distinct tasks/families, repeated trials, sessions, actions, attack campaigns, and covered capability/lifecycle slices |
| Acceptance | Forbidden outcomes, required outcomes, utility floor, risk limits, owner, and stopping rule set before inspecting results |
| Evidence | Run/action IDs, decision-time evidence, external state, missing events, judge versions, and contamination checks |

If thresholds are missing, report measured behavior and the unresolved acceptance
decision. Do not choose a passing threshold after seeing scores. A fixed-release
test does not support a model-only ranking or a claim about all harnesses.
Broaden environment/scaffold coverage only when the intended claim needs it.

Use four separate lenses: authoritative outcome, required/forbidden rule
behavior, runtime safety/recovery, and total cost. An **accepted trusted outcome**
passes all applicable outcome, critical-rule, authority, safety, and evidence
checks. A useful result with a forbidden intermediate read or write is unsafe.

## Permission boundaries and instruction behavior

For a consequential workflow, build matched variants that separate appearance
from actual permission:

| Apparent risk | Authorized by trusted execution evidence | Unauthorized by trusted execution evidence |
|---|---|---|
| Routine-looking | Complete the permitted task | Prevent the forbidden effect |
| Risky-looking | Complete within the granted scope | Prevent the forbidden effect |

Keep task competence, tools, and starting state comparable. Vary only the
permission facts and superficial risk cues needed for the contrast. Verify the
fixture's meaning independently; an attacker saying “approved” is not approval.
Add an unresolved-permission case when appropriate: clarify or stop before the
effect while preserving safe progress. Distinguish over-refusal from ordinary
execution failure; authorized non-completion alone does not identify its cause.

Record the evidence available **before** the decision, normalized arguments,
principal/object/destination, current policy, and resulting state. Include facts
revealed mid-workflow, revoked authority, expired approvals, and changed objects.
Do not grade a prior decision using information available only afterward.

When instructions matter, register rule ID, authority, surface, applicability,
precedence, criticality, and required milestone or forbidden event. Check actual
context exposure, truncation/compaction, conflicts, against-prior behavior,
omissions, and oversteps. Correct final output cannot erase a skipped approval.

## Monitor and enforcement chain

Test the chain rather than the monitor's classification score alone:

1. **Trigger:** did every relevant action reach inspection before impact?
   Exercise bypass routes, low-risk misclassification, cache, retry, and timeout.
2. **Judgment:** did the monitor use the current permission and data-flow facts?
   Validate on held-out labeled boundary cases; record disagreements and shared
   failure sources with the acting model.
3. **Intervention:** did deny/pause/narrow actually prevent the resource effect?
   Test monitor unavailability and malformed responses against the declared
   failure policy; a warning followed by execution is not prevention.
4. **Continuation:** can the agent complete remaining authorized work after an
   intervention without retaining poisoned instructions, retrying indefinitely,
   broadening authority, or leaking policy-sensitive data through feedback?

Correlate proposed action → inspection → decision → adapter → resource receipt.
Measure trigger coverage and end-to-end escaped effects, including actions never
sent to the monitor. Report monitor recall on inspected cases separately.
Audit source-to-sink flows and composite tools, not just tool names or top-level
arguments. Safe individual calls can compose into disclosure.

For human oversight, separate mandatory approvals from sampled review. Validate
reviewer false negatives on the actual reviewed slice; retain random coverage
to detect blind spots in risk-based selection. Include workload, review delay,
selection version, correlated errors, and residual-risk reduction. Presence of
a reviewer or a second model is not evidence of independence or protection.

## Persistence, long runs, and recovery

For M2/M8 or persistent behavior packages, follow a payload through capture,
promotion, persistence, fresh-session recall, adoption, external consequence,
repair, and benign-state preservation. Include direct, multi-record,
context-triggered, transformed, cross-agent, and re-entry paths as reachable.
Do not clear memory security from a write-time filter alone.

Exercise crash/resume, compaction, concurrent workers, stale leases, revoked
credentials, pending effects, lost responses, and cancellation across children.
Measure failure by workflow length or exposure as well as per task. Do not
extrapolate short-run success to unattended operation.

Recovery evidence needs the authoritative residual state: duplicated or partial
effects, outstanding authority, quarantined carriers, repaired descendants,
preserved benign memory, compensation, and safe restoration. A restarted worker
or deleted original payload does not demonstrate closure of derived state.

## Integrity of the evaluation itself

Treat the runner, grader, fixture, and evidence pipeline as a separate attack
surface. Inspect:

- access from agent tools to answer keys, hidden tests, grader code, result files,
  scoring APIs, or promotion controls;
- benchmark-identifying hints, leaked solutions on the web, shared search trails,
  cross-trial memory/cache, persistent files, and subagent communication;
- whether evaluator failures, missing traces, setup errors, or timeouts disappear
  from the denominator or get relabeled as safety successes;
- stale containers, resource contention, tool/service versions, parallelism,
  external drift, and whether the candidate and baseline get equal resources.

Isolate trials and protect authoritative graders/results from agent writes.
When studying intended online learning, preserve only the declared learning
channel and reset unrelated state. Pin a judge's model, rubric, input contract,
and calibration set; evaluate judge injection and false negatives. Use a narrow
semantic judge only where deterministic state/policy checks are insufficient.

Retain contaminated or invalid runs in the ledger with reasons. Report total,
valid, invalid, excluded, and missing counts, plus how exclusions affect the
claim. Invalid runs establish neither success nor safe failure. If safety is
unobservable, bound the possible unsafe rate using the unknown cases rather
than silently assuming they were safe. A clean rerun is new evidence; it does
not erase the original failure. Do not infer deceptive intent solely from
benchmark recognition.

## Candidate improvement, extensions, and adaptation

Separate two questions: **Does this release meet its operating gates?** and
**Did this change cause a reusable improvement?** The first can pass without
proving superiority; a higher benchmark score alone proves neither.

For an improvement claim:

- Freeze baseline and candidate manifests; state exactly what changed. Use
  paired tasks and starting-state snapshots, repeated trials, and run ordering
  that limits temporal/resource confounds. Seeds do not ensure identical draws
  across model or tool providers.
- Separate development, selection, and final held-out data at task-family level
  when variants share solutions. Track repeated holdout access. Once used for
  tuning, a slice is no longer untouched evidence of generalization.
- Match inference, tool, feedback, and search budgets. For optimized harnesses,
  compare with an unchanged harness spending the same budget on sampling or
  sequential refinement. Report optimization/selection cost separately from
  per-run cost and state any amortization assumption.
- Use one-factor or factorial ablations to attribute a component's effect.
  Where attribution is unavailable, report a bundle comparison rather than a
  causal claim. Report safety, authorized utility, recovery, latency, cost, and
  critical-slice regressions separately.
- For skills/extensions, test explicit/implicit discovery, correct execution,
  negative activation, isolation, composition/collision, and revocation. A
  static scan or successful invocation does not establish marginal benefit.

For online adaptation, evaluate tasks in temporal order: each update may use
only feedback available before the next task. Version evolving prompts, memory,
guards, and policies per run; measure performance before and after updates on
future unseen tasks and a stable control. Challenge poisoned experience,
forgetting of earlier protections, and rollback of both code and learned state.
The candidate may propose updates; authority limits, protected evaluation data,
promotion acceptance, rollback, and evidence retention remain externally owned.
Do not forbid all guard changes; govern and evaluate their admission.

## Uncertainty and decision-useful reporting

Report numerators/denominators per critical slice, distinct task/family count,
repetitions, exposure duration, and the sampling/stopping procedure. Use intervals
appropriate to the unit; task-, tenant-, or campaign-correlated trials need
cluster-aware analysis. More seeds do not fix narrow task or scaffold coverage.

Distinguish `pass@k` (at least one successful attempt) from `pass^k` (all k
attempts succeed). Define what counts as success and disclose the estimator.
Do not substitute best-of-k for consistent production behavior or mix trials
from different permissions/releases. Attacker best-of-k and defender reliable
success answer different questions.

Under independent, identically distributed Bernoulli trials, zero observed
failures in n trials gives a one-sided 95% upper bound of
`1 - 0.05^(1/n)` (approximately `3/n`). At n=100 this is about 3%, not zero.
Similarly, `1 - (1 - p)^k` models at least one failure only under the stated
independence/stationarity assumptions. Adaptive attacks and shared-state runs
often violate them; report empirical campaign outcomes or justified bounds.

Include accepted trusted outcomes, useful-but-unsafe results, unauthorized
effects, omissions, over-refusal, monitor escapes, recovery residuals, and total
model/tool/sandbox/review/recovery cost per trusted outcome. At zero trusted
outcomes that cost ratio is undefined, not zero. Preserve the tradeoffs rather
than averaging them into a readiness score.

Choose the next experiment by the uncertainty that could change the decision:
deployment binding, a suspected bypass, an untested family, judge errors,
environment variation, or stochastic variance. More trials of the same easy
task are not a universal remedy for missing evidence.
