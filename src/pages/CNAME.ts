import type { APIRoute } from 'astro';
import { siteHost } from '../lib/site';

/**
 * Custom domain file for GitHub Pages, generated from `siteUrl` in
 * site.config.mjs so the domain lives in exactly one place.
 */
export const GET: APIRoute = () =>
  new Response(`${siteHost}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
