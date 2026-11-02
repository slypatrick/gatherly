# Gatherly

Gatherly is a mobile-first collaborative discovery and wishlist app for saving links, products, inspiration, and marketplace finds into shared collections. It supports boards, collaborators, item status, comparisons, and product information in TND.

This repository is a **public-source snapshot** of the actual Cloudflare deployment as of **November 2, 2026**. It contains code, configuration templates, and an empty legacy database schema. It contains **no account records, personal data, private KV contents, or database rows**.

## Source files

| File or folder | Description |
| --- | --- |
| [workers/compare.parts/](workers/compare.parts/) | Exactly preserved segments of the current production \`gatherly-compare\` Worker |
| [scripts/build-worker.mjs](scripts/build-worker.mjs) | Concatenates segments into the original \`dist/gatherly-compare.js\`, validating its SHA-256 hash |
| [workers/gatherly-shortcut-download.js](workers/gatherly-shortcut-download.js) | iOS share shortcut download Worker |
| [workers/gatherly-shortcut-v6.js](workers/gatherly-shortcut-v6.js) | Additional iOS share shortcut Worker |
| [legacy/gatherly-hub.mjs](legacy/gatherly-hub.mjs) | Earlier D1-backed Gatherly hub Worker |
| [database/legacy-hub-schema.sql](database/legacy-hub-schema.sql) | Structural D1 schema only; **no user data** |
| [wrangler.jsonc](wrangler.jsonc) | Main Worker destination-account configuration template |
| [wrangler.staging.jsonc](wrangler.staging.jsonc) | Staging Worker with a **different** KV namespace |
| [config/](config/) | Optional component config templates |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Cloudflare deployment and safe data-migration instructions |
| [AGENTS.md](AGENTS.md) | Instructions for Claude or other coding agents |

The production Worker is relatively large and includes the app's HTML/CSS/JS. For reliable export through the connected services, its original source was split into numbered **source segments**. The build script joins these segments verbatim and refuses to proceed if the hash differs from production. The built \`dist/\` file is gitignored, but is ready for Wrangler deployment.

## Build locally

\`\`\`sh
npm install
npm run build
npm run check
\`\`\`

## Data architecture

- **Current application:** Cloudflare Worker \`gatherly-compare\` with KV binding \`GATHERLY_KV\`.
- **Production data:** Stored in the source Cloudflare KV namespace, **not included here**.
- **Staging:** Separate Worker \`gatherly-compare-staging\` with **its own** KV namespace.
- **Older system:** Worker \`gatherly-hub\` using the D1 database \`gatherly-discovery-hub\`.
- **Scheduled task:** Production Worker cron \`0 7 * * *\` (UTC). Do not enable it in staging.

Follow [the deployment guide](docs/DEPLOYMENT.md) to provision new Cloudflare namespaces. Never point a test Worker at the original production KV binding.

## Safety and status

The existing live Cloudflare deployment has **not been changed**. Pushing this repository does not automatically deploy or migrate data. A separate controlled KV/D1 export/import, security review, and explicit cutover are required to move live accounts, boards, saved items, and collaborations.

**Never commit** account credentials, OAuth secrets, passwords, user sessions, KV exports, D1 exports, or private item content.
