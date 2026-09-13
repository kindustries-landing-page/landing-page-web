import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { api } from './api';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const upstream = process.env.API_UPSTREAM_URL || 'http://localhost:10022';
  const upstreamUrl =
    upstream.startsWith('http://') || upstream.startsWith('https://')
      ? upstream
      : `http://${upstream}`;

  app.use(express.json());

  // Use local mock/static API routes for /api and /api/v1 (e.g. /products, /contact)
  app.use('/api/v1', api);
  app.use('/api', api);

  // Reverse proxy /api/v1 requests not handled by local router to upstream API
  app.use('/api/v1', async (req, res) => {
    try {
      const targetUrl = `${upstreamUrl}/api/v1${req.url}`;
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value && key !== 'host' && key !== 'content-length') {
          if (Array.isArray(value)) {
            for (const v of value) headers.append(key, v);
          } else {
            headers.set(key, value);
          }
        }
      }

      const body = ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body);

      const response = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
      });

      res.status(response.status);
      response.headers.forEach((value, key) => {
        if (key !== 'transfer-encoding' && key !== 'content-length') {
          res.setHeader(key, value);
        }
      });

      const responseBuffer = Buffer.from(await response.arrayBuffer());
      res.send(responseBuffer);
    } catch (err: unknown) {
      console.error('Error proxying to API upstream:', err);
      res.status(502).json({
        message: 'Failed to proxy request to upstream API',
        error: err instanceof Error ? err.message : String(err),
        statusCode: 502,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}, upstream: ${upstreamUrl}`);
  });
}

startServer();
