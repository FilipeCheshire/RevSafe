import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd(), false);

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(e => e.isDirectory() ? htmlFiles(join(directory, e.name)) : e.name.endsWith('.html') ? [join(directory, e.name)] : []));
  return groups.flat();
}
const hashes = new Set();
for (const file of await htmlFiles('out')) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\bsrc\s*=/i.test(match[1]) && match[2]) hashes.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
  }
}
if (!hashes.size) throw new Error('No inline script hashes found in the export.');
let connect = "'self'";
if (process.env.NEXT_PUBLIC_CHAT_API_URL) {
  const endpoint = new URL(process.env.NEXT_PUBLIC_CHAT_API_URL);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new Error('Chat endpoint must be HTTPS, without credentials, query parameters or fragments.');
  connect += ` ${endpoint.origin}`;
}
const policy = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].sort().join(' ')}`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https://images.unsplash.com data:",
  "font-src 'self'", `connect-src ${connect}`, "object-src 'none'",
  "base-uri 'none'", "frame-ancestors 'none'", "form-action 'self'",
].join('; ');
const headers = [
  { key: 'Content-Security-Policy', value: policy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
];
const config = JSON.parse(await readFile('firebase.json', 'utf8'));
config.hosting.headers = [{ source: '**', headers }, ...config.hosting.headers.filter(h => h.source !== '**')];
await writeFile('firebase.json', JSON.stringify(config, null, 2) + '\n');
console.log(`Security headers generated with ${hashes.size} inline script hashes.`);
