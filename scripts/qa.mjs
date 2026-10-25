import fs from 'node:fs';
import path from 'node:path';
import {
  siteConfig,
  homePath,
  siteHost,
  apkFileName,
  ogImage,
  legalLinks,
} from '../site.config.mjs';

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

const indexablePaths = [homePath, ...legalLinks.map((link) => link.href)];
const indexableSet = new Set(indexablePaths);
const legacyPaths = siteConfig.legacyHomeSlugs.map((slug) => `/${slug}/`);
const isLegacy = (url) => legacyPaths.includes(url);

const expectedLoc = (urlPath) => `${siteConfig.siteUrl}${urlPath}`;

for (const [url, page] of pages) {
  const { html } = page;
  const label = url || '/';
  const legacy = isLegacy(url);

  if (!legacy) {
    if (!/<title>[^<]+<\/title>/.test(html)) issue(`${label}: missing <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(html)) issue(`${label}: missing meta description`);
    if (!/<meta name="viewport"/.test(html)) issue(`${label}: missing viewport`);
    if (!new RegExp(`<html lang="${siteConfig.locale}"`).test(html)) {
      issue(`${label}: <html lang> is not "${siteConfig.locale}"`);
    }
    if (/mailto:/i.test(html)) issue(`${label}: contains a mailto: link`);
    const withoutLocationHash = html.split('location.hash').join('');
    if (/sha-?256|checksum|\bhash\b/i.test(withoutLocationHash)) {
      issue(`${label}: contains checksum/hash wording`);
    }
    if (/adsbygoogle|pagead2|google_ad_client|adsense/i.test(html)) issue(`${label}: contains ad code`);
    if (/\bofficial\b/i.test(html)) issue(`${label}: contains the word "official"`);
    if (/versioncode/i.test(html)) issue(`${label}: discloses the version code`);
    if (/<dt>\s*Build\s*<\/dt>/i.test(html)) issue(`${label}: shows a Build fact row`);

    if (siteConfig.analytics.histatsEnabled) {
      if (!html.includes('s10.histats.com/js15_as.js')) issue(`${label}: Histats script is missing`);
      if (!html.includes(`sstatic1.histats.com/0.gif?${siteConfig.analytics.histatsId}`)) {
        issue(`${label}: Histats noscript pixel is missing`);
      }
      const histatsAt = html.indexOf('js15_as.js');
      if (histatsAt >= 0 && histatsAt < html.length * 0.75) {
        issue(`${label}: Histats is not near the end of the document`);
      }
    }

    if (!/rel="canonical"/.test(html) && !/name="robots" content="noindex/.test(html)) {
      issue(`${label}: indexable page has no canonical`);
    }

    const externalScripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
    for (const src of externalScripts) {
      if (!src.startsWith('/_astro/')) issue(`${label}: unexpected external script ${src}`);
    }
  }

  const withoutApkUrl = html.split(siteConfig.apk.url).join('');
  if (/github/i.test(withoutApkUrl)) issue(`${label}: mentions GitHub outside the APK link`);

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

// Canonical, OG URL, unique metadata and structured data for indexable pages.
const titles = new Map();
const descriptions = new Map();

for (const urlPath of indexablePaths) {
  const page = pages.get(urlPath);
  if (!page) {
    issue(`Configured page ${urlPath} was not built`);
    continue;
  }

  const canonical = expectedLoc(urlPath);
  if (!page.html.includes(`rel="canonical" href="${canonical}"`)) {
    issue(`${urlPath}: canonical is not ${canonical}`);
  }
  if (!page.html.includes(`property="og:url" content="${canonical}"`)) {
    issue(`${urlPath}: og:url is not ${canonical}`);
  }
  if (!page.html.includes(`property="og:image" content="${ogImage}"`)) {
    issue(`${urlPath}: og:image is not ${ogImage}`);
  }
  if (!page.html.includes(`name="robots" content="${siteConfig.robotsMeta}"`)) {
    issue(`${urlPath}: robots meta is not the configured value`);
  }

  const title = page.html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = page.html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (title) {
    if (titles.has(title)) issue(`Duplicate <title>: "${title}" on ${urlPath} and ${titles.get(title)}`);
    else titles.set(title, urlPath);
  }
  if (description) {
    if (descriptions.has(description)) {
      issue(`Duplicate meta description on ${urlPath} and ${descriptions.get(description)}`);
    } else {
      descriptions.set(description, urlPath);
    }
  }

  const ldBlocks = [...page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (ldBlocks.length === 0) issue(`${urlPath}: no JSON-LD`);
  for (const match of ldBlocks) {
    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch {
      issue(`${urlPath}: invalid JSON-LD`);
      continue;
    }
    const json = JSON.stringify(parsed);
    if (json.includes('http://')) issue(`${urlPath}: JSON-LD contains an insecure http:// URL`);
    if (/localhost|127\.0\.0\.1/.test(json)) issue(`${urlPath}: JSON-LD contains a local URL`);
    if (json.includes('{version}') || json.includes('{appName}') || json.includes('{minAndroid}')) {
      issue(`${urlPath}: JSON-LD contains an unreplaced template placeholder`);
    }
  }
}

// Homepage-specific checks.
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
  if (!home.html.includes(`href="${siteConfig.siteUrl}${homePath}"`)) issue('Homepage canonical/email link missing');
  if (!home.html.includes(apkFileName)) issue(`Homepage is missing the APK file name ${apkFileName}`);
  if (!home.html.includes(siteConfig.apk.sizeLabel)) issue('Homepage is missing the configured size label');
  if (!home.html.includes(`API ${siteConfig.apk.minApi}`)) issue('Homepage is missing the configured API level');
  if (!home.html.includes(`Android ${siteConfig.apk.minAndroid}`)) {
    issue('Homepage is missing the configured minimum Android version');
  }
  if (home.html.includes('target="_blank"') && !home.html.includes('rel="noopener"')) {
    issue('Homepage has target="_blank" without rel="noopener"');
  }

  const ld = [...home.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]))
    .flat();
  const app = ld.find((item) => item['@type'] === 'SoftwareApplication');
  if (!app) {
    issue('Homepage is missing the SoftwareApplication JSON-LD');
  } else {
    if (app.softwareVersion !== siteConfig.apk.version) issue('Schema softwareVersion does not match config');
    if (app.downloadUrl !== siteConfig.apk.url) issue('Schema downloadUrl does not match config');
    if (app.url !== `${siteConfig.siteUrl}${homePath}`) issue('Schema homepage url does not match config');
    if (!String(app.operatingSystem).includes(siteConfig.apk.minAndroid)) {
      issue('Schema operatingSystem does not match config');
    }
    if (!String(app.softwareRequirements).includes(`API ${siteConfig.apk.minApi}`)) {
      issue('Schema softwareRequirements does not include the configured API level');
    }
  }
  if (!ld.some((item) => item['@type'] === 'WebSite')) issue('Homepage is missing WebSite JSON-LD');
  if (!ld.some((item) => item['@type'] === 'FAQPage')) issue('Homepage is missing FAQPage JSON-LD');
}

