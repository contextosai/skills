# Security Policy

## Supported versions

This repository tracks a single, rolling release on the `main` branch. Security
fixes are applied to `main`; there are no separately maintained release
branches.

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Instead, report privately using one of:

1. **GitHub Private Vulnerability Reporting** — go to the
   [Security tab](https://github.com/contextosai/skills/security/advisories/new)
   and open a draft advisory. This is the preferred channel.
2. **Email** — `piyush@piyush.me` with the subject line `SECURITY: skills`.

Please include:

- A description of the issue and its impact
- Steps to reproduce (a minimal proof of concept if possible)
- The affected skill or file path

## What to expect

- **Acknowledgement** within 3 business days.
- An initial assessment and severity rating within 7 business days.
- Coordinated disclosure: we will agree on a timeline before any public
  disclosure and credit you in the advisory unless you prefer otherwise.

## Scope and notes

Skills are folders of instructions and helper scripts that an agent may execute.
When using any skill:

- **Review `scripts/` before running them** against a repository or
  environment you care about.
- Skills operate with the permissions of the agent and user running them; treat
  them as you would any third-party automation.
- Reports about a skill instructing an agent to take unsafe actions (destructive
  commands, exfiltration, etc.) are in scope and welcome.
