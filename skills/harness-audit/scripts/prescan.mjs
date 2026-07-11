#!/usr/bin/env node
/**
 * Harness Audit — deterministic prescan.
 *
 * Walks a target repository and locates CANDIDATE evidence for the 44 harness
 * controls, plus — more usefully — lists controls for which it found NO signal
 * at all (likely Fails worth confirming first). It never decides Pass/Fail:
 * a keyword match is a lead, not a control. The auditing agent must open each
 * hit and confirm the control is actually enforced at the right boundary.
 *
 * Usage:  node prescan.mjs [target-path]   (defaults to cwd)
 * Output: Markdown to stdout. Dependency-free (Node built-ins only).
 */

import fs from "node:fs"
import path from "node:path"

const target = path.resolve(process.argv[2] || process.cwd())

const IGNORE_DIRS = new Set([
  "node_modules", ".git", ".next", "dist", "build", "out", "coverage",
  ".venv", "venv", "__pycache__", ".turbo", ".cache", "vendor", ".idea",
  ".pytest_cache", ".mypy_cache", "target", "bin", "obj",
])
const TEXT_EXT = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".rb", ".go", ".rs",
  ".java", ".kt", ".cs", ".php", ".json", ".yaml", ".yml", ".toml",
  ".md", ".mdx", ".txt", ".ini", ".cfg", ".sh",
])
const MAX_FILE_BYTES = 512 * 1024
const MAX_FILES = 30000
const MAX_HITS = 6

