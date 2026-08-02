# Research Basis

Reviewed **2026-08-02**. Use this note to understand why the audit is structured
as an assurance case rather than a flat compliance checklist. Treat recent
preprints as directional evidence, not settled standards.

## Methodological findings adopted

### Audit the agent-environment system

Agent failures emerge from interactions among the model, harness, tools,
identity, data, environment, and evaluator. Realistic tasks and executable
environments reveal failures that chat-only or output-only tests miss.

- [AgentDojo (NeurIPS 2024)](https://papers.neurips.cc/paper_files/paper/2024/file/97091a5177d8dc64b1da8bf3e1f6fb54-Paper-Datasets_and_Benchmarks_Track.pdf)
  evaluates prompt injection against dynamic tool environments and measures both
  task utility and attacker goals.
- [τ-bench (ICLR 2025)](https://arxiv.org/abs/2406.12045) evaluates multi-turn
  tool use under domain policy and checks database state, motivating outcome
  oracles and repeated-run consistency rather than final-text grading alone.
- [OpenAgentSafety (2025 preprint)](https://arxiv.org/abs/2507.06134) uses real
  browsers, shells, filesystems, messaging, and multi-user tasks, supporting
  capability-specific modules and realistic isolated testing.

**Audit consequence:** map principals, trust transitions, capabilities, and
environment state before choosing controls. Do not infer production safety from
model refusal or task completion.

### Test adaptive attacks, task slices, and repeated opportunity

Security results change with the task, attack adaptation, and number of tries.
A single aggregate or single sample can materially understate risk.

- [NIST CAISI agent-hijacking experiments (2025)](https://www.nist.gov/news-events/news/2025/01/technical-blog-strengthening-ai-agent-hijacking-evaluations)
  recommend adaptive evaluations, task-specific analysis, continuous benchmark
  improvement, and repeated attempts; their experiments observed higher attack
  success with multiple tries.
- [AgentDojo](https://papers.neurips.cc/paper_files/paper/2024/file/97091a5177d8dc64b1da8bf3e1f6fb54-Paper-Datasets_and_Benchmarks_Track.pdf)
  argues that static attacks invite brittle defenses and provides an extensible
  environment for attacks and defenses.
- [WASP (2025 preprint)](https://arxiv.org/abs/2504.18575) emphasizes realistic
  attacker access and separates starting to follow an injected goal from
  achieving end-to-end harm.
- [ReliabilityBench (2026 preprint)](https://arxiv.org/abs/2601.06112) evaluates
  repeated-run consistency, semantic perturbation, and controlled tool/API
  faults as distinct reliability dimensions.

**Audit consequence:** use matched benign/adversarial tasks, stratify by task
and attack family, repeat stochastic trials based on opportunity, and distinguish
influence, forbidden action, end harm, detection, and recovery.

### Evaluate safety and utility together

Refusing every task is not a safe production agent. Defense evaluation must
preserve legitimate utility and expose over-refusal.

- [AgentDojo](https://papers.neurips.cc/paper_files/paper/2024/file/97091a5177d8dc64b1da8bf3e1f6fb54-Paper-Datasets_and_Benchmarks_Track.pdf)
  jointly evaluates user-task utility and injection attack success.
- [τ-bench](https://arxiv.org/abs/2406.12045) couples policy adherence with
  successful multi-turn task completion and introduced `pass^k` for reliable
  repeated success.

**Audit consequence:** pair boundary cases with legitimate tasks and report
utility, unsafe-action rate, consistency, and monitor false positives rather
than one safety score.

### Inspect trajectories, state, and monitors

Long-horizon agents can take harmful intermediate actions, conceal intent, or
claim success despite failed tools. Monitoring must be evaluated as its own
fallible control.

- [SHADE-Arena (2025)](https://www.anthropic.com/research/shade-arena-sabotage-monitoring)
  tests subtle side tasks in long, tool-using trajectories and separately
  measures whether a monitor notices suspicious behavior.
- [NIST evaluation probes (2026)](https://www.nist.gov/programs-projects/building-evaluation-probes-agentic-ai)
  integrate adversarial verifiers into workflows and accumulate machine-readable
  audit trails tying outputs to evidence.
- [AgentHazard (2026 preprint)](https://arxiv.org/abs/2604.02947) targets harm
  that accumulates across context, tool calls, intermediate actions, and
  cross-step dependencies.

**Audit consequence:** reconstruct the action path, inspect authoritative state
and arguments, distinguish detection before and after impact, and measure
monitor recall, false positives, latency, independence, and tamper surface.

### Treat persistent memory as a lifecycle attack surface

Memory poisoning may be written in one task, recalled in another, influence an
action later, and survive naive deletion. Point-in-time memory checks miss this
chain.

- [MPBench / From Untrusted Input to Trusted Memory (2026 preprint)](https://arxiv.org/abs/2606.04329)
  analyzes memory write channels and shows that aggressive write/retrieval can
  increase exploitability while existing prompt-injection defenses may not cover
  memory poisoning.
- [MemSecBench (2026 preprint)](https://arxiv.org/abs/2607.27080) evaluates a
  controlled write → execute → forget lifecycle with checkpoint-specific,
  evidence-based adjudication and selective repair.

**Audit consequence:** test source-aware writes, later exposure/adoption/action,
and selective repair while preserving benign memories. Do not mark “memory
encrypted” or “TTL configured” as proof against control-flow poisoning.

### Expand threat origins beyond malicious end users

Agents can harm owners through untrusted environment content, compromised
components, cross-agent cascades, goal conflict, ambiguity, or ordinary model
and operator error.

- [NIST AI 800-5 (2026)](https://www.nist.gov/publications/summary-analysis-responses-request-information-regarding-security-considerations-ai)
  reports broad agreement that traditional cybersecurity remains necessary but
  must be adapted for agent systems.
- [Agentic Misalignment (Anthropic, 2025)](https://www.anthropic.com/research/agentic-misalignment)
  stress-tests simulated insider-like behaviors under goal conflict and reduced
  oversight; it is a threat-model probe, not evidence of observed deployment
  behavior.
- [Multi-agent cascading injection (2025 preprint)](https://arxiv.org/abs/2507.21146)
  formalizes propagation and blast radius across communicating agents.

**Audit consequence:** derive abuse stories from assets, authority, trust
transitions, and reachable capabilities. Include compromised peers/upstreams,
confused deputies, release drift, and model failure where plausible.

## What the rubric intentionally rejects

- A universal count of controls regardless of reachable capability.
- Fixed severity attached to an implementation pattern rather than a failure
  path and impact tier.
- Treating planner/executor separation, a particular policy engine, or a
  tracing vendor as universally mandatory.
- Mapping inaccessible evidence to “absent” or hiding it inside a fail count.
- Passing on a dependency, configuration file, happy-path trace, or model
  refusal without runtime wiring and a boundary challenge.
- Using an LLM judge as the sole oracle for deterministic state, authorization,
  disclosure, or side effects.
- Reporting only averages, one-shot attacks, final answers, or attack success
  without benign utility and false-positive costs.

## Refresh rule

Before a major rubric change or a T3 audit, check for newer primary sources and
standards. Record the review date, distinguish peer-reviewed work from
preprints, and adopt methods only when they change an auditable decision,
evidence requirement, scenario, or metric.
