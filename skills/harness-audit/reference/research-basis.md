# Research Basis

Reviewed **2026-08-28**. This note records why the audit is a release-specific,
lifecycle assurance case rather than a flat compliance checklist. It also
separates research evidence from ContextOS's engineering synthesis.

Most August 2026 sources below are preprints, public implementations, or
standards work. Treat their mechanisms as useful evaluation designs, not settled
universal thresholds or proof that a product is safe.

## ContextOS synthesis adopted in this revision

The rewrite incorporates the following ContextOS field arguments because each
changes an auditable artifact, scenario, oracle, metric, or launch gate:

- [Harness Engineering in August 2026](https://contextosai.com/blog/harness-engineering-state-of-field-august-2026)
  treats the deployed system—not the model—as the release unit and joins
  release manifests, lifecycle security, skills, portable trajectories,
  delegated authority, effects, and recovery.
- [The Harness Engineering Roadmap for 2026–27](https://contextosai.com/blog/harness-engineering-roadmap-2026-2027)
  specifies the proof-carrying-run direction: complete manifests, layered
  traces, attenuated delegation, postcondition-bearing effect receipts,
  semantic recovery states, causal improvement, and an immutable outer loop.
- [HarnessRisk in Practice](https://contextosai.com/blog/harness-lifecycle-security-harnessrisk)
  turns configuration, extension, runtime, persistence, action, and recovery
  into a cross-phase security matrix and separates recognition from prevention.
- [Skill Lift](https://contextosai.com/blog/agent-skill-lift-continuous-evaluation)
  treats skills and behavior packages as executable release artifacts requiring
  structural, supply-chain, discovery, execution, and paired marginal-value
  evidence.
- [Harness-IF and A2E](https://contextosai.com/blog/harness-instruction-following-evals-harness-if-a2e)
  makes instruction surfaces, rule applicability, against-prior behavior,
  omissions, conflicts, trajectory evidence, and economics first-class eval
  concerns.
- [The AI Agent Access Graph](https://contextosai.com/blog/ai-agent-access-graph-ciso-dashboard)
  reframes privilege as source-to-sink reachability through composite authority,
  adds drift baselines, and treats a kill switch as graph closure rather than a
  registry flag.
- [Persistent Memory Poisoning](https://contextosai.com/blog/persistent-memory-poisoning-lifecycle)
  operationalizes memory security as capture, promotion, recall, effect, and
  selective-repair closure with transformation lineage and authority
  non-escalation.
- [Human Oversight for Agent Fleets](https://contextosai.com/blog/human-oversight-agent-fleets-audit-budget)
  requires mandatory gates, random coverage, reviewer-quality measurement, and
  demonstrated residual-risk reduction instead of review-throughput claims.
- [Agent Identity Is the New Trust Boundary](https://contextosai.com/blog/agent-identity-trust-boundary)
  separates agent subject, workload proof, delegated principal, short-lived
  run authority, audience, lifecycle, and audit evidence across MCP/A2A seams.

These articles are engineering interpretations. The sections below tie the
adopted practices to primary research and specifications where available.

## Methodological findings adopted

### The complete evaluated runtime bundle is the release unit

Behavior changes with the harness, instruction placement, skill availability,
tool surface, sandbox, evaluator, and state—not only the model.

- [The Scaffold Effect](https://arxiv.org/abs/2607.22585) studies harness choice
  as a hidden variable in coding-agent evaluation.
- [A2E](https://arxiv.org/abs/2608.07346) separates tasks, harness bindings,
  runners, instrumentation, traces, and multidimensional metrics, and observes
  task-dependent model–harness variation.
- [Harness-IF](https://arxiv.org/abs/2608.11727) shows that operational rules
  arrive through multiple instruction surfaces and that measured compliance
  varies by rule and surface.
- [ACES](https://arxiv.org/abs/2608.20614) holds model, harness, workspace, and
  scorer fixed while changing skill availability, demonstrating why a skill is
  part of the evaluated release tuple.

**Audit consequence:** reconstruct a content-addressed manifest for model and
routing, harness, instructions, skills/extensions, tools, identity/policy,
context/retrieval, memory, sandbox, trace/evaluator, recovery, and deployment.
Bind every scenario, trace, effect, and launch claim to that manifest. Treat an
untracked change as drift and re-evaluation scope, not a documentation nit.

### Audit trajectories, rules, external state, and economics independently

Final-answer correctness cannot reveal an unsafe intermediate access, a missing
approval, an omitted required step, a secret in a tool argument, or a false
success after a partial effect.

- [Auditing Agent Harness Safety](https://arxiv.org/abs/2605.14271) evaluates
  full trajectories across boundary compliance, execution fidelity, and system
  stability; it reports that completion and safe execution can diverge and that
  violations accumulate with trajectory length.
- [Harness-IF](https://arxiv.org/abs/2608.11727) evaluates rules individually
  from execution evidence, introduces Against-Prior Accuracy, and reports
  substantial omission and workflow/output-control failure mass.
- [A2E](https://arxiv.org/abs/2608.07346) adds efficiency, tool use, planning,
  and recovery dimensions beyond correctness.
- [τ-bench](https://arxiv.org/abs/2406.12045) checks multi-turn tool use against
  domain policy and authoritative database state, motivating state oracles and
  repeated-run consistency.

**Audit consequence:** use four independent lenses—outcome, rule, runtime, and
economics. Maintain a rule registry with owner, authority, surface,
applicability, conflict/precedence, criticality, expected milestone/forbidden
event, and oracle. Test against-prior rules, omissions, oversteps, and conflicts.
Do not allow final tests or polished prose to erase a trajectory violation.

### Portable trajectories complement native traces; they do not replace them

Different evidence layers serve different purposes.

- The [Agent Trajectory Interchange Format RFC](https://github.com/harbor-framework/harbor/blob/main/rfcs/0001-trajectory-format.md)
  defines a portable representation for ordered agent steps, tool calls,
  observations, metrics, continuations, and nested trajectories.
- [A2E](https://arxiv.org/abs/2608.07346) uses instrumentation and standardized
  traces to compare harnesses.
- [OpenTelemetry](https://opentelemetry.io/docs/specs/semconv/gen-ai/) supplies
  operational semantic conventions for inference and agent spans.

**Audit consequence:** correlate four layers rather than force one schema to do
all jobs: native runtime events for fidelity and recovery; portable trajectories
for cross-harness evaluation; observability spans for operations; and a decision
record for identity, purpose, policy, evidence, approval, effect, and verdict.
Record conversion loss, especially for subagents, state changes, denials, and
effect receipts.

### Agent security spans the operational lifecycle

Runtime prompt injection is one phase of a longer attack chain.

- [HarnessRisk](https://arxiv.org/abs/2608.17597) organizes 128 sandboxed cases
  across Harness Configuration, Capability Extension, Runtime Operation, State
  Persistence, Action Control, and Incident Recovery. It measures utility,
  attack success, persistence, and detection separately.
- The reported configurations sometimes recognized risk while still executing
  unsafe behavior, so detection language is not a prevention oracle.
- [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
  covers goal hijacking, tool misuse, identity/privilege abuse, supply-chain
  risk, unexpected execution, memory poisoning, and cascading failure.

**Audit consequence:** build a six-phase matrix, seed a scenario in every
applicable phase, and include at least one cross-phase chain. Record recognition,
prevention, persistence, externalization, detection, containment, repair, and
recovery as separate outcomes. A runtime-only red team cannot clear extension,
memory, effect, or recovery claims.

### Skills and extensions are executable supply-chain dependencies

Static quality is necessary but cannot establish discovery, execution, value,
or safe composition.

- [ACES](https://arxiv.org/abs/2608.20614) runs paired live trials with and
  without a target skill while holding task, model, harness, workspace, and
  scorer fixed; it reports marginal Skill Lift and normalizes trajectories to
  ATIF.
- The [NVIDIA SkillEvaluator implementation](https://github.com/NVIDIA-NeMo/SkillEvaluator)
  combines structural, semantic/security, and live-evaluation tiers.
- [MCP Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)
  describes confused-deputy, token passthrough, SSRF, session, and local-server
  threats relevant to extension ecosystems.

**Audit consequence:** add a capability module for skills, plugins, hooks, MCP
servers, connectors, downloaded code, and other behavior packages. Require
provenance, content/permission locks, isolation, explicit update admission,
revocation, and affected-run traceability. Use positive, implicit, contextual,
negative, isolation, and group-mode trials. Report paired lift per outcome,
workflow, safety, latency, and cost; never promote from a scan score alone.

### Effective authority is an intersection; danger is a reachable path

No individual role needs to say “admin” for composed permissions to create a
root-like source-to-sink path.

- NIST's [Identity and Authority of Software Agents](https://www.nist.gov/news-events/news/2026/02/new-concept-paper-identity-and-authority-software-agents)
  frames identification, authorization, auditing, and non-repudiation as
  adoption requirements for software and AI agents.
- [MCP Authorization](https://modelcontextprotocol.io/specification/draft/basic/authorization)
  and its security guidance require resource-bound authorization and reject
  token passthrough.
- [A2A](https://github.com/a2aproject/A2A) defines agent discovery and task
  exchange but leaves organization-specific authorization and end-to-end
  accountability to deployments.

**Audit consequence:** map versioned agent subject, workload identity,
delegated principal chain, tenant, purpose, scopes, audience, expiry, compiled
capabilities, policy, approval, and budget. Require child authority to be a
strictly narrower fresh claim. Search for untrusted-source → sensitive
read/capability → external/destructive sink reachability even when each edge is
individually allowed. Test drift and revocation as graph operations that close
credentials, active/queued work, children, sessions, schedules, approvals, and
pending effects.

### Consequential effects need independently checkable proof

Transport success and model confidence are weak evidence of external outcome.

- [τ-bench](https://arxiv.org/abs/2406.12045) validates database state rather
  than final prose.
- [Auditing Agent Harness Safety](https://arxiv.org/abs/2605.14271) distinguishes
  execution fidelity and permission/information-flow boundaries throughout a
  trajectory.
- [AgentDojo](https://papers.neurips.cc/paper_files/paper/2024/file/97091a5177d8dc64b1da8bf3e1f6fb54-Paper-Datasets_and_Benchmarks_Track.pdf)
  evaluates both benign utility and attacker goals in dynamic tool environments.

**Audit consequence:** for every T2/T3 effect, require a proof packet that joins
origin/purpose, release, evidence/rules, identity and authority, policy and
approval after normalization, tool request and idempotency, authoritative
precondition/postcondition, external mutation/version, durable state,
uncertainty, and compensation. Preserve `pending`, `partial`, `unknown`, and
`verification_failed` states; do not collapse them into success/failure prose.

### Recovery is a semantic path, not a generic error handler

Long-running, delegated, stateful agents fail between intent and effect, across
retries, during compaction, after authority changes, and inside cleanup.

- [ReliabilityBench](https://arxiv.org/abs/2601.06112) treats repeated-run
  consistency, semantic perturbation, and controlled tool/API faults as
  distinct reliability dimensions.
- [HarnessRisk](https://arxiv.org/abs/2608.17597) includes incident recovery as
  a security phase rather than an operational afterthought.
- [MemSecBench](https://arxiv.org/abs/2607.27080) evaluates repair together with
  benign-memory preservation, showing that cleanup quality cannot be reduced to
  deletion.

**Audit consequence:** test semantic states such as authorized, executing,
effect-pending, effect-observed, verification-failed, compensation-pending,
recovered, and escalated. Challenge duplicate effects, partial output, expired
workers/approvals, constraint loss under compaction, cancellation across
children, credential/policy rotation, evidence-preserving cleanup, compensation,
selective repair, and restoration.

### Persistent memory is an authority-bounded lifecycle

Write-time filters cannot cover later composition, triggers, transformation,
or downstream effects.

- [MemSecBench](https://arxiv.org/abs/2607.27080) uses a controlled
  Write–Execute–Forget protocol and seven checkpoints spanning write attempt,
  persistence, recall, adoption, external consequence, repair, and benign
  preservation.
- [MemPoison](https://arxiv.org/abs/2607.14651) separates direct single-record,
  compositional multi-record, and dormant context-triggered attacks; its results
  show structural blind spots in write-only defenses.
- [MPBench](https://arxiv.org/abs/2606.04329) studies write channels and memory
  poisoning surfaces across agent systems.

**Audit consequence:** preserve carrier, issuer, source trust, issuer authority,
purpose, tenant/subject, consent, temporal bounds, content digest, and
transformation lineage. Separate observation, proposal, review, promotion,
recall, revocation, quarantine, and tombstone states. Re-evaluate at recall and
action under current identity/policy/evidence. Test direct, compositional,
dormant, source-laundering, expiry-loss, cross-agent, selective-repair, benign-
preservation, and semantic re-entry paths.

### Human oversight must measurably reduce residual risk

Review throughput and self-reported confidence do not establish effective
oversight.

- [One Human, N Agents](https://arxiv.org/abs/2607.28317) models audit-budget
  allocation under miscalibrated confidence, correlated error, and reviewer
  noise; it supplies a quantitative notion of vacuous oversight and shows cases
  where confidence ranking can underperform random allocation.

**Audit consequence:** separate mandatory risk gates from sampled review. Keep
stratified random coverage to expose evaluator blind spots, expand review around
causal correlation groups, validate uncertainty on the exact reviewed tail,
measure reviewer false negatives and interface quality, record the versioned
selection policy, and report residual-risk reduction with uncertainty. If the
review program is non-protective at its workload and budget, narrow authority,
traffic, or consequence rather than count the human as a control.

### Adaptive improvement needs causal evidence and an immutable outer loop

Changing several harness surfaces at once confounds attribution, and a system
that can alter its evaluator or promotion threshold can grade itself into
production.

- [ACES](https://arxiv.org/abs/2608.20614) supplies a paired differential design
  for one behavior package.
- [AgentDojo](https://papers.neurips.cc/paper_files/paper/2024/file/97091a5177d8dc64b1da8bf3e1f6fb54-Paper-Datasets_and_Benchmarks_Track.pdf)
  and [NIST CAISI agent-hijacking experiments](https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations)
  motivate adaptive and repeated adversarial evaluation rather than static
  one-shot attacks.

**Audit consequence:** prefer one-factor/factorial ablations, frozen held-out
slices, evaluator holdbacks, repeated paired trials, stable control groups,
canaries, and critical-slice rollback. Optimize a Pareto surface of trusted
outcomes, instruction compliance, safety, persistence, recovery, review burden,
latency, and cost. Keep authority, held-out data, evaluator versions, promotion,
canary scope, rollback, and evidence retention outside the optimized system.
The inner loop may propose; it may not redefine acceptance.

### Safety and utility must remain paired under repeated opportunity

A defense that refuses all work is not production-safe, and one-shot averages
hide catastrophic slices.

- [AgentDojo](https://papers.neurips.cc/paper_files/paper/2024/file/97091a5177d8dc64b1da8bf3e1f6fb54-Paper-Datasets_and_Benchmarks_Track.pdf)
  jointly evaluates user utility and attacker goals.
- [τ-bench](https://arxiv.org/abs/2406.12045) introduced `pass^k` for reliable
  repeated success.
- NIST's adaptive agent-hijacking work emphasizes task-specific analysis and
  repeated attempts.
- [HarnessRisk](https://arxiv.org/abs/2608.17597) demonstrates why useful-but-
  unsafe runs and detection/action separation deserve direct measurement.

**Audit consequence:** use paired benign/adversarial/fault/recovery tasks;
stratify by lifecycle phase, capability, rule surface, and attack family;
repeat trials based on real opportunity; and report accepted trusted outcomes,
useful-but-unsafe runs, unsafe effects, `pass^k`, monitor quality, recovery, and
cost per accepted trusted outcome. Do not hide variance behind a composite
readiness score.

## What the rubric intentionally rejects

- A universal count of controls regardless of release, reachability, tier, or
  lifecycle phase.
- A model name, framework, prompt, skill scan, dependency, configuration file,
  `200 OK`, dashboard, or human reviewer as standalone proof.
- Treating risk recognition, model refusal, consensus, or retrospective logs as
  prevention.
- Equating a final correct artifact with safe trajectory, rule compliance, or
  authorized effect.
- Mapping inaccessible evidence to absent, or hiding uncertainty inside a fail
  count or aggregate percentage.
- Treating provenance as authority: an authentic malicious document or signed
  extension remains untrusted for its claimed purpose.
- Treating token passthrough, a task ID, shared service account, parent token,
  memory content, or Agent Card as delegated authority.
- Testing memory only at write time, recovery only as deletion, or a kill switch
  only as registry status.
- Promoting skills/extensions from lint or semantic-judge scores without live
  discovery, execution, marginal-value, security, and rollback evidence.
- Using an LLM judge as the sole oracle for deterministic state,
  authorization, disclosure, or effects.
- Allowing an adaptive harness to alter its authority, held-out data, evaluator,
  promotion threshold, or rollback control.
- Reporting only averages, one-shot attacks, review throughput, cost per token,
  task success, or attack success without utility, rule, lifecycle, recovery,
  and evidence-quality context.

## Refresh rule

Before a major rubric change or any T3 audit, check newer primary research,
standards, official security guidance, and ContextOS synthesis. Record the
review date and source class. Adopt a new idea only when it changes a release
artifact, proof obligation, scenario, oracle, metric, gate, remediation order,
or declared uncertainty.
