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

## Install in Claude Code

Register this repository as a plugin marketplace:

```
/plugin marketplace add contextosai/skills
```

Then install a plugin. The production harness audit:

```
/plugin install harness-audit@contextosai-skills
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
| [`harness-audit`](./skills/harness-audit) | Threat-model-driven production-readiness audit for an AI agent harness: maps reachable capabilities, builds evidence-backed assurance claims, makes a risk-tiered launch decision, and emits a focused fix queue. |
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
