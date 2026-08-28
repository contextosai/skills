# Context Pack checklist

Confirm field names against the active TypeScript type and `context-pack` JSON Schema before authoring. This checklist captures semantic invariants, not a substitute schema.

## Ten layers

| Layer | Must establish | Keep out |
|---|---|---|
| `contract_meta` | Contract identity/version, issuer, creation time, compatibility requirements | Mutable deployment state |
| `pack_meta` | Immutable pack ID/version, tenant, environment defaults, TTL, data classification | Live credentials or records |
| `intelligence_refs` | Ontology/version, entity/relationship types, graph snapshot rule, identity namespaces, optional versioned embeddings | Retrieved payloads |
| `business_context` | Concise durable summary and enforceable non-negotiables | Duplicated policy or marketing slogans |
| `policy_layer` | Versioned deterministic bundles, guardrails, gates, optional native ActionRisk policy | Model-only safety instructions |
| `tooling_layer` | Adapter registry, capabilities, legacy mode, native risk, permissions, argument constraints | Adapter code or raw secrets |
| `decision_layer` | DecisionSpecs, owners, evidence, outcomes, risk/mode, decision right, optional schemas | Free-form outcome conventions |
| `memory_layer` | Tier TTLs, allowed write classes, consent gate, promotion thresholds | Raw capture promoted by default |
| `evaluation_layer` | Per-intent policy/utility/safety/latency/economic targets and optional release deltas | Unversioned vibes-based review |
| `tone_and_comms` | Concise voice, do, and do-not constraints | Policy or privileged instructions |

## Binding graph

All edges must resolve:

```text
intent
  -> policy_bundle.rules[].applies_to
  -> rule.decision_binding -> DecisionSpec.decision_key
  -> rule.requires[] -> DecisionSpec.required_evidence[] or named runtime evidence
  -> rule.requires_approval_gate -> approval_gates[].gate_id
  -> permission.adapter_id/capability -> adapter_registry
  -> capability_risks[capability] -> declared capability
  -> evaluation_layer.eval_targets[].intent
```

The pack's tenant, invocation tenant, evidence tenant, and tool object scope must agree. CEID namespaces cover subjects written into decision records.

## Action and authority checks

For each capability record:

- `effect`: none, local state, external state, or physical world;
- `authority`: agent, service, user-delegated, or human-approved;
- `reversibility`: read-only, reversible, compensatable, or irreversible;
- `interaction`: API, browser, computer, agent-to-agent, or human handoff;
- `data_scope`: public, internal, confidential, or restricted;
- decision TTL when the policy requires one;
- resource/object scope and argument constraints;
- idempotency and postcondition/recovery protocol for effects.

Every dimension must satisfy policy. A favorable property never cancels a denial on another dimension.

## Reference compiler pipeline

The current reference compiler has eight stages:

1. intent classification;
2. deterministic policy resolution;
3. tool surfacing;
4. caller-supplied evidence normalization/admission;
5. promoted-memory normalization;
6. token budget allocation;
7. bucket assembly and explicit truncation;
8. manifests, runtime controls, budget report, and context ledger.

Expected `CompiledContext` proof includes:

- compiled prompt with provenance-bearing blocks;
- policy, tool, and evidence manifests;
- refuse, escalate, approval, redaction, context-admission, and evidence-gate controls;
- tokens used by bucket, omissions, dropped blocks, warnings, and truncations;
- pack, intent, request, policy, tool, evidence, memory, omission, budget, and hash lineage.

## Evidence admission

- Plain legacy strings are untrusted/unknown and cannot close a gate.
- Retrieved and recalled text has `instruction_treatment: data_only`.
- Only admitted evidence may appear in the evidence manifest.
- Stale, unknown, untrusted, expired, or budget-dropped evidence does not satisfy a governed requirement.
- Unresolved conflicts on required evidence reject the affected refs and block commit.
- A resolved conflict names the selected evidence and an accountable `resolution_ref`; superseded evidence remains visible in conflict lineage but does not satisfy the gate.

## Versioning and release

- Bump pack version for any semantic content change.
- Bump contract major version for breaking schema changes; keep pack and schema versions distinct.
- Treat a published `pack_id@version` as immutable.
- Resolve environment overlays deterministically and include their version/hash/order in lineage.
- Validate identifiers, bindings, tenant/data class, policies, tool risk, budgets, schemas, and evaluator targets before publication.
- Replay a pinned scenario set before promotion and keep the previous version available for rollback.
