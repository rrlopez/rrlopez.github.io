import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(
  /^\/([A-Z]:)/,
  '$1',
);

const pages = [
  {
    html: 'index.html',
    astro: 'src/pages/index.astro',
    fragment: 'src/content/index.html',
    layout: 'HomeLayout',
  },
  {
    html: 'nuvelco-cca.html',
    astro: 'src/pages/nuvelco-cca.html.astro',
    fragment: 'src/content/nuvelco-cca.html',
    layout: 'ProjectLayout',
  },
  {
    html: 'start-pos.html',
    astro: 'src/pages/start-pos.html.astro',
    fragment: 'src/content/start-pos.html',
    layout: 'ProjectLayout',
  },
  {
    html: 'overlay-manager.html',
    astro: 'src/pages/overlay-manager.html.astro',
    fragment: 'src/content/overlay-manager.html',
    layout: 'OverlayLayout',
  },
  {
    html: 'blog/offline-app-shell.html',
    astro: 'src/pages/blog/offline-app-shell.html.astro',
    fragment: 'src/content/blog/offline-app-shell.html',
    layout: 'BlogLayout',
  },
  {
    html: 'blog/offline-auth-engine.html',
    astro: 'src/pages/blog/offline-auth-engine.html.astro',
    fragment: 'src/content/blog/offline-auth-engine.html',
    layout: 'BlogLayout',
  },
  {
    html: 'blog/making-db-closer-to-app.html',
    astro: 'src/pages/blog/making-db-closer-to-app.html.astro',
    fragment: 'src/content/blog/making-db-closer-to-app.html',
    layout: 'BlogLayout',
  },
  {
    html: 'blog/overlay-manager-deep-dive.html',
    astro: 'src/pages/blog/overlay-manager-deep-dive.html.astro',
    fragment: 'src/content/blog/overlay-manager-deep-dive.html',
    layout: 'BlogLayout',
  },
];

function extractMeta(html, name) {
  if (name === 'title') {
    const m = html.match(/<title>([\s\S]*?)<\/title>/);
    return m ? m[1].trim() : '';
  }
  const m = html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`));
  return m ? m[1] : '';
}

function stripScrollTop(body) {
  return body
    .replace(/<!-- ===== SCROLL TO TOP ===== -->[\s\S]*?<\/script>\s*/m, '')
    .replace(/<!-- SCROLL TO TOP -->[\s\S]*?<\/script>\s*/m, '');
}

function fixLinks(body) {
  return body
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href="index\.html#blog"/g, 'href="/#blog"')
    .replace(/href="\/index\.html"/g, 'href="/"')
    .replace(/href="\/index\.html#blog"/g, 'href="/#blog"');
}

function inlineScripts(body) {
  return body.replace(
    /<script(?![^>]*\bis:inline\b)(?![^>]*\bsrc=)/g,
    '<script is:inline',
  );
}

function layoutImportPath(astroPath, layout) {
  const depth = astroPath.split('/').length - 2;
  const prefix = '../'.repeat(depth);
  return `${prefix}layouts/${layout}.astro`;
}

function fragmentImportPath(astroPath, fragment) {
  const depth = astroPath.split('/').length - 2;
  const prefix = '../'.repeat(depth);
  const rel = fragment.replace(/^src\//, '');
  return `${prefix}${rel}?raw`;
}

function migrate({ html, astro, fragment, layout }) {
  const htmlPath = join(ROOT, html);
  const content = readFileSync(htmlPath, 'utf8');
  const title = extractMeta(content, 'title');
  const description = extractMeta(content, 'description');

  const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) throw new Error(`No body in ${html}`);

  let body = stripScrollTop(bodyMatch[1].trim());
  body = fixLinks(body);
  body = inlineScripts(body);

  const fragmentPath = join(ROOT, fragment);
  mkdirSync(dirname(fragmentPath), { recursive: true });
  writeFileSync(fragmentPath, body, 'utf8');

  const layoutImport = layoutImportPath(astro, layout);
  const fragmentImport = fragmentImportPath(astro, fragment);
  const fragmentName = basename(fragment, '.html').replace(/-/g, '_');

  const astroContent = `---
import ${layout} from '${layoutImport}';
import ${fragmentName}Html from '${fragmentImport}';
---

<${layout} title={${JSON.stringify(title)}} description={${JSON.stringify(description)}}>
  <Fragment set:html={${fragmentName}Html} />
</${layout}>
`;

  const outPath = join(ROOT, astro);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, astroContent, 'utf8');
  console.log(`Migrated ${html} -> ${astro}`);
}

for (const page of pages) {
  migrate(page);
}

console.log('Done.');
