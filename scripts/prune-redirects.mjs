// Astro integration: after the build, drop redirect lines whose source page actually exists in dist/.
// Lets public/_redirects keep permanent fallbacks for /pages/<handle> that switch off automatically
// when the page is published (in Sanity or code) and switch back on if it's removed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default function pruneShadowedRedirects() {
  return {
    name: 'prune-shadowed-redirects',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const file = path.join(root, '_redirects');
        if (!fs.existsSync(file)) return;
        const exists = (from) =>
          !from.includes('*') &&
          [path.join(root, from, 'index.html'), path.join(root, `${from}.html`)].some((p) =>
            fs.existsSync(p),
          );
        const removed = [];
        const kept = fs
          .readFileSync(file, 'utf8')
          .split('\n')
          .filter((line) => {
            const from = line.trim().split(/\s+/)[0];
            if (!from || from.startsWith('#') || !exists(from)) return true;
            removed.push(from);
            return false;
          });
        fs.writeFileSync(file, kept.join('\n'));
        if (removed.length)
          logger.info(`dropped ${removed.length} redirect(s) shadowed by real pages: ${removed.join(', ')}`);
      },
    },
  };
}
