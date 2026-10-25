import { defineConfig } from 'astro/config';
import { siteConfig, homePath } from './site.config.mjs';

if (siteConfig.legacyHomeSlugs.includes(siteConfig.homeSlug)) {
  throw new Error('legacyHomeSlugs must not include the active homeSlug.');
}

const legacyRedirects = Object.fromEntries(
  siteConfig.legacyHomeSlugs.map((slug) => [`/${slug}/`, homePath]),
);

export default defineConfig({
  site: siteConfig.siteUrl,
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  compressHTML: true,
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
  },
  redirects: legacyRedirects,
});
