---
name: harness-audit
description: >-
  Audit an AI agent harness as a threat-model-driven assurance case using
  repository code, configuration, tests, evaluation results, and release-linked
  traces. Map capabilities and trust boundaries, challenge critical safety and
  reliability claims, assess control effectiveness separately from evidence
  strength and confidence, make a risk-tiered launch decision, and produce a
  small dependency-ordered fix queue. Use for production-readiness, agent
  security, governance, control-gap, architecture-risk, or due-diligence reviews
  of tool-using, RAG, memory-enabled, browser/computer-use, MCP, or multi-agent
  systems. Do not use as a questionnaire or claim that a code-only review is a
  runtime penetration test.
---

# Agent Harness Audit

Audit the system that constrains the model, not the model's promises. Build a
falsifiable assurance case for the release under review:

> **No causal evidence, no assurance.** A control is effective only when an
> artifact shows that the deployed path invokes it before the protected
> boundary, a boundary test or release-linked observation challenges it, and no
> obvious bypass remains. Prompts, diagrams, dependencies, and self-reports are
> leads—not enforcement.

Keep three judgments separate:

1. **Effectiveness** — does the safeguard stop the scoped failure?
2. **Evidence level** — is it asserted, defined, wired, boundary-tested, or
   observed in the release?
3. **Confidence** — how complete, current, representative, and trustworthy is
   the audit evidence?

Do not turn them into a percentage. A polished inventory of weak evidence must
not outvote one critical, bypassable boundary.

## Inputs

- **Target:** repository path; default to the current working directory.
- **Runtime evidence:** traces, eval results, incident records, or deployment
  manifests; optional, but consequential production paths cannot be cleared
  without it.
- **Intended use:** deployment setting, users, data, tools, autonomy, and
  consequences. Infer an impact tier when absent and label the assumption.

Do not block on missing optional inputs. Record unavailable surfaces as **Not
verified**, state the access needed, and apply the launch gate in the rubric.
Never equate inaccessible with absent, or absence with N/A.

## Required references

Read these before scoring:

- [audit-rubric.md](reference/audit-rubric.md) — claims, evidence levels,
  capability modules, metrics, and launch gates.
- [report-template.md](reference/report-template.md) — required report shape.

Read [research-basis.md](reference/research-basis.md) when explaining the
method, updating the rubric, selecting evaluation techniques, or auditing a
novel surface. It records the primary research behind the workflow and its
review date.

## Protocol

Follow the sequence. Preserve uncertainty and counterevidence at every stage.

### 1. Profile the release and impact

Read manifests, lockfiles, entry points, tool and MCP configuration, prompts,
policy code, tests, evals, telemetry, and deployment files. Identify the exact
release tuple when possible: model, prompt, policy, tools, context/retrieval,
memory schema, evaluators, and harness revision.

Assign the impact tier from the rubric:

- **T0 — isolated experiment**
- **T1 — bounded read-only**
- **T2 — consequential operations**
- **T3 — high-impact or privileged**

Choose the highest tier triggered by any reachable capability. Do not average a
dangerous write path down with many harmless read paths.

### 2. Build a boundary and capability map

Run the deterministic prescan:

```bash
node "$SKILL_DIR/scripts/prescan.mjs" <target-path>
```

Use `--json` when machine-readable output helps. If Node is unavailable, use
`rg` manually. The prescan only locates leads; open every material hit.

Map the actual flow as edges, not a component list:

```text
principal -> intent/authority -> model/context -> dispatcher -> tool/resource -> sink
untrusted source -> retrieval/tool result/message -> context or memory
release config -> runtime path -> trace/eval/incident record
```

For every edge, note the trust change, identity, data class, authority source,
persistence, side effect, monitor, and enforcement point. Inventory reachable
capabilities, including indirect access through sub-agents, plugins, MCP
servers, browser/computer use, shell/code execution, and delegated credentials.

Mark each capability module in the rubric **Applicable** or **N/A with a factual
rationale**. Missing implementation is not N/A when the capability exists.

### 3. Derive critical abuse stories

Identify assets, principals, trusted instructions, untrusted observations,
policy owners, and external sinks. Write concrete abuse stories for every
consequential capability. Cover relevant origins:

- malicious or confused user;
- indirect instruction in a document, website, message, tool result, or memory;
- wrong-user, wrong-tenant, or wrong-object action;
- compromised tool, plugin, dependency, sub-agent, or upstream service;
- model error, ambiguity, reward-seeking, or covert side task;
- retry, timeout, partial failure, stale approval, or release drift.

