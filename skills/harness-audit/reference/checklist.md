# The 40-Control Harness Audit Checklist

The rubric for the audit. Every control has: the audit question, minimum **Pass**
evidence, the immediate **Fail** signal, severity, where to look, and the
ContextOS plane + doc that owns the remediation. Controls are grouped by the
eight outcome properties so the scores roll up directly.

Scoring: **Pass** = an artifact proves it for a real path (cite `path:line`).
**Partial** = exists but incomplete/manual/delayed/wrong-boundary. **Fail** =
absent, unenforced, unverifiable, or prose-only. Five-minute rule: evidence you
can't find in ~5 min scores Fail. Severity is independent of pass state.

"Where to look" hints are framework-agnostic starting points; adapt to the
target's stack. A keyword match is a *candidate*, not a Pass — open it and
confirm the control is actually enforced at the right boundary.

---

## Context-aware
*Owning planes: Context (compilation), Intelligence (memory). Docs:*
*/docs/implementation/context-pack, /docs/foundations/memory*

### 5 — Context source registry · P0
- **Q:** Are all eligible context sources declared and governed?
- **Pass:** Source registry with owner, freshness, sensitivity, access mode, TTL.
- **Fail:** Retrieval pulls from undocumented indexes or ad hoc APIs.
- **Where:** retrieval/RAG modules, vector-store clients, `retriever`, `index`, `loader`, env-configured data URLs.
- **ContextOS:** Context plane → /docs/implementation/context-pack

### 6 — Context compiler · P0
- **Q:** Can you prove what context entered the model?
- **Pass:** A `CompiledContext`-equivalent: pack version, source hashes, truncation record, token budget.
- **Fail:** Runtime string concatenation with no manifest.
- **Where:** prompt-assembly code, f-strings/template joins feeding the model call, `messages=[...]` construction, any "build prompt" function.
- **ContextOS:** Context plane → /docs/implementation/context-pack

### 7 — Grounding and evidence · P1
- **Q:** Are claims grounded in retrieved or tool-backed evidence?
- **Pass:** Evidence manifest with citations, source IDs, confidence.
- **Fail:** Final answer makes factual claims with no source lineage.
- **Where:** citation/source attribution in outputs, `sources`, `citations`, grounding checks.
- **ContextOS:** Context plane → /docs/implementation/context-pack

### 8 — Context budget control · P1
- **Q:** Does the system control what gets dropped when the window fills?
- **Pass:** Budget policy by source type, truncation reason, priority order.
- **Fail:** Oldest or random text dropped silently.
- **Where:** token counting, truncation/summarization logic, `max_tokens`, context-window trimming.
- **ContextOS:** Context plane → /docs/implementation/context-pack

### 9 — Memory read policy · P0
- **Q:** Is memory retrieval intentional, scoped, and auditable?
- **Pass:** Memory query log, memory IDs used, purpose, freshness, consent basis.
- **Fail:** Agent loads long-term memory by default without reason.
- **Where:** memory/`mem`/`recall`/`history` retrieval, session stores, "load memory" calls.
- **ContextOS:** Intelligence plane → /docs/foundations/memory

### 10 — Memory write policy · P0
- **Q:** Are new memories validated before persistence?
- **Pass:** Write proposal, dedup, sensitivity check, TTL, reviewer or auto-approval rule.
- **Fail:** Every conversation summary becomes memory.
- **Where:** memory `save`/`persist`/`upsert`/`write`, summary-to-store paths.
- **ContextOS:** Intelligence plane → /docs/foundations/memory (promotion-aware memory)

### 11 — Contradiction handling · P1
- **Q:** Can memory conflicts be detected and resolved?
- **Pass:** Conflict record, recency, source confidence, supersession rule.
- **Fail:** Old incorrect memory keeps influencing future runs.
- **Where:** dedup/merge logic, "supersede"/"conflict"/"resolve" in memory layer.
- **ContextOS:** Intelligence plane → /docs/foundations/memory

---

## Policy-governed
*Owning plane: Trust (governance). Doc: /docs/foundations/governance*

### 1 — Agent charter · P0
- **Q:** Is the agent's job, scope, user type, and autonomy explicitly declared?
- **Pass:** Versioned `AgentSpec`-equivalent: purpose, owner, allowed intents, denied intents, autonomy class.
- **Fail:** "The prompt describes it" is the only source of truth.
- **Where:** agent config/manifest, `agent.yaml`/`config`, AgentSpec/charter files (not the system prompt).
- **ContextOS:** Trust plane → /docs/foundations/governance, /docs/implementation/intent-task-catalog

