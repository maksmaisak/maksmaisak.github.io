# Repository Layout

## Stable skill assets

Keep stable workflow assets inside the skill:

- `SKILL.md`
- reference guides
- template skeletons

## Changing data

Keep changing data outside the skill:

- `job-search/facts/` for source-of-truth experience notes
- `job-search/applications/` for generated application material
- `job-search/company-research/` for target-specific research snapshots

This separation keeps the skill reusable while letting the evidence base grow over time.