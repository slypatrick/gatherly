import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir=join(root,'workers','compare.parts');
const names=readdirSync(dir).filter(x=>/^part-[0-9]+[a-z]?[.]txt$/.test(x)).sort();
const expected=[
 'part-00.txt','part-01.txt','part-02.txt','part-03.txt','part-04.txt','part-05.txt',
 'part-06.txt','part-07.txt','part-08.txt','part-09.txt',
 'part-10a.txt','part-10b.txt','part-11a.txt','part-11b.txt','part-12.txt'
];
if(JSON.stringify(names)!==JSON.stringify(expected))throw new Error('Missing, extra or out-of-order source segments');
const source=names.map(name=>readFileSync(join(dir,name),'utf8')).join('');
const digest=createHash('sha256').update(source,'utf8').digest('hex');
const expectedDigest='a1a0f7f37817de0147980f6079a49959a83049bc5e5a759e0c968c644126cd06';
if(digest!==expectedDigest)throw new Error('Gatherly source checksum mismatch; refusing to build: '+digest);
const dest=join(root,'dist');
mkdirSync(dest,{recursive:true});
writeFileSync(join(dest,'gatherly-compare.js'),source,'utf8');
console.log('Gatherly Worker rebuilt and SHA-256 verified: '+digest);
console.log('Output: dist/gatherly-compare.js');
