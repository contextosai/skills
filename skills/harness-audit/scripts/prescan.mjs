#!/usr/bin/env node
/**
 * Harness Audit prescan v3.
 *
 * Builds a deterministic map of candidate capabilities, trust boundaries,
 * assurance evidence, and bypass hotspots. It never assigns audit status.
 *
 * Usage: node prescan.mjs [target-path] [--json]
 */

import fs from "node:fs"
import path from "node:path"

const args = process.argv.slice(2)
if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write("Usage: node prescan.mjs [target-path] [--json]\n")
  process.exit(0)
}
const unknownFlags = args.filter((arg) => arg.startsWith("-") && arg !== "--json")
if (unknownFlags.length) {
  process.stderr.write(`prescan: unknown option: ${unknownFlags[0]}\n`)
  process.exit(2)
}
const positional = args.filter((arg) => !arg.startsWith("-"))
if (positional.length > 1) {
  process.stderr.write("prescan: expected at most one target path\n")
  process.exit(2)
}

const target = path.resolve(positional[0] || process.cwd())
const jsonOutput = args.includes("--json")

const IGNORE_DIRS = new Set([
  ".git", ".next", ".turbo", ".cache", ".idea", ".pytest_cache",
  ".mypy_cache", ".venv", "venv", "node_modules", "vendor", "dist",
  "build", "out", "coverage", "target", "bin", "obj", "__pycache__",
])
const TEXT_EXTENSIONS = new Set([
  ".c", ".cc", ".cfg", ".cjs", ".cpp", ".cs", ".go", ".h", ".hpp",
  ".gradle", ".hcl", ".ini", ".java", ".js", ".json", ".jsx", ".kt",
  ".md", ".mdx", ".mjs", ".mod", ".php", ".prompt", ".properties",
  ".py", ".rb", ".rego", ".rs", ".sh", ".sql", ".tf", ".toml", ".ts",
  ".tsx", ".txt", ".xml", ".yaml", ".yml",
])
const TEXT_FILENAMES = new Set(["dockerfile", "gemfile", "makefile", "procfile"])
const MAX_FILE_BYTES = 512 * 1024
const MAX_FILES = 30_000
const MAX_HITS_PER_SIGNAL = 6

