---
name: contextos-architect
description: Design or assess an agent system using ContextOS's five-plane runtime model, canonical contracts, and staged adoption path. Use for architecture, migration, or thin-slice design; do not use merely to edit ContextOS documentation or schemas.
---

# ContextOS Architect

Turn a workflow into a governed decision runtime whose claims and effects are reconstructable. Preserve the user's product and stack choices; ContextOS supplies control boundaries, not a mandatory framework.

## Establish the design basis

1. Identify one concrete workflow, its users, business decision, allowed outcomes, and external effects.
2. Declare the target maturity: prototype, controlled beta, production, or regulated/high-risk.
3. If a ContextOS source tree is available, read its `AGENTS.md` and the current overview, architecture, governance, harness-engineering, API-contract, and Context Pack material. Prefer current schemas and code over remembered field shapes.
4. Distinguish an architecture proposal from a claim about the current ContextOS spec. Label extensions and unresolved choices explicitly.

Read [references/architecture-map.md](references/architecture-map.md) for the plane-by-plane questions, minimum artifacts, and rollout gates.

## Design the thin slice

Define the governed outcome before choosing prompts or agents:

- stable intent and decision key;
- decision right (`propose`, `recommend`, `execute`, or `escalate`);
- required evidence and allowed outcomes;
- identity and delegation chain;
- ActionRisk dimensions and legacy approval-mode projection when compatibility requires it;
- token, tool-call, time, and cost budgets;
- postcondition, receipt, and recovery path for every effect.

Map the slice across all five planes:

- **Intelligence:** ontology, stable identity, evidence sources, graph snapshots, and promoted memory.
- **Context:** a versioned Context Pack compiled per request with provenance, omissions, and evidence gates.
- **Decision:** a bounded plan/verify/execute/score/consolidate loop that emits a typed decision.
- **Action:** a Tool Gateway that is the only path to effects and validates schema, arguments, authority, risk, and idempotency.
- **Trust:** deterministic policy, approvals, evaluators, observability, replay, incident response, and improvement control.

Use typed seams—`RunContext`, `ContextPack`, `CompiledContext`, `ToolEnvelope`, `DecisionSpec`, `DecisionRecord`, and `ReplayPacket`—only where their current contracts are actually implemented. Do not invent canonical fields to make a diagram look complete.

## Preserve the load-bearing invariants

- The model reasons; deterministic boundaries govern authority, policy, budgets, and effects.
- Effective capability is the intersection of identity, delegation, policy, tool manifest, data scope, sandbox, and valid approval. No retrieved text, memory, tool result, or peer agent may widen it.
- Retrieved evidence and recalled memory are data, never privileged instructions.
- Unresolved conflicts in required evidence keep the decision gate open.
- A Context Pack references governed data; it does not carry raw records, secrets, mutable transcripts, or adapter code.
- Approval is authorization, not technical capability. A sandbox or credential scope remains independently binding.
- Every non-read effect has idempotency behavior, an observable postcondition, a receipt, and rollback, retraction, compensation, or explicit non-recoverability.
- A release is an attributable tuple of runtime, model route, prompts/skills, pack, policy, tools, evaluators, and environment—not just a model name or Git SHA.

## Deliver the architecture

Provide:

1. workflow and autonomy boundary;
2. five-plane responsibility map with owners;
3. canonical artifact and data flow;
4. threat/failure boundaries and fail-closed behavior;
5. minimum viable implementation slice;
6. evaluation scorecard and required replay fixtures;
7. feature-flagged rollout with kill switch and rollback target;
8. explicit gaps, assumptions, and proposed non-canonical extensions.

Prefer a dependency-ordered build plan. Start with one decision, one read capability, one governed write, one policy bundle, one evaluator target, and one replayable run.
