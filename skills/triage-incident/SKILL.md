---
name: triage-incident
description: Triage an active or recent software production incident by establishing impact, stabilizing the system, preserving evidence, building a timestamped timeline, coordinating hypotheses, and choosing reversible mitigations. Use when users report an outage, severe degradation, security or data-integrity event, broken deployment, elevated errors, or ask for incident command, status assessment, mitigation, or investigation support. Prioritize user harm reduction over root-cause completeness and require explicit authority for production mutations.
---

# Triage an Incident

Reduce harm first, preserve the ability to learn why, and keep facts distinct
from hypotheses.

## Protocol

1. Establish whether the event is active. Record start/detection time, affected
   users/regions/intents, symptom, severity signals, and current owner. Use
   absolute timestamps with timezone.
2. Define impact in user and business terms. Separate confirmed impact from
   suspected blast radius and monitoring artifacts.
3. Freeze unnecessary changes and preserve volatile evidence: deploy/version
   identifiers, flags/config, traces, logs, metrics, queue depth, resource state,
   and recent changes. Redact sensitive data.
4. Identify the failing boundary and healthy comparison: region, tenant,
   version, route, dependency, data partition, or time window.
5. Choose the safest reversible mitigation that reduces harm fastest: disable a
   feature, shed load, fail closed/open according to risk, route traffic,
   rollback code/config, pause writes, or degrade functionality. State expected
   signal, abort threshold, and recovery path before acting.
6. Do not mutate production without explicit authority. When authorized, make
   one controlled change at a time and timestamp the observation window.
7. Maintain competing hypotheses and discriminating evidence. Do not let the
   most senior or most recent theory become fact by repetition.
8. Reassess impact after mitigation. Watch for silent corruption, backlog,
   retries, secondary saturation, or delayed consumers after headline metrics
   recover.
9. Declare stabilization only when user-impact and system-health signals remain
   within stated bounds for an appropriate window. Hand off residual recovery,
   root-cause investigation, and evidence retention explicitly.

## Communication discipline

- Use `references/incident-record.md` as the shared source of truth.
- Publish facts, actions, owners, timestamps, and next update time. Avoid raw
  speculation in stakeholder updates.
- Mark decisions with rationale and the evidence expected to confirm or reverse
  them.
- Never expose credentials, exploit details, private user data, or sensitive
  internal identifiers in broad updates.

## Exit conditions

End triage with current severity, confirmed impact, mitigation state, residual
risk, recovery owner, next checkpoint, and whether root-cause work is separate.
Do not declare resolution merely because alert volume dropped.
