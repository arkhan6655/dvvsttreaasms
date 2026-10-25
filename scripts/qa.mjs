import fs from 'node:fs';
import path from 'node:path';
import { siteConfig, homePath } from '../site.config.mjs';

const DIST = path.resolve('dist');
const problems = [];
const notes = [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

if (!fs.existsSync(DIST)) {
  console.error('dist/ does not exist. Run npm run build first.');
  process.exit(1);
}

const allFiles = walk(DIST);
const relative = (file) => `/${path.relative(DIST, file).split(path.sep).join('/')}`;
const fileSet = new Set(allFiles.map(relative));
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));

const issue = (message) => problems.push(message);
const note = (message) => notes.push(message);

const fileExists = (urlPath) => {
  if (urlPath === '/') return fileSet.has('/index.html');
  if (fileSet.has(urlPath)) return true;
  if (!urlPath.endsWith('/') && fileSet.has(`${urlPath}/index.html`)) return true;
  if (urlPath.endsWith('/') && fileSet.has(`${urlPath}index.html`)) return true;
  return false;
};

const pages = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const url = relative(file).replace(/index\.html$/, '');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  pages.set(url, { file, html, ids });
}

for (const [url, page] of pages) {
  const { html } = page;
  const label = url || '/';

  if (!/<title>[^<]+<\/title>/.test(html)) issue(`${label}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) issue(`${label}: missing meta description`);
  if (!/<meta name="viewport"/.test(html)) issue(`${label}: missing viewport`);
  if (/mailto:/i.test(html)) issue(`${label}: contains a mailto: link`);
  if (/sha-?256|checksum|\bhash\b/i.test(html)) issue(`${label}: contains checksum/hash wording`);
  if (/adsbygoogle|pagead2|google_ad_client|adsense/i.test(html)) issue(`${label}: contains ad code`);
  if (/\bofficial\b/i.test(html)) issue(`${label}: contains the word "official"`);

  const withoutApkUrl = html.split(siteConfig.apk.url).join('');
  if (/github/i.test(withoutApkUrl)) issue(`${label}: mentions GitHub outside the APK link`);
  if (/versioncode/i.test(html)) issue(`${label}: discloses the version code`);
  if (/<dt>\s*Build\s*<\/dt>/i.test(html)) issue(`${label}: shows a Build fact row`);

  if (!html.includes('s10.histats.com/js15_as.js')) issue(`${label}: Histats script is missing`);
  if (!html.includes(`sstatic1.histats.com/0.gif?${siteConfig.analytics.histatsId}`)) {
    issue(`${label}: Histats noscript pixel is missing`);
  }
  const histatsAt = html.indexOf('js15_as.js');
  if (histatsAt >= 0 && histatsAt < html.length * 0.75) {
    issue(`${label}: Histats is not near the end of the document`);
  }

  if (!/rel="canonical"/.test(html) && !/name="robots" content="noindex/.test(html)) {
    issue(`${label}: indexable page has no canonical`);
  }
  if (/name="robots" content="index/.test(html) && !html.includes(`href="${siteConfig.siteUrl}${homePath}"`) && url === homePath) {
    issue(`${label}: homepage canonical is not the configured homepage`);
  }

  const externalScripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  for (const src of externalScripts) {
    if (!src.startsWith('/_astro/')) issue(`${label}: unexpected external script ${src}`);
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }
    if (href.startsWith('#')) {
      if (href.length > 1 && !page.ids.has(href.slice(1))) {
        issue(`${label}: missing same-page anchor ${href}`);
      }
      continue;
    }
    const [withoutHash, hash] = href.split('#');
    const pathOnly = withoutHash.split('?')[0];
    if (!pathOnly.startsWith('/')) {
      issue(`${label}: non-absolute internal href ${href}`);
      continue;
    }
    if (!fileExists(pathOnly)) {
      issue(`${label}: broken link ${href}`);
      continue;
    }
    if (hash) {
      const targetUrl = pathOnly.endsWith('/') ? pathOnly : `${pathOnly}/`;
      const target = pages.get(pathOnly.endsWith('/') ? pathOnly : targetUrl);
      if (target && !target.ids.has(hash)) issue(`${label}: missing anchor target ${href}`);
    }
  }
}

const home = pages.get(homePath);
if (!home) {
  issue(`Configured homepage ${homePath} was not built`);
} else {
  const apkHrefs = [...home.html.matchAll(/href="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((href) => href === siteConfig.apk.url);
  if (apkHrefs.length !== 1) issue(`Homepage should have exactly one direct APK link, found ${apkHrefs.length}`);
  if (!home.html.includes(`<title>${siteConfig.seoTitle}</title>`)) issue('Homepage title is not the SEO title');
  if (!home.html.includes(siteConfig.tagline)) issue('Homepage is missing the tagline');
  if (home.html.includes('target="_blank"') && !home.html.includes('rel="noopener"')) {
    issue('Homepage has target="_blank" without rel="noopener"');
  }
  if (!home.html.includes(`href="${siteConfig.siteUrl}${homePath}"`)) issue('Homepage canonical/email link missing');
}

const sitemapPath = path.join(DIST, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const locSet = new Set(locs);

  if (!locSet.has(`${siteConfig.siteUrl}${homePath}`)) issue('Sitemap does not include the configured homepage');
  if (locSet.has(`${siteConfig.siteUrl}/`)) issue('Sitemap includes the root redirect page');
  if (locs.some((loc) => loc.endsWith('/404/'))) issue('Sitemap includes the 404 page');

  // Every built directory page except the root redirect and 404 must be listed,
  // and the sitemap must not contain stale or hand-written URLs.
  const expected = [...pages.keys()]
    .filter((url) => url !== '/' && url.endsWith('/') && !url.endsWith('/404/'))
    .map((url) => `${siteConfig.siteUrl}${url}`);
  for (const loc of expected) {
    if (!locSet.has(loc)) issue(`Sitemap is missing ${loc}`);
  }
  for (const loc of locs) {
    if (!expected.includes(loc)) issue(`Sitemap contains unexpected URL ${loc}`);
  }
  notes.push(`Sitemap URLs: ${locs.length}`);
} else {
  issue('sitemap.xml is missing');
}

for (const stale of ['sitemap-index.xml', 'sitemap-0.xml']) {
  if (fs.existsSync(path.join(DIST, stale))) issue(`${stale} still exists; the site should have one sitemap`);
}

const robotsTxt = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
if (!robotsTxt.includes(`Sitemap: ${siteConfig.siteUrl}/sitemap.xml`)) {
  issue('robots.txt does not reference sitemap.xml');
}

if (fs.readFileSync(path.join(DIST, 'CNAME'), 'utf8').trim() !== 'vvstreams.site') {
  issue('CNAME does not contain vvstreams.site');
}

const apkResponse = await fetch(siteConfig.apk.url, { method: 'HEAD', redirect: 'follow' });
const apkSize = Number(apkResponse.headers.get('content-length'));
if (!apkResponse.ok) issue(`APK URL returned HTTP ${apkResponse.status}`);
if (Number.isFinite(apkSize) && apkSize > 0 && apkSize !== siteConfig.apk.sizeBytes) {
  issue(`APK size changed: live ${apkSize} bytes, configured ${siteConfig.apk.sizeBytes}`);
}

const cssFiles = allFiles.filter((file) => file.endsWith('.css'));
notes.push(`HTML pages: ${htmlFiles.length}`);
notes.push(`CSS files: ${cssFiles.length} (${cssFiles.map((file) => `${relative(file)} ${fs.statSync(file).size}B`).join(', ')})`);
notes.push(`Homepage HTML: ${(fs.statSync(home.file).size / 1024).toFixed(1)} KB`);
notes.push(`APK: HTTP ${apkResponse.status}, ${apkSize} bytes`);

for (const message of notes) console.log(`[qa] ${message}`);

if (problems.length) {
  console.error(`\n[qa] ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log('[qa] All checks passed.');
