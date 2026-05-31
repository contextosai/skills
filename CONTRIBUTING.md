# Contributing

Thanks for your interest in contributing a skill! This repo is a collection of
**skills** — self-contained folders that teach an agent how to do a task. The
bar for inclusion is simple: a skill should be focused, well-described, and
actually useful.

## Anatomy of a skill

```
skills/<skill-name>/
  SKILL.md            # required — frontmatter + instructions
  reference/          # optional — supporting docs the skill links to
  scripts/            # optional — deterministic helpers the skill invokes
```

`SKILL.md` must start with YAML frontmatter:

```markdown
---
name: my-skill
description: What it does AND when to use it. This is how the agent matches it.
---

# My Skill

Instructions...
```

See [`spec/agent-skills-spec.md`](./spec/agent-skills-spec.md) for the full
format and [`template/SKILL.md`](./template/SKILL.md) for a starting point.

## Adding a skill

1. Create `skills/<your-skill>/SKILL.md` (copy the template).
2. Pick a `name` that is lowercase and hyphen-separated, matching the folder.
3. Write a `description` that covers both **what** the skill does and **when**
   to use it — vague descriptions don't get matched.
4. Register the skill in [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json)
   under an appropriate plugin.
5. Add a row to the "Available skills" table in the [README](./README.md).
6. Run the validator and make sure it passes:

   ```
   node scripts/validate-skills.mjs
   ```

7. Open a pull request using the PR template.

## Quality guidelines

- **One job per skill.** If it does two unrelated things, split it.
- **Be specific.** Concrete steps beat vague advice.
- **Don't invent capabilities.** Instructions must reflect what actually works.
- **Prefer determinism.** Push repeatable logic into `scripts/` and have the
  skill call it, rather than re-deriving it in prose every time.
- **Keep it self-contained.** A skill should not depend on another skill.

## Commit and PR style

- Conventional Commit subjects (`feat(skill): add ...`, `fix: ...`, `docs: ...`).
- One logical change per PR where possible.
- CI must be green before merge.

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE).
