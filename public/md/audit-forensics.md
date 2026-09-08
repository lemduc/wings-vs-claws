# Audit, logging & forensics

> Every access decision is a record you might need later. What you can investigate after an incident was decided long before it — by what you chose to collect, and what you were allowed to.

## Identity events come from everywhere, and investigators are not the only readers

Sign-ins, directory changes, consent grants, token issuance, policy decisions and admin actions are produced by different systems and land in one pipeline. Security investigation is only one consumer of it — compliance reporting, access reviews, billing and product analytics read the same stream and want different fields and different retention. Designing the pipeline for investigation alone is how teams end up with logs nobody can afford to keep.

## What a good identity record contains

Who acted, what they did, when, from where, on whose behalf, what the decision was, and why — plus a correlation id that stitches one login to the twenty downstream calls it caused. The "why" is the field most often missing and most often needed: a log that says "denied" without the rule that denied it turns every investigation into a re-derivation.

## There is no single logging standard, and that is a procurement question

Each layer brings its own: syslog and CEF at the infrastructure edge, OpenTelemetry for traces, cloud-provider audit schemas for control-plane actions, SCIM events for lifecycle changes, and vendor-specific formats for the identity provider itself. Nothing normalizes them for you. When evaluating a platform, "which events, in what schema, retained how long, exportable how" is a sharper question than "do you have audit logs".

## Retention is tiered because storage is not free

Hot storage answers this week’s questions in seconds; warm holds months at query latency; cold is cheap archive you restore under subpoena. The trap is choosing tiers on cost alone and finding the window you kept is shorter than the time it takes to notice a breach — typically measured in months, not days. Authentication failures, privilege changes and consent grants are the categories worth keeping longest.

## You can only investigate what you were permitted to collect

In the Storm-0558 intrusion, the victim that discovered the campaign did so using a mailbox-access log available only in a higher-priced licence tier; organizations without it could not have seen the same activity in their own tenants. After public pressure the vendor made the expanded logs available at every tier and doubled the default retention. The control that mattered was not a preventive one — read the case file.

## How it changes for AI agents

An agent multiplies events — one human instruction becomes hundreds of tool calls — and it acts on behalf of someone, so a log line naming only the agent answers the wrong question. The record has to carry the actor chain (the token’s act claim is exactly this) so you can ask "what did this agent do, for which user, under whose authority" and get an answer. Without it, attribution stops at the service account, and so does the investigation.

## Quick check

1. Which field is most often missing from an identity log and most needed in an investigation?
   - Answer: The reason for the decision — A bare "allowed" or "denied" forces the investigator to re-derive why, months later, from a policy that may since have changed.
2. Why does a correlation id matter?
   - Answer: It stitches one login to the downstream calls it caused — Without it, one session’s activity is scattered across systems with no way to reassemble it.
3. The logging lesson of Storm-0558 is that…
   - Answer: Detection capability can sit behind a licence tier — The victim detected it through a mailbox-access log that required a premium tier; others could not have seen the same activity.

---
Source: https://iam.vjsonline.org/learn/audit-forensics · Part of Wings vs Claws — Learn IAM — from directories to agents. An interactive, source-grounded guide to identity & access management for the AI-agent era.
