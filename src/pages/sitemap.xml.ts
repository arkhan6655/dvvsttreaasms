import type { APIRoute } from 'astro';
import { homePath, legalLinks, siteRoot } from '../lib/site';

/**
 * Single flat sitemap. `@astrojs/sitemap` always emits a sitemap index plus
 * `sitemap-0.xml` chunks, so this endpoint replaces it and keeps the site to
 * exactly one sitemap file at /sitemap.xml.
 *
 * The list comes from the same config the pages are built from: the configured
 * homepage plus every legal page in the footer.
 */
const paths = [homePath, ...legalLinks.map((link) => link.href)];

export const GET: APIRoute = () => {
  const urls = paths
    .map((path) => `  <url>\n    <loc>${new URL(path, siteRoot).href}</loc>\n  </url>`)
    .join('\n');

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
