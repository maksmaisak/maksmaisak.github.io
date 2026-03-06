# AGENTS.md

## Purpose

This repo is Maks Maisak's GitHub Pages portfolio site.

The current main area of ongoing work is `metro-awakening.html`, a detailed portfolio case study for AI programming work on **Metro Awakening**.

## Stable structure

- `index.html` — résumé / homepage
- `portfolio.html` — portfolio index
- `metro-awakening.html` — main in-progress Metro Awakening case-study page
- `style.css` — shared styling for older pages
- `images/metro_awakening/` — final website-ready Metro Awakening media
- `vertigo_studios_amsterdam_work_history/` — internal research and work-history notes used to verify portfolio claims
- `metro-awakening-videos/` — Remotion project for previewing and rendering Metro Awakening clips / montages

## Metro Awakening guidance

Use `metro-awakening.html` for page content, layout, and media slots.

Use `vertigo_studios_amsterdam_work_history/` to fact-check implementation details, dates, ownership, and technical claims before rewriting page copy.

Use `metro-awakening-videos/` for video preview/render work. Important files are usually:
- `src/Root.tsx`
- `src/Clip.tsx`
- montage files in `src/`
- `preview_chrome.bat`
- render batch files
- `source_media/` for capture/transcode helpers and local raw inputs

## Defaults to preserve

- Keep the Metro Awakening page technically specific, not generic marketing copy.
- Treat Maks as the sole AI programmer on the project unless the user asks to soften or change that wording.
- Keep final website assets in `images/metro_awakening/`.
- Keep raw/local capture material out of git unless the user explicitly asks otherwise.

## Common tasks

- Revise Metro page copy: edit `metro-awakening.html`, verify facts in `vertigo_studios_amsterdam_work_history/`
- Add or replace media on the page: update `metro-awakening.html`, put final outputs in `images/metro_awakening/`
- Add or adjust video compositions: edit `metro-awakening-videos/src/`, then update Remotion render helpers if needed
- Troubleshoot missing video preview/render: start with `metro-awakening-videos/src/Clip.tsx`