// signal: control number/label + a high-signal regex + a noise note.
const SIGNALS = [
  { c: "1", label: "Agent charter / AgentSpec", re: /\b(agentspec|agent[_-]?charter|allowed_intents|denied_intents|autonomy[_-]?class)\b/i },
  { c: "2", label: "Autonomy boundary", re: /\b(autonomy|execute_with_approval|execute_directly|can_execute|action_class)\b/i },
  { c: "3", label: "Intent taxonomy", re: /\b(intent_id|intent_router|classify_intent|route_intent)\b/i },
  { c: "4", label: "Planner/executor split", re: /\b(planner|plan_and_execute|create_react_agent|StateGraph|plan_node|executor_node)\b/ },
  { c: "5", label: "Context source registry", re: /\b(source_registry|context_sources?|retriever_registry|data_sources?)\b/i },
  { c: "6", label: "Context compiler", re: /\b(compiled?_?context|build_prompt|assemble_context|context_pack|source_hashes?)\b/i },
  { c: "7", label: "Grounding / citations", re: /\b(citation|citations|grounding|source_id|evidence_ref)\b/i },
  { c: "8", label: "Context budget / truncation", re: /\b(truncat|token_budget|max_tokens|context_window|trim_messages)\b/i },
  { c: "9", label: "Memory read policy", re: /\b(mem0|long_?term_?memory|memory_store|recall|memory_query|load_memory)\b/i },
  { c: "10", label: "Memory write policy", re: /\b(persist_memory|save_memory|memory.*upsert|write_proposal|memory_ttl)\b/i },
  { c: "11", label: "Memory contradiction handling", re: /\b(supersede|memory_conflict|resolve_conflict|consolidat|source_confidence)\b/i },
  { c: "12", label: "Policy engine (outside model)", re: /\b(opa|open_policy_agent|cedar|rego|policy_decision|policy_bundle|guardrail)\b/i },
  { c: "13", label: "Data classification", re: /\b(data_class|classif|\bpii\b|confidential|regulatory)\b/i },
  { c: "14", label: "Privacy controls", re: /\b(redact|mask_pii|retention|gdpr|purpose_limitation|delete_user_data)\b/i },
  { c: "15", label: "Tool manifest", re: /(@tool\b|FunctionTool|StructuredTool|tool_registry|tools\s*[:=]\s*\[)/ },
  { c: "16", label: "Tool gateway / arg validation", re: /\b(tool_gateway|validate_args|tool_dispatch|before_tool|ToolExecutor)\b/i },
  { c: "17", label: "Tool risk class / side-effect", re: /\b(risk_class|side_effect|destructive|approval_mode|dangerous)\b/i },
  { c: "18", label: "Identity / authorization", re: /\b(rbac|abac|spiffe|oauth2?|oidc|scoped_token|authorize|principal)\b/i },
  { c: "19", label: "Secret handling / vault", re: /\b(vault|secret_manager|secrets_manager|keyvault)\b/i },
  { c: "20", label: "Network / sandbox controls", re: /\b(sandbox|egress|allowlist|firecracker|seccomp|network_policy|exec\()\b/i },
  { c: "21", label: "Human approval / HITL", re: /\b(human_in_the_loop|require_approval|HumanApproval|interrupt\(|approval_gate|await.*approv)/i },
  { c: "22", label: "Escalation / handoff", re: /\b(escalat|handoff|handoff_to|transfer_to_human)\b/i },
  { c: "23", label: "State machine", re: /\b(checkpoint|state_transition|event_log|StateGraph|current_state)\b/i },
  { c: "25", label: "Durable execution", re: /\b(Temporal|durable|resume_by|workflow_id|resumable)\b/i },
  { c: "24", label: "Idempotency", re: /\b(idempoten|dedup|duplicate_detect|request_fingerprint)\b/i },
  { c: "26", label: "Offline evals", re: /\b(promptfoo|deepeval|ragas|braintrust|golden_set|regression_suite|eval_dataset)\b/i },
  { c: "27", label: "Trajectory evals", re: /\b(trajectory|expected_tools?|tool_sequence|resource_scope|tool_precision)\b/i },
  { c: "28", label: "Online validation / critic", re: /\b(critic|output_guardrail|validate_output|safety_score|moderation)\b/i },
  { c: "29", label: "Red-team coverage", re: /\b(red_?team|prompt_injection|jailbreak|adversarial)\b/i },
  { c: "30", label: "Observability / tracing", re: /\b(opentelemetry|start_as_current_span|get_tracer|langfuse|traceloop|arize|phoenix)\b/i },
  { c: "31", label: "Correlated telemetry IDs", re: /\b(trace_id|run_id|session_id|correlation_id|tool_call_id)\b/ },
  { c: "32", label: "Cost / latency / loop guards", re: /\b(max_iterations|max_steps|recursion_limit|timeout|token_budget|cost_cents)\b/i },
  { c: "33", label: "Model routing / fallback model", re: /\b(model_router|fallback_model|llm_router|provider_fallback|ai_gateway)\b/i },
  { c: "34", label: "Fallback behavior", re: /\b(fallback|degrade|retry|backoff)\b/i },
  { c: "35", label: "Release tuple / versioning", re: /\b(release_tuple|prompt_version|pack_version|model_version|version_manifest)\b/i },
  { c: "36", label: "Replayability", re: /\b(replay|replay_bundle|pinned_inputs|snapshot_hash|reconstruct)\b/i },
  { c: "37", label: "Rollback / compensation / kill switch", re: /\b(rollback|compensat|reversal|kill_switch|feature_flag)\b/i },
  { c: "38", label: "Incident response", re: /\b(incident|runbook|oncall|on_call|postmortem|severity_matrix)\b/i },
  { c: "39", label: "Business measurement", re: /\b(csat|deflection|conversion|task_success|business_metric)\b/i },
  { c: "40", label: "Continuous improvement loop", re: /\b(improvement_loop|promotion_gate|correction|proposal_review|promote)\b/i },
  { c: "41", label: "Resource/object scope binding", re: /\b(row_level_security|\brls\b|tenant_id|owner_id|authorize_resource|scope_check|belongs_to|ownership|is_authorized_for)\b/i },
  { c: "42", label: "Outbound disclosure / egress redaction", re: /\b(redact_output|sanitize_output|scrub|egress_filter|minimi[sz]e|data_leak|leak_check|filter_response)\b/i },
  { c: "43", label: "Inter-agent communication policy", re: /\b(handoff|delegate_to|transfer_to|sub_?agent|swarm|communication_policy|allowed_recipients|agent_graph|can_handoff)\b/i },
  { c: "44", label: "Honest failure under tool error", re: /\b(on_tool_error|tool_error|acknowledge_failure|no_fabricat|honest|fallback_on_error|surface_error)\b/i },
]

const hits = new Map(SIGNALS.map((s) => [s.label, []]))
let filesScanned = 0
let filesSkipped = 0

if (!fs.existsSync(target)) {
  process.stderr.write(`prescan: target does not exist: ${target}\n`)
  process.exit(2)
}
if (!fs.statSync(target).isDirectory()) {
  process.stderr.write(`prescan: target must be a directory: ${target}\n`)
  process.exit(2)
}

function artifactKind(rel) {
  const p = rel.toLowerCase()
  if (/(^|\/)(prescan|scanner|lint|audit-rules?)\.[^/]+$/.test(p)) return "static-analysis lead"
  if (/(^|\/)(test|tests|spec|specs|evals?|redteam|fixtures?)(\/|$)|\.(test|spec)\./.test(p)) return "test/eval"
  if (/(^|\/)(traces?|logs?|runs?|telemetry)(\/|$)/.test(p)) return "trace/log"
  if (/\.(md|mdx|txt)$/.test(p) || /(^|\/)(docs?|runbooks?)(\/|$)/.test(p)) return "docs/assertion"
  if (/\.(ya?ml|json|toml|ini|cfg)$/.test(p) || /(^|\/)(config|policies|manifests?)(\/|$)/.test(p)) return "config/definition"
  return "code/wiring"
}

function safeSnippet(line) {
  return line
    .replace(/\b(AKIA|ASIA)[A-Z0-9]{16}\b/g, "[REDACTED_AWS_KEY]")
    .replace(/\b(sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})\b/g, "[REDACTED_TOKEN]")
    .replace(/\b(password|passwd|secret|api[_-]?key|access[_-]?token|authorization)\b(\s*[:=]\s*)["']?[^\s,"'}]+/ig, "$1$2[REDACTED]")
    .trim()
    .slice(0, 160)
}

function walk(dir) {
  if (filesScanned >= MAX_FILES) return
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (filesScanned >= MAX_FILES) return
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name) || e.name.startsWith(".") && e.name !== ".github") continue
      walk(full)
    } else if (e.isFile()) {
      const ext = path.extname(e.name).toLowerCase()
      const isEnv = e.name.startsWith(".env")
      if (isEnv || /(^|\.)env(\.|$)/i.test(e.name) || /\.lock$/i.test(e.name)) {
        filesSkipped++
        continue
      }
      if (!TEXT_EXT.has(ext)) continue
      scanFile(full)
    }
  }
}