const CAPABILITIES = [
  {
    id: "M1", label: "Untrusted retrieval and content",
    detail: "External documents, web content, messages, uploads, or tool output may enter model context.",
    re: /\b(retriev|rag\b|vector[_-]?(store|search)|web[_-]?(search|fetch)|browser|scrape|crawl|user[_-]?upload|attachment|tool[_-]?(result|output)|mcp)\b/i,
  },
  {
    id: "M2", label: "Persistent memory",
    detail: "Cross-session or durable agent memory may be read, written, or deleted.",
    re: /\b(long[_-]?term[_-]?memory|memory[_-]?(store|write|read|query)|recall|remember|persist[_-]?memory|save[_-]?memory|memory\.(upsert|add|delete))\b/i,
  },
  {
    id: "M3", label: "Side effects and outbound actions",
    detail: "Tools may mutate external state or communicate outside the harness.",
    re: /\b(send[_-]?(email|message)|publish|post[_-]?message|create[_-]?(ticket|order|booking)|update[_-]?(record|account)|delete[_-]?(record|file)|refund|payment|transfer|cancel[_-]?(order|booking)|side[_-]?effect|write[_-]?tool)\b/i,
  },
  {
    id: "M4", label: "General-purpose compute and network",
    detail: "The agent may execute code, operate a browser/computer, broadly mutate files, or influence network destinations.",
    re: /\b(computer[_-]?use|browser[_-]?use|playwright|puppeteer|selenium|shell[_-]?tool|code[_-]?(exec|interpreter)|subprocess|child_process|execFile|spawn\(|fetch\(|axios\.|requests\.|httpx\.|filesystem|writeFile)\b/i,
  },
  {
    id: "M5", label: "Sensitive or multi-tenant data",
    detail: "Sensitive, identity-bound, or tenant-scoped data may be reachable.",
    re: /\b(pii|phi\b|pci\b|confidential|sensitive|tenant[_-]?id|organization[_-]?id|customer[_-]?id|account[_-]?id|row[_-]?level[_-]?security|\brls\b|data[_-]?class)\b/i,
  },
  {
    id: "M6", label: "Multi-agent and delegation",
    detail: "Agents may delegate, hand off, spawn peers, or exchange context.",
    re: /\b(sub[_-]?agent|multi[_-]?agent|handoff|delegate[_-]?to|transfer[_-]?to|spawn[_-]?agent|agent[_-]?graph|swarm|peer[_-]?agent|a2a)\b/i,
  },
  {
    id: "M7", label: "Human approval",
    detail: "A human may authorize, edit, or supervise an action.",
    re: /\b(require[_-]?approval|approval[_-]?(gate|request|decision)|human[_-]?(approval|in[_-]?the[_-]?loop)|interrupt\(|approver|await.*approv)\b/i,
  },
  {
    id: "M8", label: "Long-running or unattended operation",
    detail: "Runs may persist, resume, recur, retry, or operate asynchronously.",
    re: /\b(checkpoint|resume[_-]?(run|workflow)|workflow[_-]?id|durable|temporal|cron\b|schedule[_-]?job|background[_-]?worker|retry[_-]?(queue|policy)|lease[_-]?id)\b/i,
  },
  {
    id: "M9", label: "Skills, plugins, MCP, and behavior extensions",
    detail: "Runtime behavior may be changed by skills, plugins, hooks, connectors, MCP servers, marketplaces, or dynamically loaded packages.",
    re: /\b(skill[_-]?(bundle|manifest|registry|loader)|plugin[_-]?(manifest|registry|loader|install)|marketplace|mcp[_-]?(server|client|manifest)|tool[_-]?description|pre[_-]?tool[_-]?hook|post[_-]?tool[_-]?hook|dynamic[_-]?(import|tool)|extension[_-]?(manifest|registry|install))\b/i,
  },
]

const SURFACES = [
  { id: "B1", label: "Principal and entry points", re: /\b(authenticated[_-]?user|principal|user[_-]?id|session[_-]?id|request[_-]?handler|route\(|endpoint|webhook|cli\b)\b/i },
  { id: "B2", label: "Model and prompt assembly", re: /\b(responses\.create|chat\.completions|generateContent|model\.invoke|agent\.run|system[_-]?prompt|build[_-]?prompt|assemble[_-]?context|messages\s*[:=])\b/i },
  { id: "B3", label: "Tool and delegation dispatch", re: /\b(tool[_-]?(dispatch|execute|gateway|registry|call)|function[_-]?call|mcp[_-]?(server|client)|handoff|delegate|transfer[_-]?to)\b/i },
  { id: "B4", label: "Policy, identity, and approval", re: /\b(authori[sz]e|policy[_-]?(decision|check|engine)|rbac|abac|cedar|rego\b|opa\b|scope[_-]?check|require[_-]?approval|approver)\b/i },
  { id: "B5", label: "Context, retrieval, and memory", re: /\b(retriev|vector[_-]?store|context[_-]?(pack|source|compiler)|memory[_-]?(store|write|read)|recall|embedding)\b/i },
  { id: "B6", label: "External sinks and state", re: /\b(database|repository|storage|send[_-]?(email|message)|publish|payment|refund|writeFile|fetch\(|axios\.|requests\.|tool[_-]?result)\b/i },
  { id: "B7", label: "Telemetry and release", re: /\b(trace[_-]?id|span[_-]?id|run[_-]?id|opentelemetry|audit[_-]?log|release[_-]?(tuple|manifest)|prompt[_-]?version|policy[_-]?version|model[_-]?version)\b/i },
  { id: "B8", label: "Evaluation and recovery", re: /\b(boundary[_-]?test|adversarial|red[_-]?team|prompt[_-]?injection|eval[_-]?(suite|dataset)|state[_-]?diff|rollback|compensat|kill[_-]?switch|fault[_-]?inject)\b/i },
  { id: "B9", label: "Instruction and extension supply chain", re: /\b(system[_-]?prompt|developer[_-]?prompt|agents\.md|claude\.md|instruction[_-]?(surface|registry|precedence)|skill[_-]?(bundle|manifest)|plugin[_-]?(manifest|install)|marketplace|extension[_-]?(lock|manifest)|mcp[_-]?(manifest|server)|hook[_-]?(config|policy))\b/i },
]

const ASSURANCE_LEADS = [
  { id: "C1", label: "Authority continuity and intent", re: /\b(principal|workload[_-]?identity|delegat|allowed[_-]?intent|intent[_-]?id|scope[_-]?check|resource[_-]?audience|claim[_-]?hash|expires[_-]?at|revocation|clarif|business[_-]?purpose)\b/i },
  { id: "C2", label: "Complete mediation and capability admission", re: /\b(tool[_-]?gateway|capability[_-]?(admission|manifest)|before[_-]?tool|policy[_-]?decision|normalize[_-]?(args|effect)|validate[_-]?(args|tool)|authori[sz]e[_-]?(resource|action)|reference[_-]?monitor)\b/i },
  { id: "C3", label: "Trust, instruction, and supply-chain separation", re: /\b(untrusted|prompt[_-]?injection|instruction[_-]?(surface|hierarchy|precedence|registry)|source[_-]?provenance|transformation[_-]?lineage|trust[_-]?(label|level)|skill[_-]?lift|extension[_-]?provenance|taint|canary)\b/i },
  { id: "C4", label: "Information and state lifecycle integrity", re: /\b(data[_-]?class|purpose[_-]?limitation|retention|redact|tenant[_-]?id|memory[_-]?(ttl|write|delete|promotion|quarantine)|selective[_-]?(delete|repair)|benign[_-]?preservation|tombstone|forget)\b/i },
  { id: "C5", label: "Effect and outcome integrity", re: /\b(state[_-]?diff|verify[_-]?(outcome|result)|tool[_-]?error|partial[_-]?(failure|effect)|effect[_-]?(receipt|pending|observed)|postcondition|precondition|mutation[_-]?receipt|honest[_-]?failure|evidence[_-]?ref)\b/i },
  { id: "C6", label: "Containment, resilience, and recovery", re: /\b(idempoten|dedup|timeout|max[_-]?(steps|iterations|delegation)|budget|sandbox|egress|compensat|rollback|kill[_-]?switch|revocation[_-]?slo|circuit[_-]?breaker|verification[_-]?failed|recovered)\b/i },
  { id: "C7", label: "Reconstructability and release integrity", re: /\b(trace[_-]?id|audit[_-]?log|release[_-]?(tuple|manifest)|skill[_-]?bundle[_-]?sha|sandbox[_-]?profile|evaluator[_-]?(set|version)|portable[_-]?trajectory|atif\b|decision[_-]?record|tamper[_-]?evident|correlation[_-]?id)\b/i },
  { id: "C8", label: "Evaluation, oversight, and change governance", re: /\b(golden[_-]?set|held[_-]?out|eval[_-]?(suite|dataset)|red[_-]?team|adversarial|pass\^k|attack[_-]?success|useful[_-]?but[_-]?unsafe|skill[_-]?lift|promotion[_-]?gate|immutable[_-]?outer[_-]?loop|residual[_-]?risk|reviewer[_-]?false[_-]?negative|regression|llm[_-]?judge|human[_-]?label)\b/i },
]

const LIFECYCLE_PHASES = [
  { id: "L1", label: "Harness configuration", detail: "Setup, environment, defaults, credentials, policy bindings, and deployment overrides.", re: /\b(bootstrap|setup[_-]?config|environment[_-]?template|safe[_-]?default|permission[_-]?default|deployment[_-]?(config|override)|sandbox[_-]?profile|policy[_-]?(bundle|binding)|secret[_-]?injection)\b/i },
  { id: "L2", label: "Capability extension", detail: "Skills, plugins, hooks, MCP servers, marketplaces, connectors, and extension updates.", re: /\b(skill[_-]?(bundle|manifest|loader)|plugin[_-]?(manifest|install|update)|marketplace|mcp[_-]?(server|manifest)|extension[_-]?(lock|manifest|install|update)|hook[_-]?(config|policy)|package[_-]?provenance)\b/i },
  { id: "L3", label: "Runtime operation", detail: "Live instruction, context, identity, policy, tool, delegation, and information-flow decisions.", re: /\b(compiled[_-]?context|instruction[_-]?(surface|registry)|policy[_-]?decision|tool[_-]?(gateway|dispatch|call)|run[_-]?claim|principal[_-]?chain|prompt[_-]?injection|handoff|delegate)\b/i },
  { id: "L4", label: "State persistence", detail: "Memory, checkpoints, summaries, schedules, cached state, promotion, quarantine, and repair.", re: /\b(memory[_-]?(write|read|store|promotion|quarantine|repair)|checkpoint|persistent[_-]?state|scheduled[_-]?trigger|tombstone|selective[_-]?repair|benign[_-]?preservation|resume[_-]?(run|workflow))\b/i },
  { id: "L5", label: "Action and effect control", detail: "Authorization, normalization, approval, execution, postconditions, reconciliation, and compensation.", re: /\b(normalized[_-]?(effect|arguments)|approval[_-]?(request|receipt|gate)|idempoten|precondition|postcondition|effect[_-]?(receipt|pending|observed)|mutation[_-]?receipt|compensat|reconcil)\b/i },
  { id: "L6", label: "Incident recovery and promotion", detail: "Containment, revocation, evidence preservation, rollback, replay, canaries, and governed improvement.", re: /\b(incident[_-]?(response|playbook)|kill[_-]?switch|revoke|revocation|contain|evidence[_-]?preservation|rollback|replay|canary|promotion[_-]?gate|immutable[_-]?outer[_-]?loop|recovery[_-]?drill)\b/i },
]

const HOTSPOTS = [
  {
    id: "H1", label: "General-purpose execution primitive",
    detail: "Confirm that model-controlled input cannot reach shell, eval, process spawn, or unrestricted code execution.",
    re: /\b(eval\(|exec\(|execSync\(|spawn\(|subprocess\.(run|Popen|call)|os\.system\(|shell\s*[:=]\s*true|code[_-]?interpreter)\b/i,
  },
  {
    id: "H2", label: "Dynamic network destination",
    detail: "Confirm URL/host validation, DNS/IP controls, redirect handling, and egress policy before model-influenced requests.",
    re: /\b(fetch|axios\.(get|post|request)|requests\.(get|post|request)|httpx\.(get|post|request))\s*\(\s*[A-Za-z_$][\w.$\[\]-]*/i,
  },
  {
    id: "H3", label: "Broad or wildcard authority",
    detail: "Confirm wildcard grants and broad roles cannot reach sensitive resources or tools.",
    re: /(allowed_(tools|actions|resources)|permissions?|scopes?|resources?)\s*[:=]\s*[\[{'"\s]*(\*|all\b|admin\b)/i,
  },
  {
    id: "H4", label: "Credential near model, prompt, or log path",
    detail: "Confirm the secret is injected only into the adapter and never serialized into model-visible or logged data.",
    re: /\b(api[_-]?key|access[_-]?token|client[_-]?secret|authorization)\b.*\b(prompt|messages|context|trace|log|json\.stringify)/i,
  },
  {
    id: "H5", label: "Persistent memory write",
    detail: "Confirm source, purpose, tenant, sensitivity, consent, deduplication, and later repair are enforced before persistence.",
    re: /\b(memory|memories)\.(add|save|write|upsert|create)|\b(save|persist|write|upsert)[_-]?memory\b/i,
  },
  {
    id: "H6", label: "Sensitive payload logging",
    detail: "Confirm structured redaction occurs before trace/log export and raw tool arguments are access-controlled.",
    re: /\b(console\.log|logger\.(debug|info|warn|error)|logging\.(debug|info|warning|error)|span\.setAttribute)\s*\([^\n]*(prompt|messages|tool[_-]?(args|arguments)|authorization|token)/i,
  },
  {
    id: "H7", label: "Side effect without nearby idempotency signal",
    detail: "Inspect retries and partial failures; a line-level lead cannot prove idempotency is absent.",
    re: /\b(send[_-]?(email|message)|create[_-]?(order|booking|ticket)|refund|payment|transfer|delete[_-]?(record|file))\s*\(/i,
  },
  {
    id: "H8", label: "Dynamic capability or extension loading",
    detail: "Confirm runtime-loaded tools, skills, plugins, hooks, and MCP servers are admitted from a pinned bundle with declared permissions and revocation.",
    re: /\b(import\(|require\(|load[_-]?(plugin|skill|extension|tool)|install[_-]?(plugin|skill|extension)|register[_-]?(dynamic[_-]?)?(tool|plugin)|discover[_-]?(tools|plugins|skills))/i,
  },
  {
    id: "H9", label: "Token passthrough or generic agent identity",
    detail: "Confirm downstream calls use a short-lived audience-bound per-call credential and preserve agent, workload, and delegated principal separately.",
    re: /\b(token[_-]?passthrough|forward[_-]?(token|authorization)|shared[_-]?(service[_-]?)?(account|credential)|generic[_-]?(service[_-]?)?(account|principal)|parent[_-]?token)\b/i,
  },
  {
    id: "H10", label: "Self-modifying release or evaluator",
    detail: "Confirm an immutable outer loop owns authority, held-out data, evaluator versions, promotion, canary scope, rollback, and evidence retention.",
    re: /\b(self[_-]?(modify|improv|evolv)|auto[_-]?(tune|promote|deploy)|update[_-]?(prompt|policy|evaluator|threshold)|rewrite[_-]?(skill|prompt|policy)|candidate[_-]?promotion)\b/i,
  },
]

const FRAMEWORKS = [
  ["LangGraph", /\blanggraph\b/i],
  ["LangChain", /\blangchain\b/i],
  ["OpenAI Agents SDK", /\b(openai-agents|openai_agents|agents-sdk)\b/i],
  ["Google ADK", /\b(google-adk|google_adk)\b/i],
  ["CrewAI", /\bcrewai\b/i],
  ["Semantic Kernel", /\b(semantic-kernel|semantic_kernel)\b/i],
  ["Mastra", /\bmastra\b/i],
  ["AutoGen", /\b(autogen|pyautogen)\b/i],
]

if (!fs.existsSync(target)) {
  process.stderr.write(`prescan: target does not exist: ${target}\n`)
  process.exit(2)
}
if (!fs.statSync(target).isDirectory()) {
  process.stderr.write(`prescan: target must be a directory: ${target}\n`)
  process.exit(2)
}

function newHitMap(signals) {
  return new Map(signals.map((signal) => [signal.id, []]))
}

const capabilityHits = newHitMap(CAPABILITIES)
const surfaceHits = newHitMap(SURFACES)
const assuranceHits = newHitMap(ASSURANCE_LEADS)
const lifecycleHits = newHitMap(LIFECYCLE_PHASES)
const hotspotHits = newHitMap(HOTSPOTS)
const manifestText = []
let filesScanned = 0
let filesSkipped = 0
let scanCapped = false

function artifactKind(relativePath) {
  const value = relativePath.toLowerCase()
  if (/(^|\/)(prescan|scanner|audit-rules?|static-analysis)\.[^/]+$/.test(value)) return "static-analysis lead"
  if (/(^|\/)(test|tests|spec|specs|eval|evals|redteam|fixtures?)(\/|$)|\.(test|spec)\./.test(value)) return "test/eval"
  if (/(^|\/)(trace|traces|logs|runs|telemetry|incidents?)(\/|$)/.test(value)) return "trace/incident"
  if (/(^|\/)(deploy|deployment|infra|terraform|k8s|helm|policies|manifests?)(\/|$)/.test(value)) return "deployment/policy"
  if (/(^|\/)(skills?|plugins?|extensions?|hooks?|mcp)(\/|$)/.test(value)) return "behavior extension"
  if (/\.(md|mdx|txt)$/.test(value) || /(^|\/)(docs?|runbooks?)(\/|$)/.test(value)) return "docs/assertion"
  if (/\.(ya?ml|json|toml|ini|cfg|rego)$/.test(value) || /(^|\/)(config)(\/|$)/.test(value)) return "config/definition"
  return "code/wiring"
}

function safeSnippet(line) {
  return line
    .replace(/\b(AKIA|ASIA)[A-Z0-9]{16}\b/g, "[REDACTED_AWS_KEY]")
    .replace(/\b(sk-[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})\b/g, "[REDACTED_TOKEN]")
    .replace(/\b(password|passwd|secret|api[_-]?key|access[_-]?token|client[_-]?secret|authorization)\b(\s*[:=]\s*)["']?[^\s,"'}]+/ig, "$1$2[REDACTED]")
    .replace(/[\t ]+/g, " ")
    .trim()
    .slice(0, 180)
}

function recordSignals(signals, hitMap, line, reference, kind) {
  for (const signal of signals) {
    const hits = hitMap.get(signal.id)
    if (hits.length >= MAX_HITS_PER_SIGNAL || !signal.re.test(line)) continue
    hits.push({ reference, kind, snippet: safeSnippet(line) })
  }
}

function scanFile(file) {
  let stat
  try {
    stat = fs.statSync(file)
  } catch {
    filesSkipped++
    return
  }
  if (stat.size > MAX_FILE_BYTES) {
    filesSkipped++
    return
  }

  let contents
  try {
    contents = fs.readFileSync(file, "utf8")
  } catch {
    filesSkipped++
    return
  }
  if (contents.includes("\0")) {
    filesSkipped++
    return
  }

  filesScanned++
  const relativePath = path.relative(target, file) || path.basename(file)
  const base = path.basename(file).toLowerCase()
  if (["package.json", "pyproject.toml", "requirements.txt", "go.mod", "cargo.toml"].includes(base)) {
    manifestText.push(contents)
  }
  const kind = artifactKind(relativePath)
  const lines = contents.split("\n")
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    if (line.length > 800) continue
    const reference = `${relativePath}:${index + 1}`
    recordSignals(CAPABILITIES, capabilityHits, line, reference, kind)
    recordSignals(SURFACES, surfaceHits, line, reference, kind)
    recordSignals(ASSURANCE_LEADS, assuranceHits, line, reference, kind)
    recordSignals(LIFECYCLE_PHASES, lifecycleHits, line, reference, kind)
    recordSignals(HOTSPOTS, hotspotHits, line, reference, kind)
  }
}

function walk(directory) {
  if (filesScanned >= MAX_FILES) {
    scanCapped = true
    return
  }
  let entries
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true })
  } catch {
    filesSkipped++
    return
  }
  entries.sort((a, b) => a.name.localeCompare(b.name))
  for (const entry of entries) {
    if (filesScanned >= MAX_FILES) {
      scanCapped = true
      return
    }
    if (entry.isSymbolicLink()) {
      filesSkipped++
      continue
    }
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name) || (entry.name.startsWith(".") && entry.name !== ".github")) continue
      walk(fullPath)
      continue
    }
    if (!entry.isFile()) continue
    const lowerName = entry.name.toLowerCase()
    const extension = path.extname(lowerName)
    if (lowerName.startsWith(".env") || /(^|\.)env(\.|$)/i.test(lowerName) || lowerName.endsWith(".lock")) {
      filesSkipped++
      continue
    }
    if (!TEXT_EXTENSIONS.has(extension) && !TEXT_FILENAMES.has(lowerName)) continue
    scanFile(fullPath)
  }
}

function materialize(signals, hitMap) {
  return signals.map((signal) => ({
    id: signal.id,
    label: signal.label,
    ...(signal.detail ? { detail: signal.detail } : {}),
    hits: hitMap.get(signal.id),
  }))
}

walk(target)

const manifestBlob = manifestText.join("\n")
const frameworks = FRAMEWORKS.filter(([, regex]) => regex.test(manifestBlob)).map(([label]) => label)
const result = {
  schemaVersion: 3,
  target,
  detectedFrameworks: frameworks.length ? frameworks : ["Unknown or custom"],
  stats: { filesScanned, filesSkipped, scanCapped },
  capabilities: materialize(CAPABILITIES, capabilityHits),
  surfaces: materialize(SURFACES, surfaceHits),
  assuranceLeads: materialize(ASSURANCE_LEADS, assuranceHits),
  lifecycleLeads: materialize(LIFECYCLE_PHASES, lifecycleHits),
  hotspots: materialize(HOTSPOTS, hotspotHits),
}

if (jsonOutput) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
  process.exit(0)
}

function emitSignalSection(output, title, entries, emptyText) {
  output.push(`## ${title}`, "")
  const found = entries.filter((entry) => entry.hits.length)
  if (!found.length) {
    output.push(emptyText, "")
    return
  }
  for (const entry of found) {
    output.push(`### ${entry.id} — ${entry.label}`)
    if (entry.detail) output.push(entry.detail)
    output.push("")
    for (const hit of entry.hits) {
      output.push(`- **${hit.kind}:** \`${hit.reference}\` — \`${hit.snippet}\``)
    }
    output.push("")
  }
}

const output = []
output.push("# Harness Audit — prescan v3", "")
output.push(`- **Target:** \`${target}\``)
output.push(`- **Detected framework:** ${result.detectedFrameworks.join(", ")}`)
output.push(`- **Files scanned:** ${filesScanned}${scanCapped ? " (capped)" : ""}`)
output.push(`- **Files skipped:** ${filesSkipped} (dotenv, lock, oversized, binary, symlink, ignored, or unreadable)`)
output.push("")
output.push("> Candidate evidence only. A hit does not establish applicability, a control, or a finding. Open the artifact, trace the real entry-to-sink path, and search for bypasses.", "")

emitSignalSection(output, "Candidate capability profile", result.capabilities, "No capability signals found. Confirm manually from entry points and deployment configuration.")
emitSignalSection(output, "Boundary surface leads", result.surfaces, "No boundary signals found. Build the surface map manually.")
emitSignalSection(output, "Assurance evidence leads", result.assuranceLeads, "No assurance signals found. This is not proof that safeguards are absent.")
emitSignalSection(output, "Lifecycle phase leads", result.lifecycleLeads, "No lifecycle signals found. Resolve configuration, extension, runtime, persistence, effect, and recovery applicability manually.")
emitSignalSection(output, "Potential bypass hotspots", result.hotspots, "No hotspot patterns found. Manual bypass analysis is still required.")

const missingCapabilities = result.capabilities.filter((entry) => !entry.hits.length)
const missingClaims = result.assuranceLeads.filter((entry) => !entry.hits.length)
const missingPhases = result.lifecycleLeads.filter((entry) => !entry.hits.length)
output.push("## No-signal areas to resolve", "")
output.push("No signal means **unknown**, not N/A or Ineffective. Establish reachability and inspect non-code controls before judging.", "")
if (missingCapabilities.length) {
  output.push(`- **Capability modules:** ${missingCapabilities.map((entry) => `${entry.id} ${entry.label}`).join("; ")}`)
}
if (missingClaims.length) {
  output.push(`- **Core claims:** ${missingClaims.map((entry) => `${entry.id} ${entry.label}`).join("; ")}`)
}
if (missingPhases.length) {
  output.push(`- **Lifecycle phases:** ${missingPhases.map((entry) => `${entry.id} ${entry.label}`).join("; ")}`)
}
output.push("")
output.push("---", "Next: read `reference/audit-rubric.md`, pin the release manifest, map access and influence, build the lifecycle matrix, derive critical scenarios, and challenge effect proof packets. No causal chain, no assurance.")

process.stdout.write(`${output.join("\n")}\n`)
