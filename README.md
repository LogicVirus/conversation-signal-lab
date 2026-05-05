# Conversation Signal Lab

Consent-first prototype for extracting probabilistic signals from short conversation samples.

## What it does

- Builds a lightweight word cloud from pasted conversation text.
- Scores media/content-affinity vibes with visible evidence.
- Scores communication-style signals without claiming hidden facts about a person.
- Suggests follow-up questions to improve confidence.

## Local development

```bash
bun install
bun run dev
```

## Validation

```bash
bun run lint
bun run build
```

## Deployment

This app is Vercel-ready via `vercel.json` using Bun install/build and Vite's `dist` output.
