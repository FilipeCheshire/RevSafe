import { readFile } from 'node:fs/promises';

// Serve preview does not apply Firebase headers. Reproduce them in browser tests.
export async function applyHostingHeaders(context) {
  const config = JSON.parse(await readFile('firebase.json', 'utf8'));
  const headers = Object.fromEntries(config.hosting.headers.find(h => h.source === '**').headers.map(h => [h.key.toLowerCase(), h.value]));
  await context.route('http://localhost:3000/**', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), ...headers } });
  });
}
