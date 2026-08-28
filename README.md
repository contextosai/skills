# Skills

[![Validate skills](https://github.com/contextosai/skills/actions/workflows/validate.yml/badge.svg)](https://github.com/contextosai/skills/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Skills are folders of instructions, scripts, and resources that an agent loads
dynamically to improve performance on specialized tasks. A skill teaches the
agent how to complete a specific task in a repeatable way — writing a commit
message in your team's style, drafting a PR description, polishing docs, and so
on.

Each skill is self-contained in its own folder with a `SKILL.md` file holding
the instructions and metadata. Browse the [`skills`](./skills) directory for
working examples, or use the [`template`](./template) as a starting point.

## Repository layout

- [`./skills`](./skills) — example skills you can use or learn from
- [`./spec`](./spec) — the Agent Skills specification
- [`./template`](./template) — a minimal skill template

## Install in Codex

Use [Codex's built-in skill installer](https://learn.chatgpt.com/docs/build-skills)
to install `harness-audit` directly from this repository:

```text
$skill-installer install harness-audit from https://github.com/contextosai/skills/tree/main/skills/harness-audit
```

Codex discovers newly installed skills automatically. If the skill does not
appear, restart Codex. Invoke it explicitly with `$harness-audit`, or ask Codex
to audit an agent harness for production readiness.

## Install in Claude Code

Register this repository as a plugin marketplace:

```
/plugin marketplace add contextosai/skills
```

Then install a plugin. The production harness audit:

```
/plugin install harness-audit@contextosai-skills
```

ContextOS runtime design, Context Pack authoring, and proof-carrying run audit:

```
/plugin install contextos-runtime@contextosai-skills
```

ContextOS spec, contract, docs, and blog stewardship:

```
/plugin install contextos-stewardship@contextosai-skills
```

Or the example skills (commit messages, PR descriptions, README polish):

```
/plugin install example-skills@contextosai-skills
```

Once installed, invoke a skill just by mentioning the task — for example,
"audit my agent harness for production readiness" triggers `harness-audit`, and
"write a commit message for my staged changes" triggers `commit-message`. You
can also run `harness-audit` explicitly as `/harness-audit`.

## Creating a skill

A skill is just a folder with a `SKILL.md` file containing YAML frontmatter and
Markdown instructions:

```markdown
---
name: my-skill-name
description: A clear description of what this skill does and when to use it.
---

# My Skill Name

Instructions the agent will follow when this skill is active.

## Guidelines
- Guideline 1
- Guideline 2
```

The frontmatter requires two fields:

- `name` — a unique identifier (lowercase, hyphens for spaces)
- `description` — what the skill does **and when to use it**; this is how the
  agent decides the skill is relevant, so cover both the *what* and the *when*

See [`spec/agent-skills-spec.md`](./spec/agent-skills-spec.md) for the full
specification, and [`template/SKILL.md`](./template/SKILL.md) for a starting
point.

## Available skills

| Skill | Description |
| ----- | ----------- |
| [`harness-audit`](./skills/harness-audit) | Release- and lifecycle-aware assurance audit for an AI agent harness: maps the evaluated runtime bundle, effective authority, lifecycle attacks, effect proof, and evaluation evidence into an impact-tiered launch decision and focused fix queue. |
| [`contextos-architect`](./skills/contextos-architect) | Design a governed ContextOS thin slice across the five planes, canonical artifacts, evaluation gates, and staged rollout. |
| [`contextos-context-pack`](./skills/contextos-context-pack) | Author or review a Context Pack, its cross-layer bindings, compiler scenarios, evidence gates, and release invariants. |
| [`contextos-run-audit`](./skills/contextos-run-audit) | Audit one proof-carrying run across context, evidence, policy, approvals, effects, decision records, replay, and recovery. |
| [`contextos-spec-steward`](./skills/contextos-spec-steward) | Evolve the ContextOS canonical spec and typed reference without semantic drift or unnecessary scope. |
| [`contextos-contract-sync`](./skills/contextos-contract-sync) | Synchronize ContextOS runtime types, JSON Schemas, producers, examples, docs, and parity tests. |
| [`contextos-docs-author`](./skills/contextos-docs-author) | Create compliant ContextOS docs with the correct template, navigation, components, canonical examples, and verification. |
| [`contextos-blog-publisher`](./skills/contextos-blog-publisher) | Publish complete ContextOS blog packages with accurate terminology, routing metadata, read-next links, and optional social art. |
| [`commit-message`](./skills/commit-message) | Write a conventional git commit message from staged changes. |
| [`pr-description`](./skills/pr-description) | Draft a PR title and description from a branch's commits and diff. |
| [`readme-polish`](./skills/readme-polish) | Improve a README's clarity and structure without changing its meaning. |

## Validating

Every `SKILL.md` and the marketplace manifest are checked in CI on each push and
pull request. Run the same check locally:

```
node scripts/validate-skills.mjs
```

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the
skill format and the bar for inclusion, and please follow the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## License

Released under the [MIT License](./LICENSE).
