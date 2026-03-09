---
name: application-tailoring
description: Build bespoke job applications for Maks Maisak from repository-backed facts. Use this whenever the user provides a job listing, company page, recruiter message, or asks for a tailored CV/résumé, cover letter, interview-prep notes, or a full application package. This skill must research the target company and role, match requirements against repository evidence, ask when evidence is ambiguous, and generate factual application outputs without inventing claims.
---

# Application Tailoring

Create a tailored job application package from repository-backed facts.

## Use This Skill When

- The user wants a tailored application for a specific job or company
- The user provides a job URL, recruiter message, or role description
- The user wants a custom résumé/CV PDF, cover letter PDF, or interview-prep notes
- The user asks how well a role matches the repository evidence

## Core Rule

External research may shape the company-specific framing.

Claims about Maks's experience, dates, technologies, ownership, shipped work, and accomplishments must come only from repository-backed facts or already approved source files. If evidence is missing or ambiguous, ask instead of inferring.

## Dependencies

- Prefer using an account-research capability to research the target company and role.
- Prefer using a PDF capability to produce final PDFs.
- If the needed supporting skill is unavailable, use `find-skills` or otherwise surface the missing dependency clearly before continuing.

## Repository Inputs

Read these first:

- `job-search/README.md`
- `job-search/facts/`
- `index.html`
- `portfolio.html`
- `metro-awakening.html`

Then read the guidance in `references/repository-layout.md` and `references/evidence-policy.md`.

## Outputs

For a full application, produce all of these unless the user asks for a subset:

1. Tailored résumé source file
2. Tailored résumé PDF
3. Tailored cover-letter source file
4. Tailored cover-letter PDF
5. Interview-prep notes
6. Evidence manifest mapping job requirements to repository facts

Store work under `job-search/applications/<company>-<role>-<date>/`.

## Workflow

1. Parse the role and company.
2. Research the company and job context.
3. Extract the role requirements into priority buckets:
   - must-have
   - strong signals
   - nice-to-have
   - likely interview themes
4. Search the repository fact sources for matching evidence.
5. Build an evidence manifest before drafting application copy.
6. Ask targeted questions where wording or evidence is ambiguous.
7. Draft tailored source files from templates.
8. Produce PDFs.
9. Produce interview-prep notes using the same evidence set.

## Evidence Manifest

Always create a manifest that records:

- target requirement
- selected evidence
- source files used
- confidence
- gaps or user-confirmed overrides

This is the guardrail that keeps the workflow factual.

## Writing Rules

- Optimize for the target role, but do not oversell.
- Reorder and compress evidence; do not invent new evidence.
- Prefer direct, concrete language over broad claims.
- Follow `../../references/ai-writing-tropes.md` when drafting or revising prose. Treat it as a full reference, not a summary to paraphrase from memory.
- Keep the public website style and the application-document style distinct.
- Remove the photo from the tailored résumé by default unless the user requests otherwise.

## Clarification Rules

Ask before proceeding when any of these are unclear:

- current role wording for this application
- exact scope wording such as "sole AI programmer"
- whether a metric is safe to mention
- whether a shipped impact statement is directly supported
- whether a company-specific angle should emphasize AI depth, leadership, VR, optimization, or tooling

## Template Usage

- Use `templates/resume-template.md` for résumé source content.
- Use `templates/cover-letter-template.md` for cover letter source content.
- Adapt structure to the role, but keep every factual bullet traceable to the evidence manifest.