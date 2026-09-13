import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function dataSyncPlugin(): Plugin {
  const cacheDir = path.resolve(__dirname, 'node_modules/.cache');
  const storiesFilePath = path.resolve(cacheDir, 'stories_store.json');
  const incidentsFilePath = path.resolve(cacheDir, 'incidents_store.json');

  return {
    name: 'data-sync-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        let targetFilePath = '';
        if (url === '/api/stories') targetFilePath = storiesFilePath;
        else if (url === '/api/incidents') targetFilePath = incidentsFilePath;

        if (targetFilePath) {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            if (fs.existsSync(targetFilePath)) {
              try {
                const data = fs.readFileSync(targetFilePath, 'utf-8');
                res.end(data);
                return;
              } catch (e) {
                // fallback
              }
            }
            res.end(JSON.stringify([]));
            return;
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                if (!fs.existsSync(cacheDir)) {
                  fs.mkdirSync(cacheDir, { recursive: true });
                }
                fs.writeFileSync(targetFilePath, body, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err?.message || 'Failed to save' }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dataSyncPlugin()],
  server: {
    port: 5173,
    open: false,
  },
});
