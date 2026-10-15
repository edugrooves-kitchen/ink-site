#!/usr/bin/env node
// Checks that every file in dist/ matches dist/MANIFEST.json byte for byte, and that nothing was added.
// Usage: node scripts/verify.mjs [dir]   (default: dist)
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.argv[2] ?? 'dist');

function files(d, prefix = '') {
  return readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(d, e.name), `${prefix}${e.name}/`) : [`${prefix}${e.name}`],
  );
}

const manifest = JSON.parse(readFileSync(path.join(dir, 'MANIFEST.json'), 'utf8'));
const listed = new Set(Object.keys(manifest.files));
const problems = [];
for (const [name, { sha256 }] of Object.entries(manifest.files)) {
  let got = null;
  try { got = createHash('sha256').update(readFileSync(path.join(dir, name))).digest('hex'); } catch { /* missing */ }
  if (got !== sha256) problems.push(`${name}: ${got ? 'hash differs' : 'missing'}`);
}
for (const name of files(dir)) {
  if (name !== 'MANIFEST.json' && !listed.has(name)) problems.push(`${name}: not in the manifest`);
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`${listed.size} files match MANIFEST.json`);
