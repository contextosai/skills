---
name: review-change
description: Review a code change for concrete correctness, security, data-integrity, compatibility, concurrency, and operability regressions by reconstructing intent and checking affected invariants and boundary paths. Use for local diffs, commits, branches, patches, or pull requests when the user wants actionable review findings. Report only defects introduced or exposed by the change with precise evidence; do not modify code unless asked to address findings.
---

# Change Review

Review the behavioral delta, not the typography of the diff.

## Protocol

1. Determine the review range and read applicable `AGENTS.md`. Inspect status so
   uncommitted user work is not mistaken for the target change.
2. Reconstruct intent from the request, commits, tests, and changed call sites.
   State ambiguity when intent affects whether behavior is defective.
3. Inventory changed surfaces: API/schema, state, authorization, side effects,
   concurrency, errors/retries, configuration, observability, and release.
4. For each surface, state the invariant before and after the change. Trace the
   changed value/control flow beyond edited lines into callers and consumers.
5. Inspect the risky counter-paths: absent/empty/malformed input, denied access,
   duplicate/retry, partial failure, timeout/cancellation, stale state,
   concurrent execution, upgrade/downgrade, and rollback. Use only relevant
   paths.
6. Read tests as executable claims. Check whether assertions would fail for the
   suspected regression; test presence alone is not coverage.
7. Validate each finding against the actual diff and surrounding code. A
   finding must identify a reachable trigger, violated invariant, user impact,
   and a bounded location introduced or exposed by the change.
8. Rank by impact and likelihood using `references/finding-rubric.md`. Omit
   speculative concerns, pre-existing unrelated issues, and style preferences.

## Finding bar

Emit a finding only when all are true:

- The reviewed change introduces or exposes it.
- A realistic execution path reaches it.
- The consequence is incorrect behavior, vulnerability, data loss, meaningful
  degradation, or an operational failure.
- The developer can act on it locally.
- The evidence is specific enough to falsify.

If a concern is plausible but unproven, perform another read-only check. If it
remains uncertain, describe it as an open question outside the findings and
state what evidence is missing.

## Output

Lead with findings ordered by priority. For each, use one concise paragraph:
`[P#] imperative title`, reachable scenario, consequence, and why current code
does not prevent it. Cite the smallest useful changed-line range.

Then give a short review summary and testing gaps. If no findings meet the bar,
say so explicitly and name residual risks or unverified surfaces.