### 2 — Autonomy boundary · P0
- **Q:** Does the system know what the agent can answer, recommend, decide, or execute?
- **Pass:** Autonomy matrix: inform / recommend / draft / execute_with_approval / execute_directly.
- **Fail:** Same path used for low-risk Q&A and high-risk actions.
- **Where:** action-gating, risk classification before tool calls, autonomy/permission tiers.
- **ContextOS:** Trust plane → /docs/foundations/governance (ApprovalMode tiers)

### 12 — Policy engine · P0
- **Q:** Are rules enforced outside the model?
- **Pass:** Versioned policy bundle, rule IDs, `policy_decision_id`, verdict, inputs.
- **Fail:** "The model has been instructed not to."
- **Where:** OPA/Cedar/rules engine, guardrail libs, explicit `if`-gates around actions; NOT prompt text.
- **ContextOS:** Trust plane → /docs/foundations/governance

### 13 — Data classification · P0
- **Q:** Does the harness know what data class it is handling?
- **Pass:** Data labels: public, internal, confidential, PII, payment, regulatory.
- **Fail:** Tool or prompt receives sensitive data without classification.
- **Where:** data tagging, PII detection, classification decorators/schemas.
- **ContextOS:** Trust plane → /docs/foundations/governance

### 14 — Privacy controls · P0
- **Q:** Are redaction, minimization, and retention enforced?
- **Pass:** Redaction trace, retention policy, purpose limitation, deletion path.
- **Fail:** PII appears in prompts, traces, or eval sets without controls.
- **Where:** redaction/masking utils, retention/TTL config, "delete user data" paths.
- **ContextOS:** Trust plane → /docs/foundations/governance

### 21 — Human approval · P0
- **Q:** Are approval gates explicit for high-risk actions?
- **Pass:** Approval request, approver identity, decision, expiry, reason.
- **Fail:** Approval happens informally over Slack/chat.
- **Where:** interrupt/human-in-the-loop (`interrupt`, `HumanApproval`, `require_approval`), approval queues.
- **ContextOS:** Trust plane → /docs/foundations/governance

---

## Tool-controlled
*Owning planes: Action (tools), Trust (identity/secrets). Docs:*
*/docs/foundations/adapter-mesh, /docs/foundations/identity-layer*

### 15 — Tool manifest · P0
- **Q:** Are available tools declared, versioned, and owned?
- **Pass:** Tool manifest with schema, owner, risk class, timeout, retry, auth mode.
- **Fail:** Tool list lives only in the prompt.
- **Where:** tool/function definitions, `@tool`, MCP server config, tool registry.
- **ContextOS:** Action plane → /docs/foundations/adapter-mesh

### 16 — Tool Gateway · P0
- **Q:** Are tool calls validated before execution?
- **Pass:** Schema validation, argument validation, policy check, approval mode in the call envelope.
- **Fail:** Model-named tools can be invoked dynamically without validation.
- **Where:** tool dispatch/executor, arg validation (Pydantic/zod), pre-execution hooks.
- **ContextOS:** Action plane → /docs/foundations/adapter-mesh (Tool Gateway)

### 17 — Tool risk class · P0
- **Q:** Are side effects classified?
- **Pass:** Approval mode + side-effect class (financial, destructive, regulated).
- **Fail:** Refund/cancel/payment/delete treated like search.
- **Where:** per-tool metadata, risk/danger flags, write-vs-read tagging.
- **ContextOS:** Action plane → /docs/foundations/adapter-mesh

### 18 — Identity and authorization · P0
- **Q:** Does every tool call run under scoped identity?
- **Pass:** User/service identity, scoped token, RBAC/ABAC decision, expiry.
- **Fail:** Shared static credentials used by all agents.
- **Where:** auth middleware, token scoping, per-request identity, SPIFFE/OIDC.
- **ContextOS:** Trust/Intelligence → /docs/foundations/identity-layer

### 19 — Secret handling · P0
- **Q:** Are credentials isolated from model-visible context?
- **Pass:** Secrets vault, no secrets in prompts/logs, scoped runtime injection.
- **Fail:** API keys/tokens can enter model context.
- **Where:** env/secret loading, vault clients, check that secrets never reach prompt or trace.
- **ContextOS:** Trust plane → /docs/foundations/identity-layer, /docs/security

### 20 — Network and sandbox controls · P0
- **Q:** Is external access constrained?
- **Pass:** Egress allowlist, sandbox policy, file/network restrictions.
- **Fail:** Agent can call arbitrary URLs or execute arbitrary code.
- **Where:** code-exec/`eval`/shell tools, HTTP clients, sandbox/container config, egress rules.
- **ContextOS:** Action plane → /docs/foundations/adapter-mesh, /docs/security

---

## Validated
*Owning plane: Trust (evaluation). Doc: /docs/foundations/evaluation-observability*

