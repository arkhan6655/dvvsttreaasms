import { siteConfig, homePath } from '../site.config.mjs';

const reserved = new Set([
  'privacy',
  'terms',
  'disclaimer',
  'copyright',
  'about',
  'contact',
  '404',
  'index',
  'assets',
  '_astro',
  'sitemap',
  'sitemap-index',
  'robots',
  'site',
  'admin',
  'api',
]);

const fail = (message) => {
  console.error(`\n[config] ${message}\n`);
  process.exit(1);
};

const slug = siteConfig.homeSlug;

if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  fail(`homeSlug "${slug}" must contain only lowercase letters, numbers and hyphens.`);
}

if (reserved.has(slug)) {
  fail(`homeSlug "${slug}" is reserved. Choose another path.`);
}

if (!siteConfig.siteUrl.startsWith('https://') || siteConfig.siteUrl.endsWith('/')) {
  fail('siteUrl must start with https:// and must not end with a slash.');
}

if (!siteConfig.apk.url.startsWith('https://') || !siteConfig.apk.url.endsWith('.apk')) {
  fail('apk.url must be an HTTPS .apk link.');
}

if (!Number.isInteger(siteConfig.apk.sizeBytes) || siteConfig.apk.sizeBytes <= 0) {
  fail('apk.sizeBytes must be a positive integer.');
}

if (!/^\d+(\.\d+)*$/.test(siteConfig.apk.version)) {
  fail('apk.version must look like 3.3.');
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(siteConfig.apk.releaseDate)) {
  fail('apk.releaseDate must use YYYY-MM-DD.');
}

if (!siteConfig.contactDisplay.includes('@')) {
  fail('contactDisplay must contain an @ sign.');
}

if (siteConfig.analytics.histatsEnabled && !/^\d+$/.test(siteConfig.analytics.histatsId)) {
  fail('analytics.histatsId must be numeric.');
}

console.log(`[config] homepage: ${siteConfig.siteUrl}${homePath}`);
console.log(`[config] APK: v${siteConfig.apk.version} · ${siteConfig.apk.sizeLabel}`);
console.log(`[config] Cloudflare redirect target: ${siteConfig.siteUrl}${homePath}`);
