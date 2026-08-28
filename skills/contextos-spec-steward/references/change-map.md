# ContextOS spec change map

Treat these as maximum semantic touch sets. Inspect actual imports, references, and tests; edit only surfaces whose behavior or published meaning changes.

## Primary spec/reference couplings

| Change | Primary spec surfaces | Typed/reference surfaces |
|---|---|---|
| Cognitive loop, compiler boundary, RunContext | `src/content/docs/foundations/cognitive-core.mdx` | `src/lib/contextos/types.ts`, compiler/scenario when behavior changes |
| Planner/Executor/Critic, lanes, durable sessions, delegation | `foundations/orchestration.mdx`, implementation API contracts | delegation, plan, critic, and run types; relevant schemas |
| Promotion-aware memory and contradiction handling | `foundations/memory.mdx`, `implementation/memory-fabric.mdx` | memory/evidence types, compiler inputs, admission tests |
| Action risk, approval modes, policy, gates | `foundations/governance.mdx`, `foundations/adapter-mesh.mdx` | `types.ts`, `compiler.ts`, scenario, Context Pack/CompiledContext/Tool schemas |
| Runtime invocation and envelopes | `implementation/api-contracts.mdx`, `reference/api-schemas.mdx` | types plus request/delegation/tool/decision schemas |
| Context Pack contract/compiler | `implementation/context-pack.mdx`, compiler component reference | `types.ts`, `compiler.ts`, `scenario.ts`, Context Pack and CompiledContext schemas |
| DecisionSpec/DecisionRecord | decision catalog/record docs, API contracts | types, decision schema, compiled controls when carried into audit |
| Context admission and evidence conflicts | agentic context engineering, cognitive core, how-it-works, quickstart, compiler reference | types, compiler, compiled/decision schemas, admission/drift tests |
| Harness discipline and rollout | `foundations/harness-engineering.mdx` | repo guidance/layout examples, audit standard, release/replay contracts if canonical |
| Reviewer taxonomy | `reference/reviewer-agents.mdx` | reviewer envelope/rubric only when implemented |
| Evaluators and release gates | `foundations/evaluation-observability.mdx` | eval targets, scorecard/lineage schemas, scenario/tests |
| Improvement-loop search/promotions | `foundations/improvement-loop.mdx` | proposal/replay/promotion contracts only when canonical |

## Source-of-truth order

1. Public docs define the ContextOS spec.
2. Published JSON Schemas are the executable wire-validation surface.
3. `src/lib/contextos/` is the deterministic typed reference and canonical demo, not production runtime.
4. Tests encode required alignment and publication invariants.
5. Blog posts explain and explore; they do not override the spec.

If these disagree, report the conflict and resolve it intentionally. Do not select whichever source makes the requested edit easiest.

## Canonical identifiers

The canonical demo pack in `src/lib/contextos/scenario.ts` is the identifier source for on-ramp examples. Inspect it before using bundle, rule, gate, adapter, capability, decision, evidence, tenant, or pack IDs. Never hand-copy an older blog/example identifier into canonical docs.

## Validation routing

| Surface changed | Minimum targeted checks |
|---|---|
| Any docs MDX | docs frontmatter; template test for foundations |
| Canonical Context Pack examples/terms | spec-reference drift |
| Compiler policy, risk, budgets, tools | compiler hardening and scenario/spec drift |
| Provenance, admission, evidence conflicts/gates | context-admission, schema-surface, spec drift |
| Published JSON schema | schema-surface and runtime-schemas; parse exact schema set |
| MDX loader/renderer/component | MDX loader, typecheck, lint, affected route preview |
| Navigation/route | typecheck, build, route preview; redirect test/manual check when moved |
| Blog package | blog-distribution plus relevant rendering/type checks |
| LLM discovery surface | llms-surface and route output inspection |

After targeted checks, run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` in proportion to risk and changed code. Report omissions.

## Review questions

- Has this pattern been validated in a working system, or is it explicitly a proposal?
- Which plane owns enforcement and which types cross the boundary?
- Can any new input grant itself authority?
- Is failure deterministic, visible, typed, and fail-closed?
- Does the change preserve replay and release attribution?
- Is a new canonical type truly needed, or can existing artifacts compose it?
- Are compatibility and migration explicit for old producers/consumers?
- Did the diff touch only the minimum coherent set?