### 26 — Offline evals · P0
- **Q:** Are changes tested before release?
- **Pass:** Golden set, scenario set, regression suite, model/prompt/tool version comparison.
- **Fail:** Prompt or model changes go live without replay.
- **Where:** `evals/`, `tests/`, golden datasets, eval CI jobs.
- **ContextOS:** Trust plane → /docs/foundations/evaluation-observability

### 27 — Trajectory evals · P1
- **Q:** Does evaluation check the path, not just the final answer?
- **Pass:** Expected vs actual tool trajectory, step quality, unnecessary-tool-call detection.
- **Fail:** Final answer judged "good" despite a wrong process.
- **Where:** eval harness asserting tool-call sequences, step-level scoring.
- **ContextOS:** Trust plane → /docs/foundations/evaluation-observability

### 28 — Online validation · P0
- **Q:** Can bad outputs be blocked at runtime?
- **Pass:** Live critic/evaluator, policy-respect check, safety/utility score before finalization.
- **Fail:** Evals run only weekly/monthly/offline.
- **Where:** output guardrails, post-generation critic, pre-return validation hooks.
- **ContextOS:** Trust plane → /docs/foundations/evaluation-observability

### 29 — Red-team coverage · P0
- **Q:** Is the harness tested against adversarial behavior?
- **Pass:** Prompt-injection, tool-abuse, data-leakage, jailbreak test suites.
- **Fail:** Only happy-path demo queries are tested.
- **Where:** `redteam`/`adversarial`/`injection` tests, security test dirs.
- **ContextOS:** Trust plane → /docs/foundations/evaluation-observability, /docs/security

---

## Observable
*Owning plane: Trust (observability). Doc: /docs/foundations/evaluation-observability*

### 30 — Observability · P0
- **Q:** Can an engineer reconstruct the full run?
- **Pass:** Trace spans for context, model, tools, policy, eval, approval, final response.
- **Fail:** Logs stop at "LLM returned response."
- **Where:** OTEL/tracing setup, span instrumentation around model+tool calls, Langfuse/Traceloop/Phoenix.
- **ContextOS:** Trust plane → /docs/foundations/evaluation-observability

### 31 — Standard telemetry · P1
- **Q:** Are traces, logs, and metrics correlated?
- **Pass:** Stable `trace_id`, `run_id`, `intent_id`, `user_id`, `session_id`, `tool_call_id`.
- **Fail:** Logs exist but cannot be joined.
- **Where:** logging context/correlation IDs, structured logging fields.
- **ContextOS:** Trust plane → /docs/foundations/evaluation-observability

### 3 — Intent taxonomy · P1
- **Q:** Are runs mapped to stable intent IDs?
- **Pass:** `intent_id`, confidence, router decision, fallback intent in the trace.
- **Fail:** Metrics only show global agent success.
- **Where:** intent classification/router, `intent`/`route`/`category` tagging.
- **ContextOS:** Trust/Context → /docs/implementation/intent-task-catalog

---

## Reversible
*Owning planes: Action, Trust. Docs: /docs/implementation/decision-record,*
*/docs/reference/failure-playbooks*

### 4 — Planner/executor split · P0
- **Q:** Is planning separated from execution for non-trivial tasks?
- **Pass:** Plan artifact, execution steps, approval gates, state transitions.
- **Fail:** Model jumps directly from user prompt to tool execution.
- **Where:** planner/executor nodes, plan-then-act loops, graph definitions.
- **ContextOS:** Decision plane → /docs/foundations/orchestration

### 23 — State machine · P1
- **Q:** Is execution state explicit and durable?
- **Pass:** State transitions, checkpoints, event log, current state visible.
- **Fail:** State exists only in chat history or process memory.
- **Where:** graph/state machine, checkpointer, `state`/`status` persistence.
- **ContextOS:** Decision plane → /docs/foundations/orchestration

### 24 — Idempotency · P0
- **Q:** Are repeated tool calls safe?
- **Pass:** Idempotency keys for write tools, duplicate detection.
- **Fail:** Retry can create duplicate booking/refund/ticket/action.
- **Where:** `idempotency_key`, dedup on writes, request fingerprinting.
- **ContextOS:** Action plane → /docs/foundations/adapter-mesh

### 25 — Durable execution · P1
- **Q:** Can long-running tasks resume after failure?
- **Pass:** Checkpoint + replay mechanism, resumable workflow ID.
- **Fail:** Failure requires restarting from the user prompt.
- **Where:** durable workflow engine (Temporal/Workflow DevKit), checkpointers, resume-by-id.
- **ContextOS:** Decision plane → /docs/foundations/orchestration

