# Harness Assurance Report — <system / release>

**Target:** `<repository or system>`

**Release manifest:** `<immutable ID/hash or Not verified>`

**Audit date:** `<YYYY-MM-DD>` · **Mode:** `<code-only | code+tests | code+tests+release-observation>`

**Intended use:** `<users, environment, data, capabilities, persistence, effects>` · **Impact tier:** `<T0–T3>`

## Decision

- **Launch decision:** `<BLOCKED | CONDITIONAL | READY>` for `<exact scope>`
- **Confidence:** `<High | Medium | Low>` — `<why>`
- **Critical path:** `<source/principal → influence/authority → boundary → capability → effect>`
- **Failed proof obligation:** `<highest-impact unsupported invariant>`
- **Headline:** `<what can happen, why the harness does not stop/prove it, and consequence>`
- **Residual risk:** `<what remains possible if gates pass>`
- **Decision expiry:** `<date or release/config/capability change>`

Do not report an aggregate readiness score. State the exact gate that passed or
failed.

## Audit contract and limitations

- **Inspected:** `<code, config, manifests, tests, evals, trajectories, deployments, incidents, receipts>`
- **Not inspected:** `<external systems, managed controls, production evidence, CI, reviewers, etc.>`
- **Assumptions:** `<deployment, identities, data, threat access, traffic, tier>`
- **Accepted harm ceiling:** `<effects that must remain impossible or bounded>`
- **Evidence freshness:** `<dates and release linkage>`
- **Access/experiment needed:** `<what resolves each Not verified conclusion>`

## Evaluated runtime bundle

| Surface | Release identity / binding | Evidence | Drift or uncertainty |
|---|---|---|---|
| Model and routing | | | |
| Harness and orchestration | | | |
| Instructions | | | |
| Skills and extensions | | | |
| Tools and adapters | | | |
| Identity, policy, and approval | | | |
| Context and retrieval | | | |
| Memory and durable state | | | |
| Sandbox/runtime | | | |
| Traces and evaluators | | | |
| Recovery and deployment | | | |

State whether the manifest is content-addressed, trace-bound, comparable to the
approved baseline, and rollback-capable.

## Access and influence graph

Describe the system as trust- and authority-changing edges. Include indirect
paths and composite authority.

| From → to | Influence / authority / data | Identity, purpose, tenant/object scope | Enforcement / monitor | Persistence or effect | Evidence |
|---|---|---|---|---|---|
| | | | | | |

### Effective authority and reachability

- **Authority intersection:** `<manifest ∩ workload ∩ delegated principal ∩ audience/scope ∩ capabilities ∩ policy ∩ approval ∩ budget>`
- **Composite dangerous paths:** `<untrusted source → sensitive data/capability → sink>`
- **Generic or passed-through identities:** `<none or paths>`
- **Authority attenuation:** `<parent/child/resume comparison>`
- **Privilege drift:** `<identity, scope, tool, destination, mode, delegation, owner, budget>`
- **Revocation result:** `<what stops, measured time, what remains active>`

### Capability applicability

| Module | Applicable? | Reachable path or N/A proof | Impact tier |
|---|---|---|---|
| M1 Untrusted retrieval and content | | | |
| M2 Persistent memory and learned state | | | |
| M3 Side effects and outbound actions | | | |
| M4 General-purpose compute and network | | | |
| M5 Sensitive or multi-tenant data | | | |
| M6 Multi-agent and delegation | | | |
| M7 Human approval and fleet oversight | | | |
| M8 Long-running or unattended operation | | | |
| M9 Skills, plugins, MCP, and behavior extensions | | | |

## Instruction and behavior surfaces

| Rule/package | Owner and authority | Surface / applicability | Conflict or precedence | Required milestone / forbidden event | Exposure and runtime evidence |
|---|---|---|---|---|---|
| | | | | | |

Note undiscovered/truncated instructions, extension provenance or permission
gaps, shadowing/collision, dynamic updates, self-modification, and revocation.

## Lifecycle security matrix

| Phase | Untrusted artifact / failure | Required invariant | Cut point | Prevention / detection / recovery | Oracle and release evidence | Result |
|---|---|---|---|---|---|---|
| L1 Harness configuration | | | | | | |
| L2 Capability extension | | | | | | |
| L3 Runtime operation | | | | | | |
| L4 State persistence | | | | | | |
| L5 Action and effect control | | | | | | |
| L6 Incident recovery and promotion | | | | | | |

Include at least one cross-phase chain and separate recognition, prevention,
persistence, externalization, detection, containment, repair, and recovery.

## Critical scenarios

| ID | Release / phase(s) | Capability / asset | Starting authority and state | Perturbation / failure path | Invariant, cut point, and recovery | Oracle / trials | Result |
|---|---|---|---|---|---|---|---|
| S-01 | | | | | | | |

