# Harness Assurance Report — <system / release>

**Target:** `<repository or system>`
**Release tuple:** `<harness / model / prompt / policy / tools / context-memory / evaluator versions>`
**Audit date:** `<YYYY-MM-DD>` · **Mode:** `<code-only | code+tests | code+tests+release traces>`
**Intended use:** `<users, environment, data, capabilities>` · **Impact tier:** `<T0–T3>`

## Decision

- **Launch decision:** `<BLOCKED | CONDITIONAL | READY>` for `<exact scope>`
- **Confidence:** `<High | Medium | Low>` — `<why>`
- **Critical path:** `<principal → influence → boundary → capability → harm>`
- **Headline:** `<highest-impact supported finding and why it matters>`
- **Residual risk:** `<what remains possible even if gates pass>`

Do not put an aggregate score here. State which required gate failed or passed.

## Scope and limitations

- **Inspected:** `<code, configuration, tests, evals, traces, deployments, incidents>`
- **Not inspected:** `<external services, managed controls, CI, production traces, etc.>`
- **Assumptions:** `<deployment, tier, identities, data, attacker access>`
- **Evidence freshness:** `<dates and release linkage>`
- **Access needed:** `<artifacts required to resolve Not verified claims>`

## Boundary and capability map

Describe the system as trust-changing edges. Include indirect capabilities.

| From → to | Data / authority crossing | Identity and scope | Enforcement / monitor | Persistence or side effect | Evidence |
|---|---|---|---|---|---|
| | | | | | |

### Capability applicability

| Module | Applicable? | Reachable path or N/A proof | Impact tier |
|---|---|---|---|
| M1 Untrusted retrieval and content | | | |
| M2 Persistent memory | | | |
| M3 Side effects and outbound actions | | | |
| M4 General-purpose compute and network | | | |
| M5 Sensitive or multi-tenant data | | | |
| M6 Multi-agent and delegation | | | |
| M7 Human approval | | | |
| M8 Long-running or unattended operation | | | |

## Critical abuse stories

| ID | Capability / asset | Abuse or failure path | Required invariant | Cut point | Impact / reachability |
|---|---|---|---|---|---|
| S-01 | | | | | |

## Assurance claims

`Status = Effective | Partially effective | Ineffective | Not verified | N/A`
`Evidence = E0 assertion | E1 definition | E2 wired | E3 boundary-tested | E4 release-observed`

| Claim | Status | Evidence | Confidence | Enforcement and boundary evidence | Bypass search / counterevidence | Gap |
|---|---|---|---|---|---|---|
| C1 Authority and intent | | | | | | |
| C2 Complete mediation | | | | | | |
| C3 Trust separation | | | | | | |
| C4 Information and state lifecycle | | | | | | |
| C5 Outcome integrity | | | | | | |
| C6 Containment and recovery | | | | | | |
| C7 Accountability and release integrity | | | | | | |
| C8 Evaluation and change governance | | | | | | |
| M… `<applicable module>` | | | | | | |

## Behavioral evidence and evaluation adequacy

### Representative scenarios

| Scenario | Release / trials | Benign utility | Safety result | Detection / recovery | Oracle | Evidence |
|---|---|---|---|---|---|---|
| | | | | | | |

### Metrics

| Slice | N / trials | Utility | Violation / attack success | Consistency | Monitor quality | Notes |
|---|---:|---:|---:|---:|---:|---|
| | | | | | | |

- **Coverage gaps:** `<capability × threat × boundary cells not tested>`
- **Oracle quality:** `<state/policy oracle, judge validation, human agreement>`
- **Repeated-attempt model:** `<why the trial count matches attacker/user opportunity>`
- **Safety–utility tradeoff:** `<over-refusal or degraded benign performance>`

## Launch gates

| Required claim / evidence | Result | Blocking? | Constraint or residual risk |
|---|---|---|---|
| | | | |

For a CONDITIONAL decision, state constraints as enforceable facts—not advice:
disabled capabilities, read-only credentials, tenant allowlist, human gate,
traffic cap, isolation, expiry, and the evidence each is active.

## Findings

Write findings in descending reachable impact. Each finding must include:

1. **Claim and status**
2. **Failure path and consequence**
3. **Evidence and counterevidence** (`path:line`, test ID, trace ID)
4. **Scope and confidence**
5. **Concrete remediation at the earliest feasible cut point**

## Fix queue

Keep no more than five active items. Group findings only when one mechanism and
one evidence package closes them together.

| Priority | Claim(s) / abuse stories | Concrete boundary fix | Expected evidence that changes judgment | Owner | Dependency |
|---:|---|---|---|---|---|
| 1 | | | | _(assign)_ | |

## Re-audit

- **First closure:** `<one load-bearing fix to complete well>`
- **Decision expires when:** `<model/prompt/policy/tool/context/memory/harness change or date>`
- **Re-run:** `<specific scenarios and runtime evidence>`
- **Resolve Not verified:** `<access or observation needed>`
