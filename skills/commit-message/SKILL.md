---
name: commit-message
description: Write a clear, conventional git commit message from staged changes. Use when the user asks to commit, write a commit message, or describe what changed.
---

# Commit Message

Generate a high-quality commit message that describes the staged changes.

## Steps

1. Run `git diff --staged` to see what is actually being committed. If nothing
   is staged, inspect `git status` and ask the user what to stage.
2. Identify the single primary intent of the change. If the diff does more than
   one unrelated thing, suggest splitting it into multiple commits.
3. Write the message using the Conventional Commits format.

## Format

```
<type>(<optional scope>): <subject>

<body — what changed and why, wrapped at ~72 cols>
```

- **type**: one of `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`,
  `build`, `ci`.
- **subject**: imperative mood, lowercase, no trailing period, ≤ 50 chars.
- **body**: optional. Explain *why*, not just *what*. Omit for trivial changes.

## Guidelines

- Describe the effect of the change, not the mechanics of editing files.
- Never invent a rationale that isn't supported by the diff.
- One logical change per commit.

## Examples

```
feat(auth): add refresh-token rotation

Tokens are now rotated on every refresh so a leaked token is valid for
at most one cycle.
```

```
fix(parser): handle empty input without panicking
```
