# The 44-Control Harness Audit Checklist

The rubric for the audit. Every control has: the audit question, minimum **Pass**
evidence, the immediate **Fail** signal, severity, where to look, and the
ContextOS plane + doc that owns the remediation. Controls are grouped by the
eight outcome properties so the scores roll up directly.

Scoring: **Pass** = an artifact proves it for a real path (cite `path:line`).
**Partial** = exists but incomplete/manual/delayed/wrong-boundary. **Fail** =
absent, unenforced, unverifiable, or prose-only. Five-minute rule: evidence you
can't find in ~5 min scores Fail. Severity is independent of pass state.

## Evidence rules

Judge the complete enforcement chain, not isolated artifacts:

1. **Behavioral evidence (strongest):** a version-linked production trace or a
   boundary/integration test shows the control allow and deny the right paths.
2. **Wiring evidence:** the real entry point calls the control before the
   protected boundary, and no obvious bypass path exists.
3. **Definition evidence:** a policy, schema, helper, manifest, or dependency
   exists but may not be loaded or invoked.
4. **Assertion (weakest):** prose, diagrams, prompts, comments, or model
   self-reports say the control exists.

A Pass normally requires levels 1 + 2. A declarative platform binding may
replace level 1 only when the binding is loaded by the deployed runtime and
makes bypass impossible. Definition evidence alone is at most Partial;
assertion alone is Fail. A unit test of a helper proves the helper, not runtime
wiring. A stale or release-unknown trace cannot prove the current release.

Apply these tie-breakers:

- Score conflicting evidence at the weaker level and explain the conflict.
- Score sampled coverage Partial unless the sample is demonstrably exhaustive.
- Treat inaccessible external controls as **Unverified → Fail for launch** and
  state what evidence would verify them.
- Use **N/A** only where a control explicitly allows it (#43 for a confirmed
  single-agent harness). A missing feature is otherwise Fail, not N/A.
- Redact secrets, PII, and sensitive arguments in citations. Cite the smallest
  safe line range or trace event identifier that still proves the claim.

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

