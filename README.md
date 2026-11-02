# Gatherly

Gatherly is a mobile-first discovery and wishlist app for saving and organizing products, pages, and links into shared collections. It supports collaborative boards, item status, comparison features and multiple currencies, with TND as the preferred display currency.

## Production architecture

This repository is an **exported snapshot** of the existing Cloudflare deployment. It is public **source code only** and contains no production KV/D1 records or account information.

- `workers/gatherly-compare.js` – main production application (legacy Cloudflare Service Worker script; inlines its HTML/CSS/JS).
- `workers/gatherly-shortcut-download.js` – iOS shortcut download helper.
- `workers/gatherly-shortcut-v6.js` – alternate iOS shortcut helper.
- `legacy/gatherly-hub.mjs` – earlier D1-backed Gatherly hub, kept for reference.
- `database/legacy-hub-schema.sql` – structure of the earlier D1 database, **without records**.
- `wrangler.jsonc` – template for the current main Worker and production cron schedule.
- `config/README.md` – Cloudflare resource inventory and migration notes.
- `docs/DEPLOYMENT.md` – setup and verification checklist.
- `AGENTS.md` – instructions for Claude or other coding assistants.

## Important before deployment

The **main Gatherly app stores state in a Cloudflare KV namespace** bound as `GATHERLY_KV`. Production and staging use different KV namespaces. The older `gatherly-hub` app uses a separate Cloudflare D1 database. Public source does not contain stored account data, collection contents, transactions, private item URLs, user tokens, or KV/D1 snapshots.

Never reuse the production namespace ID when testing. Create new KV namespaces in the destination account and update the `wrangler.jsonc` binding IDs. Verify the `0 7 * * *` UTC scheduled job before enabling it in production.

For details, follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Migrate private data separately using access-controlled exports, and don't switch traffic until reconciliation succeeds.

## Security

Keep personal records, API tokens, OAuth secrets, password hashes, and session data out of Git. Do not add `.env`, `.dev.vars`, KV exports, or D1 exports. Running this public repository does **not** transfer your live accounts or saved items.

## Live deployment

Publishing or editing this GitHub repository does **not** automatically deploy changes to Cloudflare. The existing production application remains the source of truth until you explicitly authorize an account migration and cutover.
