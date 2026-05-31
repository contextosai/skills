# Agent Skills Specification

A **skill** is a self-contained folder that teaches an agent how to perform a
specialized task in a repeatable way. Skills are loaded dynamically: the agent
reads a skill's metadata up front and pulls in the full instructions only when
the task is relevant.

## Folder layout

Every skill lives in its own directory and must contain a `SKILL.md` file at its
root. Supporting files (scripts, references, assets) may live alongside it.

```
my-skill/
  SKILL.md          # required — metadata + instructions
  reference.md      # optional — supporting docs
  scripts/          # optional — helper scripts
```

## SKILL.md format

`SKILL.md` begins with YAML frontmatter followed by Markdown instructions.

```markdown
---
name: my-skill-name
description: A clear description of what this skill does and when to use it.
---

# My Skill Name

Instructions the agent will follow when this skill is active.
```

### Frontmatter fields

| Field         | Required | Description                                                        |
| ------------- | -------- | ------------------------------------------------------------------ |
| `name`        | yes      | Unique identifier. Lowercase, hyphen-separated.                    |
| `description` | yes      | What the skill does **and when to use it**. Used for matching.     |

The `description` is the single most important field — it is how the agent
decides whether a skill is relevant. Write it to cover both the *what* and the
*when*.

### Body

The Markdown body holds the instructions, examples, and guidelines the agent
follows when the skill is active. Keep it focused: state the goal, the steps,
and the constraints. Link to supporting files by relative path when the skill
needs more depth than belongs inline.

## Distribution

Skills can be grouped into a plugin and published through a marketplace by
adding a `.claude-plugin/marketplace.json` at the repository root that lists the
skill folders. See the repository README for installation instructions.