### 36 — Replayability · P0
- **Q:** Can a past run be reconstructed?
- **Pass:** Pinned inputs, context, tool outputs, policies, model version, evaluator version.
- **Fail:** Historical trace cannot be replayed.
- **Where:** stored run records, replay tooling, pinned snapshots/hashes.
- **ContextOS:** Trust plane → /docs/implementation/decision-record

### 37 — Rollback and compensation · P0
- **Q:** Can damage be stopped or reversed?
- **Pass:** Rollback command, previous release tuple, compensation path for writes.
- **Fail:** Rollback means "ask people not to use it."
- **Where:** compensating actions, reversal tokens, "undo"/"refund"/"cancel" paths, feature flags.
- **ContextOS:** Action/Trust → /docs/reference/failure-playbooks

### 35 — Release tuple · P0
- **Q:** Are all moving parts versioned together?
- **Pass:** Tuple: prompt, model, policy, tools, context pack, eval suite, memory schema.
- **Fail:** Prompt, model, and tool changes tracked separately.
- **Where:** release/version manifest, deployment config pinning all components together.
- **ContextOS:** Trust plane → /docs/foundations/improvement-loop

---

## Measurable
*Owning plane: Trust (metrics). Doc: /docs/reference/metrics-glossary*

### 32 — Cost and latency controls · P1
- **Q:** Are token, tool, and runtime costs bounded?
- **Pass:** Budget policy, per-intent cost, latency SLO, timeout behavior.
- **Fail:** Agent loops until budget is exhausted.
- **Where:** token/cost accounting, `max_steps`/`max_iterations`, timeouts, loop guards.
- **ContextOS:** Trust plane → /docs/reference/metrics-glossary

### 33 — Model/provider routing · P1
- **Q:** Is model choice explicit and measurable?
- **Pass:** Model routing policy, fallback model, quality/cost/latency comparison.
- **Fail:** Model changed without a traceable release.
- **Where:** model config, router/gateway, fallback declarations.
- **ContextOS:** Trust plane → /docs/reference/ai-gateway-llm-router

### 34 — Fallback behavior · P1
- **Q:** What happens when model, tool, policy, or eval fails?
- **Pass:** Typed fallback: retry, degrade, ask user, escalate, abort.
- **Fail:** Agent produces a generic apology or retries blindly.
- **Where:** error handling around model/tool calls, `try/except`, retry/backoff, fallback branches.
- **ContextOS:** Trust plane → /docs/reference/failure-playbooks

### 39 — Business measurement · P1
- **Q:** Are agent outcomes tied to real impact?
- **Pass:** Task success, conversion, deflection, CSAT, revenue, risk, cost by intent/version.
- **Fail:** Only number of chats and thumbs-up are tracked.
- **Where:** analytics/metrics emission, outcome tracking, business KPI wiring.
- **ContextOS:** Trust plane → /docs/reference/metrics-glossary

### 22 — Escalation path · P1
- **Q:** Can the agent hand off cleanly when confidence or risk is low?
- **Pass:** Escalation policy, queue, reason code, transcript + context package.
- **Fail:** Agent keeps trying after repeated failure.
- **Where:** handoff/escalation logic, "transfer to human", confidence thresholds.
- **ContextOS:** Decision/Trust → /docs/foundations/orchestration

---

## Continuously improving
*Owning plane: Trust (improvement loop). Doc: /docs/foundations/improvement-loop*

### 38 — Incident response · P0
- **Q:** Is there an agent-specific incident playbook?
- **Pass:** Severity matrix, owner, kill switch, escalation channel, postmortem template.
- **Fail:** No one knows who owns a bad agent action.
- **Where:** runbooks/`incident`/`oncall` docs, kill-switch/feature-flag for the agent.
- **ContextOS:** Trust plane → /docs/reference/failure-playbooks

### 40 — Continuous improvement · P1
- **Q:** Do failures become governed improvements?
- **Pass:** correction → proposal → replay → review → approval → promotion → live monitoring.
- **Fail:** Fixes happen as unreviewed prompt edits.
- **Where:** feedback/correction pipeline, eval-gated promotion, golden-set growth process.
- **ContextOS:** Trust plane → /docs/foundations/improvement-loop

---

## Dependency order for the fix queue

Fix the most load-bearing failure first; these unblock the rest:

| If this fails | It usually blocks |
|---|---|
| Agent charter (#1) | Autonomy, policy, release governance |
| Context compiler (#6) | Grounding, validation, observability, replay |
| Policy engine (#12) | Tool control, approval, privacy, compliance |
| Identity & authorization (#18) | Tool safety, incident response, audit |
| Observability (#30) | Replay, rollback, measurement, incident analysis |
| Release tuple (#35) | Offline evals, rollback, regression management |
| Continuous improvement (#40) | Sustainable quality and post-incident repair |
