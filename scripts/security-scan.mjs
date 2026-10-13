import { createHash } from 'node:crypto';
import { readdir, readFile, lstat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import ignore from 'ignore';

const ignored = ignore().add(await readFile('.gitignore', 'utf8')).add('.git/');
async function walk(dir = '') {
  const result = [];
  for (const entry of await readdir(dir || '.', { withFileTypes: true })) {
    const name = dir ? `${dir}/${entry.name}` : entry.name;
    if (ignored.ignores(name + (entry.isDirectory() ? '/' : ''))) continue;
    if (entry.isSymbolicLink()) { result.push(name); continue; }
    if (entry.isDirectory()) result.push(...await walk(name)); else result.push(name);
  }
  return result;
}
const git = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' });
const hasGit = git.status === 0;
const files = hasGit ? [...new Set(git.stdout.split('\0').filter(Boolean))] : await walk();
const findings = [];
const reviewedAssets = JSON.parse(await readFile('scripts/reviewed-assets.json', 'utf8'));
const patterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['Google API key', /AIza[0-9A-Za-z_-]{35}/],
  ['AWS access key', /(?:AKIA|ASIA)[A-Z0-9]{16}/],
  ['GitHub token', /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,})/],
  ['provider token', /\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{24,}/],
  ['Slack token', /xox[baprs]-[0-9A-Za-z-]{20,}/],
  ['credential URL', /https?:\/\/[^\s/"'<>]+:[^\s/"'<>]+@/],
  ['assigned secret', /(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[=:]\s*["'][A-Za-z0-9_+\/-]{20,}["']/i],
];
for (const file of files) {
  const normalized = file.replaceAll('\\', '/');
  if (ignored.ignores(normalized) && hasGit) findings.push({ file, issue: 'Tracked file is ignored by the publication rules' });
  if (/(?:^|\/)(?:\.env(?:\..*)?|\.npmrc)$/.test(normalized) && normalized !== '.env.example') findings.push({ file, issue: 'Local configuration in publication set' });
  if (/\.(?:pem|key|p12|pfx)$|(?:service.?account|firebase-adminsdk).*\.json$/i.test(normalized)) findings.push({ file, issue: 'Potential credential file' });
  const stat = await lstat(file);
  if (stat.isSymbolicLink()) { findings.push({ file, issue: 'Review symlink before publication' }); continue; }
  if (stat.size > 2_000_000) { findings.push({ file, issue: 'File exceeds automatic inspection limit' }); continue; }
  const bytes = await readFile(file);
  const content = bytes.toString('utf8');
  if (content.includes('\0')) {
    const approved = reviewedAssets[normalized];
    if (!approved || approved.sha256 !== createHash('sha256').update(bytes).digest('hex')) findings.push({ file, issue: 'Binary file requires manual inspection or has changed since review' });
    continue;
  }
  for (const [issue, pattern] of patterns) if (pattern.test(content)) findings.push({ file, issue });
}
console.log(JSON.stringify({ scope: hasGit ? 'Current tracked and untracked publication files; history not scanned' : 'Current files respecting .gitignore; no Git repository/history available', inspected: files.length, findings }, null, 2));
if (findings.length) process.exitCode = 1;
