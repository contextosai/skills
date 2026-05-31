---
name: pr-description
description: Draft a pull request title and description from the commits and diff on the current branch. Use when the user asks to open a PR, write a PR description, or summarize a branch's changes for review.
---

# PR Description

Produce a reviewer-friendly pull request title and body for the current branch.

## Steps

1. Determine the base branch (usually `main`). Run
   `git log --oneline <base>..HEAD` and `git diff <base>...HEAD` to gather the
   full set of changes.
2. Group the changes by theme rather than listing every commit verbatim.
3. Fill in the template below.

## Template

```markdown
## Summary
<1–3 sentences: what this PR does and why.>

## Changes
- <key change 1>
- <key change 2>

## Testing
<How it was verified — commands run, manual checks, or "not yet tested".>

## Notes for reviewers
<Anything risky, intentionally out of scope, or needing a decision. Omit if none.>
```

## Guidelines

- Lead with intent: a reviewer should understand the *why* in the first sentence.
- Be honest in the Testing section — if something wasn't tested, say so.
- Keep the bullet list to the changes that matter for review, not noise.
- Call out breaking changes and migrations explicitly.