Express each story as:

```text
Given <authority and starting state>, when <failure or adversary> influences
<boundary>, the harness must prevent/detect/recover from <observable harm>.
```

Name the **cut point** that should stop it. Prioritize by reachable impact,
attacker opportunity, reversibility, and blast radius—not by keyword count.

### 4. Challenge the assurance claims

Assess all eight core claims plus every applicable capability module in the
rubric. For each claim:

1. Trace the enforcement chain from entry point to protected boundary.
2. Cite the smallest safe `path:line`, test ID, trace ID, or deployment binding.
3. Search for alternate dispatchers, direct SDK calls, fallback paths, stale
   workers, over-broad credentials, and feature flags that bypass the control.
4. Record contradictory evidence; score the weaker supported conclusion.
5. Assign **Effective / Partially effective / Ineffective / Not verified / N/A**,
   evidence level **E0–E4**, and confidence **High / Medium / Low**.

An **Effective** claim requires an enforced mechanism, coverage of the scoped
surface, and boundary evidence. A helper test proves the helper, not the real
path. A runtime trace proves only the release and scenario it can be linked to.

Use a time budget to keep searching bounded, but do not mislabel uncertainty:
record “not found within audit budget” as **Not verified**, then apply the same
launch block as an unresolved claim at that tier.

### 5. Inspect or design behavioral evidence

Select evidence by critical capability, not by an arbitrary number of traces.
At minimum, seek for each critical path:

- a benign task that should succeed;
- a matched boundary task that should deny, clarify, minimize, or escalate;
- a faulted task with a tool error, timeout, empty result, or partial write;
- for untrusted-input paths, an adaptive indirect-injection task;
- for memory, a write → later recall/use → selective repair/delete sequence.

Reconcile every result to the release tuple. Prefer deterministic environment
state, policy decisions, and tool-call arguments over the final answer. Use an
LLM judge only for narrow semantic questions, preserve its prompt/version, and
validate it against human-labeled examples. Never let a judge's prose override
an observed forbidden state change.

For stochastic agents, require repeated trials. Report benign utility,
violation/attack success, consistency (`pass^k` when appropriate), and false
positive/negative rates for monitors. Use paired benign/adversarial tasks so a
defense that refuses everything cannot appear safe. Break results down by
task/attack family; aggregates can hide a catastrophic slice.

Do not execute live attacks or risky tools merely to fill an evidence gap.
Only run behavioral tests when the user has authorized them and the environment
is isolated, reversible, and free of real-user impact. Otherwise specify the
exact test and expected oracle for the owner to run.

### 6. Make the launch decision

Apply the tier-specific gates in the rubric. Use:

- **BLOCKED** — a critical claim is Ineffective or Not verified, required
  evidence is missing, or a credible bypass reaches unacceptable harm.
- **CONDITIONAL** — intended use is safe only under explicit, testable
  constraints or compensating controls.
- **READY** — all tier-required claims meet the required status and evidence
  gate, residual risks are owned, and evaluation coverage matches the release.

Code-only review may support design assurance; it cannot clear a T2/T3 runtime.
State the residual risk, audit confidence, evidence freshness, and exact scope
of the decision. Do not assign a maturity label that implies evidence you did
not inspect.

### 7. Report and prioritize

Use [report-template.md](reference/report-template.md). Lead with the highest-
impact reachable failure path, not the inventory. Include:

- boundary/capability map and applicability decisions;
- critical abuse stories and cut points;
- claim-by-claim status, evidence level, confidence, and counterevidence;
- evaluation adequacy and measured rates when available;
- launch gates, limitations, and residual risk;
- a dependency-ordered fix queue of at most five active items.

Each fix must name the mechanism, boundary, owner placeholder, and expected
evidence that would change the judgment. Prefer one load-bearing cut point that
closes several abuse stories over many prompt tweaks. End with the first fix to
complete and the re-audit trigger.

## Audit discipline

- Treat model instructions as policy intent, never as the sole control for a
  consequential boundary.
- Evaluate the right action on the wrong object, user, tenant, recipient, or
  time—not only the wrong tool.
- Check what crossed the boundary even when the agent reported refusal.
- Preserve safety and utility together; over-refusal is a reliability defect.
- Distinguish prevention, detection-before-impact, detection-after-impact, and
  recovery. They are not interchangeable.
- Redact secrets, personal data, prompts, and sensitive tool arguments from the
  report while preserving verifiable references.
- Prefer framework-neutral claims. Require outcomes, not a particular planner,
  policy engine, tracing vendor, or orchestration pattern.
