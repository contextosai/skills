---
name: readme-polish
description: Improve a project's README for clarity, structure, and completeness without changing its meaning. Use when the user asks to clean up, polish, or improve a README or project documentation.
---

# README Polish

Improve an existing README's clarity and structure while preserving its intent.

## Steps

1. Read the current README in full before changing anything.
2. Check that it answers the questions a new reader asks, in order:
   - What is this project and who is it for?
   - How do I install it?
   - How do I use it (a minimal, copy-pasteable example)?
   - How do I configure it?
   - How do I contribute / where do I get help?
3. Restructure and tighten the prose. Do not invent features, commands, or
   claims that aren't supported by the project.

## Suggested structure

```markdown
# Project Name
One-line description.

## Installation
## Usage
## Configuration
## Contributing
## License
```

## Guidelines

- Preserve technical accuracy above all — when unsure whether a command or
  claim is correct, flag it for the user instead of guessing.
- Prefer a short, working example over a long prose explanation.
- Keep headings shallow and scannable; use code fences for all commands.
- Don't pad. Every section should earn its place.
