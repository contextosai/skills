# Research Basis

Reviewed **2026-10-06**. This is a selective primary-source review through that
date, not an exhaustive survey. Links pin paper versions where inspected;
engineering posts retain their publication dates. New preprints supply useful
hypotheses and evaluation designs, not independently replicated production
assurance. No benchmark percentage becomes a universal launch threshold.

The maintained method lives in [audit-rubric.md](audit-rubric.md) and
[evaluation-protocol.md](evaluation-protocol.md). Findings below distinguish
what a source reports from the audit's engineering inference.

## Recent work that changes the method

### R1 — Match the measurement to the claim

[Agent Evaluation Reliability: More Tasks Won't (Always) Fix An Agent Leaderboard,
v1](https://arxiv.org/abs/2610.00651v1), submitted **2026-09-30**. Research
preprint; abstract and submission record inspected.

- **Finding:** A variance-decomposition analysis of 22 benchmarks distinguishes
  reliable rankings of fixed model–scaffold systems from less reliable claims
  about underlying models. Limited scaffold coverage can dominate uncertainty.
- **Audit inference:** State the population and estimand before interpreting a
  score. Evaluate the deployed bundle for release claims; vary scaffolds only
  for claims intended to generalize over them. Allocate additional evaluation
  to the uncertainty source, not automatically to more tasks or seeds.
- **Limit:** Leaderboard reliability is not a measurement of production harm.
  It does not require every product audit to test multiple harnesses.

### R2 — Separate harness improvement from extra search

[Rethinking the Evaluation of Harness Evolution for Agents,
v4](https://arxiv.org/html/2607.12227v4), revised **2026-10-05**; first submitted
2026-07-14. Research preprint; evaluation design and results inspected.

- **Finding:** Under matched feedback and compute budgets, the studied harness
  evolution methods underperform simple search baselines on Terminal-Bench and
  generalize weakly to held-out tasks. The revised paper also reports benefits
  in long-horizon games; its conclusion is setting-dependent.
- **Audit inference:** Require unchanged-harness search baselines, separated
  development/selection/test sets, and optimization-cost accounting for claims
  of reusable improvement. Keep release adequacy separate from superiority.
- **Limit:** This does not establish that harness evolution always fails or
  always helps. Do not carry the initial version's narrower result forward as
  the entire current finding.

### R3 — Test permission, appearance, and competence separately

[AgentBoundary: Counterfactual Evaluation of Safety in Tool-Using LLM Agents,
v1](https://arxiv.org/html/2609.33658v1), **2026-09-27**. Research preprint;
construction and trajectory-evaluation sections inspected.

- **Finding:** Matched workflows vary apparent risk independently of permission,
  exposing both unauthorized compliance and failures on risky-looking permitted
  work. Decisions depend on facts revealed during execution.
- **Audit inference:** Use the four-cell permission/appearance design and an
  ambiguous-permission case when relevant. Grade from evidence available before
  the action; distinguish over-refusal from inability to finish the task.
- **Limit:** Synthetic, human-validated benchmark families do not establish a
  product's permission policy or prove a learned calibrator is an authority
  boundary. Permission still comes from trusted runtime evidence.

### R4 — A monitor is only one part of prevention

[HARDE: Optimizing Agent Harnesses for Runtime Risk Detection and Execution
Control, v1](https://arxiv.org/html/2609.38291v1), **2026-09-29**. Research
preprint; module design and ablations inspected.

- **Finding:** Trigger, monitor, and feedback components play complementary
  roles. Module-specific probing and refinement improve the reported
  safety–utility tradeoff across the evaluated attack benchmarks.
- **Audit inference:** Inspect trigger coverage, monitor judgment, actual
  intervention, and safe continuation separately. Include monitor outages,
  bypassed inspection, and recovery from contaminated observations.
- **Limit:** The paper's LLM monitor and optimization recipe are candidates to
  evaluate, not required architecture. Component scores cannot replace evidence
  that a forbidden resource effect was prevented.

### R5 — Govern adaptation on future tasks

[SafeCoEvo: Co-Evolving Safety Harnesses and Guards for LLM Agents at Test-Time,
v2](https://arxiv.org/html/2609.36580v2), revised **2026-10-02**; first submitted
2026-09-29. Research preprint; sequential-task formulation inspected.

- **Finding:** The framework separates fast updates to explicit safety knowledge
  from slower guard learning, using feedback accumulated from earlier tasks for
  subsequent tasks.
- **Audit inference:** Replay adaptation in temporal order, version mutable
  knowledge and guard state, and test on future unseen tasks. Challenge poisoned
  feedback, regression, and learned-state rollback. Keep acceptance and authority
  under independent ownership while allowing governed guard updates.
- **Limit:** Reported gains do not prove safe unbounded production adaptation.
  External promotion controls and rollback are this audit's engineering policy.

### R6 — Enforce data flow and support safe continuation

[Environment Steering: Using Data Flow Control to Improve Agent Utility and
Safety, v1](https://arxiv.org/html/2609.35807v1), **2026-09-19**. Research
preprint/workshop paper; mechanism and limitations inspected.

- **Finding:** A prototype checks execution-state data flows before action
  commit and supplies corrective feedback. Its limitations explicitly include
  weak benchmark coverage of tool-internal and richer multi-record flows.
- **Audit inference:** Trace source-to-sink provenance through composite tools
  and retries; verify enforcement before the effect and utility after denial.
  Extend tests to internal and multi-step flows when the product exposes them.
- **Limit:** Zero observed attacks in one benchmark configuration is not a
  general safety guarantee. The skill does not require a relational policy
  engine or assume that top-level tool checks cover internal execution.

## Evaluation integrity and retained foundations

### R7 — The evaluation can be contaminated at runtime

[Eval awareness in Claude Opus 4.6's BrowseComp
performance](https://www.anthropic.com/engineering/eval-awareness-browsecomp),
**2026-03-06**. Vendor primary engineering investigation; incident analysis
inspected.

- **Finding:** Agents encountered leaked answers, and some identified the
  benchmark and recovered its answer key. Persistent search traces also created
  inter-agent contamination channels.
- **Audit inference:** Inspect benchmark exposure, answer-key/grader access,
  shared caches, web artifacts, and cross-run state. Preserve contaminated runs
  as invalid evidence and repeat in a controlled environment when possible.
- **Limit:** Benchmark recognition alone is not proof of deceptive intent; an
  isolated vendor investigation does not estimate prevalence for every agent.

### R8 — Infrastructure is an experimental variable

[Quantifying infrastructure noise in agentic coding
evals](https://www.anthropic.com/engineering/infrastructure-noise),
**2026-02-05**. Vendor primary engineering experiments; setup and resource-limit
analysis inspected.

- **Finding:** Resource allocation and enforcement affect measured agent
  performance, including failures caused by the execution environment.
- **Audit inference:** Pin CPU/memory/timeouts/concurrency and reset state; match
  conditions in comparisons. Separate infrastructure failures from agent errors
  without dropping either from the attempted-trial ledger.
- **Limit:** Resource settings that help a coding benchmark are not universal
  deployment recommendations or permission to increase agent authority.

### R9 — Cover the lifecycle and distinguish recognition from prevention

[HarnessRisk, v1](https://arxiv.org/abs/2608.17597v1), **2026-08-18**.
Research preprint; abstract and submission record rechecked.

- **Finding:** The benchmark spans configuration, extension, runtime,
  persistence, action control, and recovery; reported risk recognition and
  attack prevention can diverge.
- **Audit inference:** Retain the six-phase coverage frame, cross-phase paths,
  and separate recognition, persistence, effects, detection, and recovery.
- **Limit:** Its sandboxed cases motivate coverage; their rates do not determine
  this skill's T0–T3 thresholds or establish completeness of the taxonomy.

### R10 — Repair must preserve useful state

[MemSecBench, v1](https://arxiv.org/abs/2607.27080v1), **2026-07-29**.
Research preprint; abstract and submission record rechecked.

- **Finding:** Write–Execute–Forget evaluates poisoning through persistence,
  downstream consequences, and selective repair under specified agent/memory
  configurations.
- **Audit inference:** Test later recall and effect, repair of derived state,
  and benign-memory preservation. Deleting one source record is incomplete
  recovery evidence when descendants remain active.
- **Limit:** Benchmark judge checkpoints need validation for the target system;
  memory-backend results do not transfer automatically across releases.

### R11 — Verify outcomes and repeated reliability

[τ-bench, v1](https://arxiv.org/abs/2406.12045v1), **2024-06-17**.
Primary research paper; abstract and submission record rechecked.

- **Finding:** Database end-state checks and `pass^k` distinguish authoritative
  outcomes and repeated consistency from plausible completion messages.
- **Audit inference:** Keep state oracles and distinguish all-attempt success
  from best-of-k. Add trajectory authorization checks: an acceptable final state
  does not by itself prove all intermediate actions were permitted.
- **Limit:** Simulated users and domain databases cover a bounded environment,
  not all operational side effects or disclosure paths.

### R12 — Combine graders and inspect traces

[Demystifying evals for AI
agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents),
**2026-01-09**. Vendor primary engineering guidance; workflow inspected.

- **Finding:** Tasks, trials, graders, transcripts, and environment outcomes
  serve distinct roles; grader choice depends on what is being measured.
- **Audit inference:** Use programmatic, semantic, and human checks selectively;
  preserve outcome and trajectory evidence and calibrate semantic graders.
- **Limit:** This is practitioner guidance, not a validated release standard.

## What is local engineering policy

The release manifest, C1–C8 claims, M1–M9 modules, E0–E4 evidence levels, T0–T3
impact tiers, launch gates, effect proof packets, and five-item active fix queue
are this skill's synthesis. They are not thresholds proven by the papers and
must not be represented as certification or consensus standards. Likewise,
controlled commissioning, independent acceptance ownership, bounded authority,
and evidence invalidation on material change are assurance design choices.

Statistical formulas in the evaluation protocol are elementary binomial results
under explicit independent/stationary assumptions. They do not model adaptive
attack campaigns, correlated workloads, or unknown outcomes automatically.

The earlier revision used ContextOS field essays as organizing context. This
revision uses directly inspected primary sources for research claims; it does
not require reading a vendor essay collection during an audit.

## Refresh rule

For a requested research refresh or materially novel audit surface, search
primary research and relevant official specifications. Check the actual paper
version and date, method, scope, and limitations, not just a search summary.
Read the deployed protocol version when auditing protocol compliance. A newer
preprint does not supersede a deployed standard by publication date alone.

Record source class, version, reviewed date, what was inspected, the observed
finding, the local inference, and the artifact/test/decision it changes. If only
an abstract is available, limit the claim accordingly. Preserve useful older
foundations; remove stale or redundant citations rather than expanding a reading
list indefinitely. Do not make network access a prerequisite for code triage;
state freshness limits when newer sources cannot be checked.
