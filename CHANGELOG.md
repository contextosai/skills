# Changelog

All notable changes to this repository are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `SECURITY.md` with a private vulnerability-reporting policy.
- `.github/CODEOWNERS` and Dependabot config for GitHub Actions updates.
- Branch protection on `main` (PR + passing CI required, no force-push/deletion).
- `contextos-runtime` plugin with architecture, Context Pack authoring, and
  proof-carrying run audit skills.
- `contextos-stewardship` plugin with spec, runtime-contract, docs, and blog
  publishing skills.

### Changed
- `harness-audit` refactored from a fixed 44-control scorecard into an
  applicability-aware assurance case. The new workflow separates control
  effectiveness, evidence level, and audit confidence; adds impact-tiered
  launch gates, capability-specific modules, threat-driven scenarios,
  repeated-trial safety/utility metrics, lifecycle memory testing, and a
  boundary-focused prescan with JSON output.
- `harness-audit` evolved again around the complete evaluated runtime bundle.
  It now pins a release manifest, maps composite authority and revocation,
  audits configuration through recovery as a six-phase lifecycle, registers
  instruction and extension surfaces, requires proof packets for consequential
  effects, evaluates skills with paired live evidence, measures oversight
  effectiveness, and keeps adaptive promotion behind an immutable outer loop.
  The prescan schema is now v3 with lifecycle, behavior-extension, identity,
  effect, and self-modification leads.

## [1.1.0] - 2026-05-31

### Added
- `harness-audit` skill — production-readiness audit for AI agent harnesses,
  scoring 40 runtime controls against real code with file:line evidence.
- Repository governance: `LICENSE` (MIT), `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, GitHub issue/PR templates.
- `scripts/validate-skills.mjs` and a CI workflow that validates every
  `SKILL.md` and the marketplace manifest on push and pull request.

## [1.0.0] - 2026-05-31

### Added
- Initial skills marketplace scaffold: `marketplace.json`, skill `template`,
  and the Agent Skills `spec`.
- Example skills: `commit-message`, `pr-description`, `readme-polish`.