function scanFile(file) {
  let stat
  try {
    stat = fs.statSync(file)
  } catch {
    return
  }
  if (stat.size > MAX_FILE_BYTES) {
    filesSkipped++
    return
  }
  let text
  try {
    text = fs.readFileSync(file, "utf8")
  } catch {
    filesSkipped++
    return
  }
  if (text.includes("\0")) {
    filesSkipped++
    return
  }
  filesScanned++
  const rel = path.relative(target, file)
  const lines = text.split("\n")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.length > 600) continue
    for (const s of SIGNALS) {
      const arr = hits.get(s.label)
      if (arr.length >= MAX_HITS) continue
      if (s.re.test(line)) {
        arr.push({ ref: `${rel}:${i + 1}`, kind: artifactKind(rel), snippet: safeSnippet(line) })
      }
    }
  }
}

function detectFramework() {
  const reads = (p) => {
    try {
      return fs.readFileSync(path.join(target, p), "utf8")
    } catch {
      return ""
    }
  }
  const blob = (reads("package.json") + reads("pyproject.toml") + reads("requirements.txt")).toLowerCase()
  const fw = []
  if (/langgraph/.test(blob)) fw.push("LangGraph")
  if (/langchain/.test(blob)) fw.push("LangChain")
  if (/openai-agents|openai_agents|agents-sdk/.test(blob)) fw.push("OpenAI Agents SDK")
  if (/google-adk|google_adk|\badk\b/.test(blob)) fw.push("Google ADK")
  if (/crewai/.test(blob)) fw.push("CrewAI")
  if (/semantic-kernel|semantic_kernel/.test(blob)) fw.push("Semantic Kernel")
  if (/mastra/.test(blob)) fw.push("Mastra")
  if (/autogen/.test(blob)) fw.push("AutoGen")
  return fw.length ? fw.join(", ") : "unknown / custom"
}

// ── Run ──
walk(target)

const found = SIGNALS.filter((s) => hits.get(s.label).length > 0)
const missing = SIGNALS.filter((s) => hits.get(s.label).length === 0)

const out = []
out.push(`# Harness Audit — prescan`)
out.push("")
out.push(`- **Target:** \`${target}\``)
out.push(`- **Detected framework:** ${detectFramework()}`)
const maHits = hits.get("Inter-agent communication policy")
const maRuntimeHits = maHits.filter((h) => !["docs/assertion", "static-analysis lead"].includes(h.kind)).length
out.push(`- **Topology candidate:** ${maRuntimeHits > 0 ? `possible multi-agent (${maRuntimeHits} non-doc signal(s)); confirm from runtime graph before scoring #43` : "no non-doc multi-agent signal; confirm single-agent before marking #43 N/A"}`)
out.push(`- **Files scanned:** ${filesScanned}${filesScanned >= MAX_FILES ? " (capped)" : ""}`)
out.push(`- **Files skipped:** ${filesSkipped} (dotenv, lock, oversized, unreadable, or binary)`)
out.push("")
out.push(`> Candidate evidence only. A match is a lead, not a Pass — open each and`)
out.push(`> confirm the control is enforced at the right boundary. Controls with NO`)
out.push(`> signal are listed last; treat them as likely Fails to confirm first.`)
out.push("")

out.push(`## Candidate evidence found (${found.length} signals)`)
out.push("")
for (const s of found) {
  out.push(`### [${s.c}] ${s.label} — ${hits.get(s.label).length} hit(s)`)
  for (const h of hits.get(s.label)) out.push(`- **${h.kind}:** \`${h.ref}\` — \`${h.snippet}\``)
  out.push("")
}

out.push(`## No signal found — confirm these first (${missing.length} signals)`)
out.push("")
out.push(`Likely Fails. The prescan found no candidate evidence for:`)
out.push("")
for (const s of missing) out.push(`- **[${s.c}] ${s.label}**`)
out.push("")
out.push(`---`)
out.push(`Next: open \`reference/checklist.md\` and score all 44 controls. No artifact, no pass.`)

process.stdout.write(out.join("\n") + "\n")
