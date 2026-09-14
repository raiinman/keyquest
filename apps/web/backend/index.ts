import { router, json, error } from '@appdeploy/sdk';

const CLIENT_URL = 'https://images.neopets.com/keyquest/game/kq2/KeyQuest.swf?v=32';

export const handler = router({
  'GET /api/_healthcheck': [async () => json({ message: 'Success', mode: 'local-alpha', productionWrites: false })],
  'GET /api/client': [async () => {
    try {
      const response = await fetch(CLIENT_URL, { method: 'GET', headers: { Accept: 'application/x-shockwave-flash,*/*' } });
      if (!response.ok) return error(`Neopets CDN returned HTTP ${response.status}`, 502);
      const data = Buffer.from(await response.arrayBuffer());
      if (data.byteLength > 1024 * 1024) return error('Unexpectedly large client response', 502);
      return json({ sourceUrl: CLIENT_URL, contentType: response.headers.get('content-type') || 'application/octet-stream', bytes: data.byteLength, base64: data.toString('base64') });
    } catch (cause) {
      console.error('Key Quest source fetch failed', cause);
      return error('Unable to fetch surviving Key Quest client', 502);
    }
  }],
});

