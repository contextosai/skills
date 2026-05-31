# Skills

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

Then install the bundled skills:

```
/plugin install example-skills@contextosai-skills
```

Once installed, invoke a skill just by mentioning the task — for example,
"write a commit message for my staged changes" will trigger the
`commit-message` skill.

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
| [`commit-message`](./skills/commit-message) | Write a conventional git commit message from staged changes. |
| [`pr-description`](./skills/pr-description) | Draft a PR title and description from a branch's commits and diff. |
| [`readme-polish`](./skills/readme-polish) | Improve a README's clarity and structure without changing its meaning. |