### 42 — Outbound disclosure control · P0
- **Q:** Is what *leaves* the agent — final answers, tool arguments, inter-agent handoffs, forwarded content — checked against data class, not just against who the recipient is?
- **Pass:** Sensitive fields are minimized/redacted before they enter a tool argument, a message to another agent/component, or the final response; an egress check proves a classified field did not reach an unauthorized sink. Disclosure decisions are logged. (Routing the message to an authorized recipient is necessary but not sufficient — the *payload* must also be in scope.)
- **Fail:** The recipient is permitted but the content is over-shared — PII, secrets, or out-of-scope records flow through handoff context, tool args, or the final answer unfiltered.
- **Where:** output guardrails, handoff/context-passing code, message construction between agents, redaction applied to *outbound* content (not just data at rest). Pairs with data classification (#13) and privacy controls (#14).
- **ContextOS:** Trust plane → /docs/foundations/governance

### 43 — Inter-agent communication policy · P0 *(multi-agent only)*
- **Q:** In a multi-agent harness, are who-may-talk-to-whom, who-owns-which-tools, and who-may-delegate-what declared and enforced?
- **Pass:** Communication topology (allowed role→role channels), role-local authority (which role owns which tools and decisions), and delegation boundaries are explicit and enforced — a spoke cannot invoke a hub-only tool; a role cannot message a peer outside the topology; a coordinator delegates rather than executing specialist actions itself.
- **Fail:** Any agent can call any tool or message any agent; a hub oversteps by executing what it should delegate. Coordination expands the risk surface without a matching control.
- **Where:** multi-agent graph edges, handoff/`transfer`/`delegate` definitions, per-sub-agent tool grants, role-to-tool scoping. _If the harness is genuinely single-agent, mark **N/A** and say so._
- **ContextOS:** Trust/Decision → /docs/foundations/governance, /docs/foundations/orchestration

---

## Tool-controlled
*Owning planes: Action (tools), Trust (identity/secrets). Docs:*
*/docs/foundations/adapter-mesh, /docs/foundations/identity-layer*

### 15 — Tool manifest · P0
- **Q:** Are available tools declared, versioned, owned, and scoped to least privilege?
- **Pass:** Tool manifest with schema, owner, risk class, timeout, retry, auth mode — and the tool surface is scoped to what the role/intent actually needs (an unused or over-broad tool grant is a control gap, not a convenience).
- **Fail:** Tool list lives only in the prompt, or every agent gets the full toolbox regardless of task.
- **Where:** tool/function definitions, `@tool`, MCP server config, tool registry, per-role/per-intent tool grants.
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

### 41 — Resource/object scope binding · P0
- **Q:** Are tool calls bound to an *authorized set of objects*, not merely a valid schema?
- **Pass:** Write/read tools resolve the target object (customer, account, record, file, ticket, matter) against a per-task or per-user authorized scope — allowlist, ownership/tenancy check, or scope derived from the task — enforced outside the model. Out-of-scope object access is denied and logged with the attempted ID.
- **Fail:** A schema-valid call can act on any ID the model emits — the *right tool on the wrong customer / file / record* passes unchecked. This is the most common live boundary violation: agents rarely pick an obviously wrong tool, they apply a reasonable tool to an out-of-scope object.
- **Where:** authorization *beyond* type validation — ownership/tenancy checks, row-level security, scoped queries, `account_id`/`user_id`/`file_path`/`record_id` binding; NOT a Pydantic/zod type check that only proves the argument is well-formed.
- **ContextOS:** Action/Trust → /docs/foundations/adapter-mesh, /docs/foundations/identity-layer

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
- **Pass:** Expected vs actual tool trajectory scored on all four axes — **coverage** (every needed tool was called), **precision** (no out-of-set tools invoked), **resource scope** (correct object/argument values, not just the right tool), and **minimality** (no redundant repeated calls).
- **Fail:** Final answer judged "good" despite a wrong process — or judged on output alone with no path assertion.
- **Where:** eval harness asserting tool-call sequences, step-level and argument-level scoring.
- **ContextOS:** Trust plane → /docs/foundations/evaluation-observability

### 28 — Online validation · P0
- **Q:** Can bad outputs be blocked at runtime?
- **Pass:** Live critic/evaluator, policy-respect check, safety/utility score before finalization.
- **Fail:** Evals run only weekly/monthly/offline.
- **Where:** output guardrails, post-generation critic, pre-return validation hooks.
- **ContextOS:** Trust plane → /docs/foundations/evaluation-observability

### 29 — Red-team coverage · P0
- **Q:** Is the harness tested against adversarial behavior *and* realistic perturbation, not just happy-path queries?
- **Pass:** Test suites span the three stressors that break harnesses in production: **(a) indirect injection** — a hidden instruction or planted canary in tool/document output does not propagate and induces no boundary crossing; **(b) ambiguous/underspecified goals** — the agent pauses for clarification or safely defers instead of taking an irreversible action on a guess; **(c) tool/runtime errors** — covered by honest-failure behavior (#44). Plus the classics: tool-abuse, data-leakage, jailbreak.
- **Fail:** Only happy-path demo queries are tested; injection and ambiguity are untested.
- **Where:** `redteam`/`adversarial`/`injection` tests, security test dirs, ambiguity/clarification fixtures.
- **ContextOS:** Trust plane → /docs/foundations/evaluation-observability, /docs/security

### 44 — Honest failure under tool error · P1
- **Q:** When a tool or backend misbehaves, does the agent report failure instead of fabricating success?
- **Pass:** On a tool error, empty result, or junk return, the agent acknowledges the failure in its output or state and either retries within scope or safely defers — verifiable from a boundary trace where a tool actually returned an error.
- **Fail:** The agent invents a result, claims completion with no supporting tool call, or takes an out-of-scope action after the failure.
- **Where:** error handling around tools, fallback branches (#34), and a boundary trace exercising a tool error; check the final answer against what the tools actually returned.
- **ContextOS:** Trust plane → /docs/reference/failure-playbooks

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
| Identity & authorization (#18) | Tool safety, resource-scope binding, incident response, audit |
| Resource/object scope binding (#41) | Trustworthy writes, disclosure control, tenancy isolation |
| Inter-agent communication policy (#43) | Outbound disclosure, role-local authority, multi-agent safety |
| Observability (#30) | Replay, rollback, measurement, incident analysis |
| Release tuple (#35) | Offline evals, rollback, regression management |
| Continuous improvement (#40) | Sustainable quality and post-incident repair |