// Sitemap: exactly the indexable pages, flat, one file.
const sitemapPath = path.join(DIST, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.trimStart().startsWith('<?xml')) issue('sitemap.xml does not start with an XML declaration');
  if (!sitemap.includes('<urlset')) issue('sitemap.xml is not a flat urlset');
  if (sitemap.includes('<sitemapindex')) issue('sitemap.xml is a sitemap index, not a flat sitemap');

  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const locSet = new Set(locs);
  if (locs.length !== locSet.size) issue('sitemap.xml contains duplicate URLs');

  for (const urlPath of indexablePaths) {
    if (!locSet.has(expectedLoc(urlPath))) issue(`Sitemap is missing ${expectedLoc(urlPath)}`);
  }
  for (const loc of locs) {
    if (!indexableSet.has(loc.slice(siteConfig.siteUrl.length))) {
      issue(`Sitemap contains unexpected URL ${loc}`);
    }
    if (!loc.startsWith('https://')) issue(`Sitemap URL is not HTTPS: ${loc}`);
  }
  notes.push(`Sitemap URLs: ${locs.length}`);
} else {
  issue('sitemap.xml is missing');
}

for (const stale of ['sitemap-index.xml', 'sitemap-0.xml']) {
  if (fs.existsSync(path.join(DIST, stale))) issue(`${stale} still exists; the site should have one sitemap`);
}