## Assurance claims

`Status = Effective | Partially effective | Ineffective | Not verified | N/A`

`Evidence = E0 assertion | E1 defined | E2 bound | E3 challenged | E4 release-observed`

| Claim | Status | Evidence | Confidence | Enforcement and causal evidence | Bypass search / counterevidence | Gap |
|---|---|---|---|---|---|---|
| C1 Authority continuity and intent | | | | | | |
| C2 Complete mediation and capability admission | | | | | | |
| C3 Trust, instruction, and supply-chain separation | | | | | | |
| C4 Information and state lifecycle integrity | | | | | | |
| C5 Effect and outcome integrity | | | | | | |
| C6 Containment, resilience, and recovery | | | | | | |
| C7 Reconstructability and release integrity | | | | | | |
| C8 Evaluation, oversight, and change governance | | | | | | |
| M… `<applicable module>` | | | | | | |

## Consequential effect proof packet

Use one representative packet for each distinct critical effect class.

| Field | Evidence | Complete? | Gap / uncertainty |
|---|---|---|---|
| Originating principal, agent/workload, tenant, purpose | | | |
| Release manifest and deploy binding | | | |
| Context/evidence and applicable rules | | | |
| Delegated authority, audience, object/destination scope, expiry | | | |
| Policy and exact normalized approval | | | |
| Tool request, schema, precondition, idempotency | | | |
| Authoritative mutation/version and postcondition | | | |
| Durable writes, partial/pending state, uncertainty | | | |
| Compensation/rollback state and owner | | | |

## Behavioral evidence and evaluation adequacy

### Representative scenario results

| Scenario | Release / trials | Outcome | Critical-rule compliance | Runtime safety / effect | Detection / recovery | Cost | Oracle / evidence |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Metrics

| Slice | N / trials | Accepted trusted outcome | Useful-but-unsafe | Rule omissions / oversteps | Attack / unsafe effect | Recovery | Cost / trusted outcome |
|---|---:|---:|---:|---:|---:|---:|---:|
| | | | | | | | |

- **Instruction evaluation:** `<against-prior, conflict, applicability and surface coverage>`
- **Lifecycle coverage:** `<phase/family × capability × release gaps>`
- **Behavior-package evidence:** `<paired baseline, Skill Lift by metric, negative activation, collision, rollback>`
- **Memory closure:** `<write/persistence/recall/adoption/effect/repair/benign preservation>`
- **Postcondition coverage:** `<critical effects with authoritative proof packets>`
- **Monitor quality:** `<timing, recall, precision/FPR, independence, shared compromise>`
- **Human oversight:** `<mandatory gates, selection policy, random holdout, reviewer FNR, residual-risk reduction, non-vacuity>`
- **Trace quality:** `<native, portable, spans, decision record; correlation and conversion loss>`
- **Oracle quality:** `<state/policy checks, judge validation, human agreement>`
- **Repeated opportunity:** `<why trials model actual user/attacker chances>`
- **Safety–utility tradeoff:** `<over-refusal or degraded benign performance>`
- **Economics:** `<model+tool+sandbox+review+recovery cost and retry/fan-out amplification>`

## Launch gates

| Required claim / evidence | Result | Blocking? | Enforced constraint or residual risk |
|---|---|---|---|
| | | | |

For a CONDITIONAL decision, describe constraints as enforceable, expiring facts:
disabled capabilities, revoked packages, read-only credentials, tenant/object or
destination allowlists, mandatory approval, traffic cap, isolation, and the E3+
evidence that each is active.

## Findings

Write findings in descending reachable impact. Each finding must include:

1. **Claim, module, lifecycle phase, and status**
2. **Source/authority-to-effect path and consequence**
3. **Failed invariant or missing proof-packet field**
4. **Evidence and counterevidence** (`path:line`, test, trace, decision, receipt)
5. **Release scope and confidence**
6. **Concrete remediation at the earliest feasible cut point**

## Fix queue

Keep no more than five active items. Group findings only when one mechanism and
one evidence package closes them together.

| Priority | Claim(s) / scenarios | Concrete boundary fix | Expected evidence that changes judgment | Owner | Dependency |
|---:|---|---|---|---|---|
| 1 | | | | _(assign)_ | |

## Evidence ledger and re-audit

- **Evidence bundle:** `<manifest, graph, tests, trajectories, decisions, receipts, recovery records>`
- **First closure:** `<one load-bearing fix to complete well>`
- **Decision expires when:** `<model/harness/instruction/skill/tool/policy/context/memory/sandbox/evaluator/recovery/deploy change or date>`
- **Re-run:** `<specific lifecycle scenarios, rule cases, effect proof, and runtime observations>`
- **Resolve Not verified:** `<access or experiment needed>`
- **Rollback/revocation trigger:** `<critical regression or drift condition>`
