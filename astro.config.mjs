import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const servePublicDirIndex = {
  name: 'serve-public-dir-index',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0];
      if (!url || url.includes('.')) return next();
      if (!url.endsWith('/')) {
        // Redirect to trailing-slash so relative asset paths resolve correctly
        if (existsSync(join('public', url, 'index.html'))) {
          res.writeHead(302, { 'Location': url + '/' });
          res.end();
          return;
        }
      } else {
        // Serve directory index
        const indexPath = join('public', url, 'index.html');
        if (existsSync(indexPath)) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(readFileSync(indexPath));
          return;
        }
      }
      next();
    });
  }
};

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss(), servePublicDirIndex],
  }
});
