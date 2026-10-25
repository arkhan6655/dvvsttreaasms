import { siteConfig, homePath, siteHost } from '../site.config.mjs';

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

for (const link of siteConfig.legal) {
  reserved.add(link.href.replaceAll('/', ''));
}

const fail = (message) => {
  console.error(`\n[config] ${message}\n`);
  process.exit(1);
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;
const slugPattern = /^[a-z0-9][a-z0-9-]*$/;

// Site / SEO
let parsedSiteUrl;
try {
  parsedSiteUrl = new URL(siteConfig.siteUrl);
} catch {
  fail('siteUrl must be a valid absolute URL.');
}

if (
  parsedSiteUrl.protocol !== 'https:' ||
  parsedSiteUrl.pathname !== '/' ||
  parsedSiteUrl.search ||
  parsedSiteUrl.hash ||
  siteConfig.siteUrl.endsWith('/')
) {
  fail('siteUrl must be https://host with no path, query, hash or trailing slash.');
}

for (const key of ['brand', 'appName', 'tagline', 'seoTitle', 'descriptionTemplate', 'titleTemplate']) {
  if (!isNonEmptyString(siteConfig[key])) fail(`${key} must be a non-empty string.`);
}

if (!siteConfig.titleTemplate.includes('%s')) fail('titleTemplate must contain %s.');
if (!siteConfig.descriptionTemplate.includes('{version}')) {
  fail('descriptionTemplate must contain {version} so the meta description stays current.');
}

for (const key of ['locale', 'ogLocale', 'robotsMeta', 'themeColor', 'ogImagePath', 'ogImageAltTemplate']) {
  if (!isNonEmptyString(siteConfig[key])) fail(`${key} must be a non-empty string.`);
}

if (!isPositiveInteger(siteConfig.ogImageWidth) || !isPositiveInteger(siteConfig.ogImageHeight)) {
  fail('ogImageWidth and ogImageHeight must be positive integers.');
}

// Homepage routing
if (!slugPattern.test(siteConfig.homeSlug)) {
  fail(`homeSlug "${siteConfig.homeSlug}" must contain only lowercase letters, numbers and hyphens.`);
}
if (reserved.has(siteConfig.homeSlug)) {
  fail(`homeSlug "${siteConfig.homeSlug}" is reserved. Choose another path.`);
}

if (!Array.isArray(siteConfig.legacyHomeSlugs)) {
  fail('legacyHomeSlugs must be an array.');
}

const seenLegacy = new Set();
for (const slug of siteConfig.legacyHomeSlugs) {
  if (!isNonEmptyString(slug) || !slugPattern.test(slug)) {
    fail(`legacyHomeSlugs entry "${slug}" must contain only lowercase letters, numbers and hyphens.`);
  }
  if (slug === siteConfig.homeSlug) {
    fail(`legacyHomeSlugs must not include the active homeSlug "${slug}".`);
  }
  if (reserved.has(slug)) {
    fail(`legacyHomeSlugs entry "${slug}" is reserved.`);
  }
  if (seenLegacy.has(slug)) {
    fail(`legacyHomeSlugs entry "${slug}" is duplicated.`);
  }
  seenLegacy.add(slug);
}

if (typeof siteConfig.redirect404ToHome !== 'boolean') {
  fail('redirect404ToHome must be true or false.');
}

// APK
let apkUrl;
try {
  apkUrl = new URL(siteConfig.apk.url);
} catch {
  fail('apk.url must be a valid absolute URL.');
}

if (apkUrl.protocol !== 'https:' || !apkUrl.pathname.toLowerCase().endsWith('.apk')) {
  fail('apk.url must be an HTTPS .apk link.');
}
if (!/^\d+(\.\d+)*$/.test(siteConfig.apk.version)) {
  fail('apk.version must look like 3.3.');
}
if (!isNonEmptyString(siteConfig.apk.fileNameTemplate)) {
  fail('apk.fileNameTemplate must be a non-empty string.');
}
if (!isNonEmptyString(siteConfig.apk.sizeLabel)) {
  fail('apk.sizeLabel must be a non-empty string.');
}
if (!isPositiveInteger(siteConfig.apk.sizeBytes)) {
  fail('apk.sizeBytes must be a positive integer.');
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(siteConfig.apk.releaseDate)) {
  fail('apk.releaseDate must use YYYY-MM-DD.');
}
if (Number.isNaN(new Date(`${siteConfig.apk.releaseDate}T00:00:00Z`).getTime())) {
  fail('apk.releaseDate is not a real date.');
}
if (!isNonEmptyString(siteConfig.apk.minAndroid)) {
  fail('apk.minAndroid must be a non-empty string.');
}
if (!isPositiveInteger(siteConfig.apk.minApi)) {
  fail('apk.minApi must be a positive integer.');
}
if (!/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/.test(siteConfig.apk.packageName)) {
  fail('apk.packageName must look like com.example.app.');
}
if (!isPositiveInteger(siteConfig.apk.architectures.count)) {
  fail('apk.architectures.count must be a positive integer.');
}
if (!isNonEmptyString(siteConfig.apk.architectures.label)) {
  fail('apk.architectures.label must be a non-empty string.');
}

// Contact / analytics
if (!siteConfig.contactDisplay.includes('@')) {
  fail('contactDisplay must contain an @ sign.');
}
if (siteConfig.analytics.histatsEnabled && !/^\d+$/.test(siteConfig.analytics.histatsId)) {
  fail('analytics.histatsId must be numeric.');
}

// Manifest
const manifest = siteConfig.manifest;
if (!manifest || !isNonEmptyString(manifest.name) || !isNonEmptyString(manifest.shortName)) {
  fail('manifest.name and manifest.shortName must be non-empty strings.');
}
if (!isNonEmptyString(manifest.description)) fail('manifest.description must be a non-empty string.');
if (!isNonEmptyString(manifest.backgroundColor) || !isNonEmptyString(manifest.themeColor)) {
  fail('manifest.backgroundColor and manifest.themeColor must be non-empty strings.');
}
if (!Array.isArray(manifest.categories) || manifest.categories.length === 0) {
  fail('manifest.categories must be a non-empty array.');
}
if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
  fail('manifest.icons must be a non-empty array.');
}

