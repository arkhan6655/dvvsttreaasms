import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './site.config.mjs';

const rootUrl = `${siteConfig.siteUrl}/`;

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
  integrations: [
    sitemap({
      filter: (page) => page !== rootUrl && !page.endsWith('/404/'),
    }),
  ],
});
