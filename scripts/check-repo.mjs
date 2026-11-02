import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
execFileSync(process.execPath,[join(root,'scripts/build-worker.mjs')],{stdio:'inherit'});
for(const path of ['dist/gatherly-compare.js','workers/gatherly-shortcut-download.js','workers/gatherly-shortcut-v6.js','legacy/gatherly-hub.mjs']){
 execFileSync(process.execPath,['--check',join(root,path)],{stdio:'inherit'});
}
const source=readFileSync(join(root,'dist/gatherly-compare.js'),'utf8');
if(!source.includes('GATHERLY_KV'))throw new Error('Missing production KV binding references');
if(!source.includes('addEventListener'))throw new Error('Missing Worker event listeners');
if(/gh[pousr]_[A-Za-z0-9]{12,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/.test(source))throw new Error('Potential credential in public source');
console.log('All exported Worker source files parse successfully.');