// Navigation / legal / pages
if (!Array.isArray(siteConfig.nav) || siteConfig.nav.length === 0) {
  fail('nav must be a non-empty array.');
}
if (!Array.isArray(siteConfig.legal) || siteConfig.legal.length === 0) {
  fail('legal must be a non-empty array.');
}
for (const key of ['about', 'contact', 'privacy', 'terms', 'disclaimer', 'copyright']) {
  const page = siteConfig.pages[key];
  if (!page || !isNonEmptyString(page.title) || !isNonEmptyString(page.description)) {
    fail(`pages.${key} must have a non-empty title and description.`);
  }
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(siteConfig.legalUpdated)) {
  fail('legalUpdated must use YYYY-MM-DD.');
}

// Content
if (!Array.isArray(siteConfig.content.sports) || siteConfig.content.sports.length === 0) {
  fail('content.sports must be a non-empty array.');
}
if (!Array.isArray(siteConfig.content.devices) || siteConfig.content.devices.length === 0) {
  fail('content.devices must be a non-empty array.');
}
if (!Array.isArray(siteConfig.content.faqs) || siteConfig.content.faqs.length === 0) {
  fail('content.faqs must be a non-empty array.');
}

console.log(`[config] homepage: ${siteConfig.siteUrl}${homePath}`);
console.log(`[config] APK: v${siteConfig.apk.version} · ${siteConfig.apk.sizeLabel} · API ${siteConfig.apk.minApi}`);
console.log(`[config] host / CNAME: ${siteHost}`);
console.log(`[config] legacy home redirects: ${siteConfig.legacyHomeSlugs.join(', ') || 'none'}`);
console.log(`[config] Cloudflare redirect target: ${siteConfig.siteUrl}${homePath}`);
