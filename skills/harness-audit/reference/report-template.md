# Harness Audit — <system / release>

Use the compact core for every audit. Expand the relevant appendices when their
evidence affects the decision. A release audit accounts for every core claim,
applicable capability, and lifecycle phase; a narrow review names its unassessed
remainder. Do not emit empty tables or imply that omitted surfaces passed.
For quick triage, compress the core into scope/limits, cited findings, and next
evidence or fixes. Detailed tables, owners, and re-audit fields are optional in
that short response; material findings and launch scope are not.

## Scope and conclusion

- **Target / release:** `<repository, manifest ID, deployment, binding gaps>`
- **Date / audit mode:** `<date; triage | release | change | incident>`
- **Evidence mode:** `<artifact-only | code-only | code+tests | code+tests+release-observation; tests inspected/supplied/run>`
- **Operating scope / tier:** `<users, data, reachable capabilities, T0–T3 or Undetermined; known lower bound>`
- **Conclusion:** `<supported finding or comparison; release decision if requested>`
- **Launch:** `<BLOCKED | CONDITIONAL | READY for exact scope; otherwise Launch not assessed>`
- **Confidence / limits:** `<High | Medium | Low; inspected, inaccessible, assumed, unassessed>`
- **Acceptance contract:** `<harm limits, required utility, thresholds, owner; unknowns>`
- **Critical path:** `<source/principal → influence/authority → boundary → effect>`
- **Decisive evidence or gap:** `<failed/passed obligation, counterevidence, exact gate>`
- **Next evidence:** `<experiment or access most likely to change the decision>`

A missing proof blocks unsupported clearance without proving a defect. Do not
invent a failing path when the evidence supports only uncertainty. Do not report
an aggregate readiness score.

## Findings and evidence ledger

| ID / claim / module / phase | Path, invariant, consequence | Status / E0–E4 / confidence | Evidence and counterevidence | Scope / gap |
|---|---|---|---|---|
| F-01 | | | | |

Use `Effective`, `Partially effective`, `Ineffective`, `Not verified`, or `N/A`
with reachability proof. Record unassessed claims separately, not as N/A.
Evidence references should resolve to file/line, immutable config, test,
trajectory, decision, resource receipt, or recovery record. Each finding needs
an earliest feasible cut point and proposed mechanism, even if it is outside
the active fix queue. Preserve every material finding.

## Closure plan

| Priority / finding IDs | Boundary and concrete fix | Evidence that changes judgment | Owner / dependency | Re-audit trigger |
|---|---|---|---|---|
| 1 | | | _(assign)_ | |

Keep at most five active fixes; retain other findings in the ledger. State
residual risk, decision expiry, rollback/revocation triggers, and which evidence
must be refreshed after a release change.

## Appendix A — Release, authority, and coverage

Use for release audits and for relevant paths in other modes.

| Surface | Release ID / runtime binding | Evidence / drift / uncertainty |
|---|---|---|
| Model/router; harness/worker | | |
| Instructions; skills/plugins/hooks/MCP | | |
| Tools/adapters; identities/policy/approval | | |
| Context/retrieval; memory/checkpoints/schedules | | |
| Sandbox/egress; monitors/graders/traces | | |
| Recovery; deployment | | |

Expand combined rows when components have distinct bindings or gaps. Describe
material influence edges with principal, purpose, tenant/object/destination,
trust, persistence, and enforcement. Record composed authority, bypass routes,
parent/child/resume scope, and revocation closure with residual active work.

| Claim C1–C8 / module M1–M9 | Assessed / N/A proof / unassessed | Status / evidence / confidence | Critical scenarios / gaps |
|---|---|---|---|
| | | | |

| Lifecycle phase | Reachable surface / invariant / cut point | Scenario, oracle, evidence | Result / gap |
|---|---|---|---|
| L1 Configuration | | | |
| L2 Extension | | | |
| L3 Runtime | | | |
| L4 Persistence | | | |
| L5 Effects | | | |
| L6 Recovery/promotion | | | |

Include a cross-phase chain for release clearance. Distinguish recognition,
prevention, persistence, effect, detection, containment, repair, and restoration.
For instruction-sensitive paths, add the rule's authority, source surface,
applicability, precedence, exposure, and required/forbidden milestone.

## Appendix B — Behavioral evidence

Use when tests/evals are available or proposed. Mark proposed scenarios **Not
run**; do not put expected outcomes in the observed-result column.

| Scenario / claim | Initial state / release | Intervention / permission facts | Required invariant / recovery | Oracle / actual result / evidence |
|---|---|---|---|---|
| | | | | |

- **Measurement contract:** `<claim, workload, task families, resources, stopping rule>`
- **Counts:** `<distinct tasks/families; attempted, valid, invalid, excluded, missing trials>`
- **Integrity:** `<grader protections, dataset exposure, state resets, contamination, judge calibration>`
- **Permission boundary:** `<routine/risky appearance × authorized/unauthorized; ambiguous cases>`
- **Monitor chain:** `<trigger coverage, judgment, enforcement, safe continuation, escaped effects>`
- **Persistence/recovery:** `<fresh-session adoption, compaction/resume, repair, benign preservation, residuals>`
- **Oversight:** `<mandatory/sampled review, false negatives, selection bias, risk reduction>`
- **Trace quality:** `<native/portable/spans/decision correlation and conversion loss>`

| Critical slice | Numerator / denominator / unknowns | Trusted utility / unsafe effects / over-refusal | Recovery / cost | Interval and assumptions |
|---|---|---|---|---|
| | | | | |

Define success, `pass@k` versus `pass^k`, exposure, dependence, and any repeated
attacker opportunity. Zero observed failures does not establish zero risk.

## Appendix C — Change or adaptive harness evaluation

- **Baseline → candidate:** `<manifest diff and affected assurance claims>`
- **Comparison:** `<paired fixtures/trials, matched resource and feedback budgets>`
- **Generalization:** `<development/selection/test split, family overlap, holdout access>`
- **Baselines and cost:** `<unchanged harness with equal search budget; optimization and run cost>`
- **Attribution:** `<ablation/factorial evidence or explicit bundle-only comparison>`
- **Tradeoffs:** `<authorized utility, safety, latency, recovery, cost, critical regressions>`
- **Online updates:** `<temporal feedback cutoff, future unseen tasks, learned-state versions>`
- **Admission:** `<external gate owner, canary scope, rollback of code and learned state>`

Separate candidate superiority from meeting deployment requirements. An
uncontrolled score gain is inconclusive evidence of improvement.

## Appendix D — Effects, incident recovery, and launch gates

For each critical effect class, join principal/purpose, release, source/rules,
authority, applicable approval, normalized request, idempotency/precondition,
external mutation/version/postcondition, pending/partial state, and compensation.
Link the complete proof packet; do not expose secrets or sensitive arguments.

For incidents, include the observed timeline, earliest failed boundary,
alternative explanations, propagation/derived state, active authority, evidence
preservation, repair/benign preservation, and tested restoration. Label causal
hypotheses separately from demonstrated links.

| Required launch gate | Evidence and result | Blocking? | Constraint / owner / expiry / closure |
|---|---|---|---|
| | | | |

Use this gate table only for a release decision. CONDITIONAL requires enforced
scope and evidence, including a separately assessed commissioning scope if used.
Record the accepted criteria and re-run scenarios. Do not imply that shadow
traffic proves external effects or that a narrow canary clears broad rollout.
