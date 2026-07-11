---
name: repo-orient
description: Map an unfamiliar software repository from code and configuration. Use when Codex needs to understand a new codebase, locate entry points or ownership boundaries, explain architecture and runtime flow, identify where a change belongs, or prepare for implementation without yet modifying files. Produce an evidence-backed repository map, not a directory listing or README paraphrase.
---

# Repository Orientation

Build the smallest accurate mental model needed for the user's task.

## Protocol

1. Read applicable `AGENTS.md` files and inspect `git status`. Treat existing
   changes as user work.
2. Inventory with `rg --files`, bounded by relevant top-level directories.
   Identify manifests, lockfiles, build/test config, deployment config, and
   generated/vendor boundaries.
3. Infer the repository shape: application, library, monorepo, service set,
   plugin, infrastructure, or hybrid. Verify the inference from manifests.
4. Trace one real execution path from an external entry point to its terminal
   effect. Follow imports/calls, configuration, persistence, and outbound I/O;
   do not infer architecture from names alone.
5. Trace the requested concern separately. Locate its definition, runtime
   wiring, tests, and operational surface. Search symbols and call sites before
   reading entire large files.
6. Identify boundaries that constrain a change: public API, data/schema,
   process/service, trust/authorization, transaction, concurrency, and release.
7. Stop when the model answers the user's question. Do not exhaustively catalog
   unrelated modules.

## Evidence discipline

- Cite concrete `path:line` references for important claims.
- Distinguish observed facts from inferences. State what would falsify an
  inference when uncertainty matters.
- Treat README and diagrams as orientation leads, then reconcile them with
  executable code and configuration.
- Call out stale, duplicated, dead, generated, or bypassed paths.
- If multiple entry points differ materially, map each relevant path rather
  than inventing one universal flow.

## Output

Use `references/repository-map.md`. Lead with the answer the user needs, then
give the execution path, boundaries, change location, and open questions. Skip
sections that add no decision value.

Do not edit the repository unless the user also requests a change.
