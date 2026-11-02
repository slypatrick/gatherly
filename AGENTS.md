# Gatherly — developer and coding-agent notes

Gatherly is an existing mobile-first Cloudflare app for collaborative boards, product discoveries, comparison, and saved links. Styling aims for a premium Pinterest-like mobile experience and uses TND for displayed product currencies.

## Preserve existing architecture

- Active production Worker: \`gatherly-compare\` (legacy Service Worker syntax), with KV binding \`GATHERLY_KV\`.
- Staging Worker: \`gatherly-compare-staging\`, separate KV namespace and no scheduled task.
- Main Worker source is reconstructed by \`npm run build\`, which validates the exact SHA-256; **never edit only the generated dist file**.
- Source segments in \`workers/compare.parts\` are an immutable export. To make app changes, first produce a conventional maintainable source file and build workflow that preserves all behavior.
- Separate shortcut Workers and legacy D1 hub are included as supporting/archival components.

## Rules for changes

1. Never touch or reset production data without explicit authorization.
2. Never commit authentication tokens, users' data, password hashes, private saved items or live KV/D1 exports.
3. Keep authenticated collections isolated; preserve collaborator permissions and notification behavior.
4. Avoid PWA/mobile regressions (iPhone 13 viewport, notch, bottom navigation, lazy placeholders, native share shortcuts).
5. Preserve URL ingestion, media streaming without saving shared videos, "purchased" indicators, batch health checks, transparent comparisons, and the app's French/English behavior where implemented.
6. Changes should be incremental and reviewable, with staging tests and security checks.
7. Production cron \`0 7 * * *\` UTC: test before restoring, avoid duplicate runs.
8. Prefer a separate feature branch and no production deploy until approved.

Review the project source and \`docs/DEPLOYMENT.md\` before modifying storage or deployment.
