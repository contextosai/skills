# Changelog

All notable changes to this repository are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `SECURITY.md` with a private vulnerability-reporting policy.
- `.github/CODEOWNERS` and Dependabot config for GitHub Actions updates.
- Branch protection on `main` (PR + passing CI required, no force-push/deletion).

### Changed
- `harness-audit` refactored from a fixed 44-control scorecard into an
  applicability-aware assurance case. The new workflow separates control
  effectiveness, evidence level, and audit confidence; adds impact-tiered
  launch gates, capability-specific modules, threat-driven scenarios,
  repeated-trial safety/utility metrics, lifecycle memory testing, and a
  boundary-focused prescan with JSON output.

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
