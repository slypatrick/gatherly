# Gatherly — deploy to a different Cloudflare account

This repository is a source-code snapshot, **not** a live-data backup.

## Components and source-of-truth

| Worker | Purpose | Storage |
| --- | --- | --- |
| `gatherly-compare` | Current main app | `GATHERLY_KV` (production KV) |
| `gatherly-compare-staging` | Test app; identical Worker source | `GATHERLY_KV` (separate staging KV) |
| `gatherly-shortcut-download` | iOS shortcut download | `KV` |
| `gatherly-shortcut-v6` | Another iOS shortcut helper | `KV` |
| `gatherly-hub` | Earlier discovery app | `DB` (Cloudflare D1) |

The main production Worker also has a scheduled event at **07:00 UTC daily** (`0 7 * * *`). Avoid running this scheduled task against real user state from two Cloudflare accounts simultaneously.

## Local build & validation

```sh
npm install
npm run build
npm run check
```

The large main Worker was exported in exact numbered segments for reliable transport. `npm run build` reconstructs `dist/gatherly-compare.js` and verifies its SHA-256 against the original production Worker. If verification fails, deployment should stop.

## Provision a **new empty** destination

1. Log in to the desired Cloudflare account using Wrangler (`npx wrangler whoami`). Do not accidentally use the original production account.
2. Provision **two separate new KV namespaces**, one production and one staging:

   ```sh
   npx wrangler kv namespace create gatherly-prod
   npx wrangler kv namespace create gatherly-staging
   ```

3. Replace the placeholder KV namespace ID in `wrangler.jsonc` with the new production namespace ID, and in `wrangler.staging.jsonc` with the new staging namespace ID. The binding must remain named `GATHERLY_KV`.
4. Deploy and test staging **first**:

   ```sh
   npm run deploy:staging
   ```

   The staging config deliberately has **no cron schedule**.

5. Optionally create a new KV namespace for the shortcut workers (or use a separate one as appropriate), set the `KV` binding in `config/wrangler.shortcut.jsonc` and `config/wrangler.shortcut-v6.jsonc`, then deploy these optional Workers.

6. If maintaining the **older D1-based hub**, create a **new D1 database** and use the included schema `database/legacy-hub-schema.sql` for a fresh empty instance. For a production-data move, use a private encrypted D1 export/import instead.

7. Only after reviewing and testing all application flows should you deploy the new main Worker:

   ```sh
   npm run deploy
   ```

## Preserve existing users, collections and saved items

**Do not assume source-code publication transfers data.** User accounts, board membership, folders, saved items, private URLs, invite records, uploaded media and session state may be stored in Cloudflare KV or in the older D1 database.

For a complete account-to-account migration:

1. Inventory all relevant storage namespaces and any external integrations.
2. Take encrypted, access-controlled, complete **KV exports**, preserving values and metadata; handle pagination and verify item counts.
3. If still used, take an encrypted **D1 export** for `gatherly-discovery-hub`.
4. Pause writes to the old main app at the final synchronization point; export again to include last-minute changes.
5. Restore only into clean destination storage, with separate staging and production namespaces.
6. Reconfigure callback URLs, permissions, scheduled events, storage bindings and new account-specific Worker hostnames.
7. Reconcile saved items, collaborators, invitations, boards, account access, missing metadata, and shared collection visibility.
8. Test iPhone/Safari PWA install, link sharing, Facebook/Marketplace links, comparisons, refresh-on-scroll, and shortcuts.
9. Only then authorize cutover. Retain original storage for rollback. Never have both old and new deployments accept independent writes.

### Compatibility

The current Worker uses the **legacy Service Worker event-handler format** and an embedded HTML/CSS/JS page. The `compatibility_date` in the source repository is a recommended initial template, not an assertion of the exact date used by the original raw deployed Worker (its settings did not expose one). Validate behavior in staging before production deployment.

The public Git repository is not connected to Cloudflare automatic deployments. No production migration has yet occurred.