// Legacy homepage redirects.
for (const slug of siteConfig.legacyHomeSlugs) {
  const candidates = [
    path.join(DIST, slug, 'index.html'),
    path.join(DIST, `${slug}.html`),
  ];
  const file = candidates.find((candidate) => fs.existsSync(candidate));
  if (!file) {
    issue(`Legacy redirect /${slug}/ was not generated`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes(homePath)) issue(`Legacy redirect /${slug}/ does not target ${homePath}`);
  if (!/name="robots" content="noindex/.test(html)) {
    issue(`Legacy redirect /${slug}/ is missing noindex`);
  }
}

// Root redirect and 404 fallback.
const rootHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
if (!/name="robots" content="noindex/.test(rootHtml)) issue('Root redirect page is not noindex');
if (!rootHtml.includes(homePath)) issue('Root redirect page does not target the configured homepage');

const notFoundHtml = fs.readFileSync(path.join(DIST, '404.html'), 'utf8');
if (siteConfig.redirect404ToHome) {
  if (!notFoundHtml.includes('location.replace')) issue('404 page is missing the homepage redirect script');
  if (!notFoundHtml.includes(homePath)) issue('404 redirect does not target the configured homepage');
}
if (!/name="robots" content="noindex/.test(notFoundHtml)) issue('404 page is not noindex');

// robots.txt
const robotsTxt = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
if (!robotsTxt.includes(`Sitemap: ${siteConfig.siteUrl}/sitemap.xml`)) {
  issue('robots.txt does not reference sitemap.xml');
}
if (/sitemap-index\.xml/i.test(robotsTxt)) issue('robots.txt still references sitemap-index.xml');

// CNAME
const cnamePath = path.join(DIST, 'CNAME');
if (!fs.existsSync(cnamePath)) {
  issue('CNAME is missing');
} else if (fs.readFileSync(cnamePath, 'utf8').trim() !== siteHost) {
  issue(`CNAME does not match siteUrl host (${siteHost})`);
}

// Manifest
const manifestPath = path.join(DIST, 'site.webmanifest');
if (!fs.existsSync(manifestPath)) {
  issue('site.webmanifest is missing');
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.start_url !== homePath) issue('Manifest start_url does not match homePath');
  if (manifest.scope !== '/') issue('Manifest scope is not /');
  if (manifest.name !== siteConfig.manifest.name) issue('Manifest name does not match config');
  if (manifest.lang !== siteConfig.locale) issue('Manifest lang does not match config locale');
}

// APK link
const apkResponse = await fetch(siteConfig.apk.url, { method: 'HEAD', redirect: 'follow' });
const apkSize = Number(apkResponse.headers.get('content-length'));
if (!apkResponse.ok) issue(`APK URL returned HTTP ${apkResponse.status}`);
if (Number.isFinite(apkSize) && apkSize > 0 && apkSize !== siteConfig.apk.sizeBytes) {
  issue(`APK size changed: live ${apkSize} bytes, configured ${siteConfig.apk.sizeBytes}`);
}

if (siteConfig.apk.minApi !== 24) {
  for (const [url, page] of pages) {
    if (page.html.includes('API 24')) issue(`${url || '/'}: still contains the old API 24 reference`);
  }
}

const cssFiles = allFiles.filter((file) => file.endsWith('.css'));
notes.push(`HTML pages: ${htmlFiles.length}`);
notes.push(`Indexable pages: ${indexablePaths.length}`);
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
