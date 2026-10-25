import type { APIRoute } from 'astro';
import { siteConfig, homePath } from '../lib/site';

export const GET: APIRoute = () => {
  const manifest = {
    name: siteConfig.manifest.name,
    short_name: siteConfig.manifest.shortName,
    description: siteConfig.manifest.description,
    id: '/',
    start_url: homePath,
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: siteConfig.manifest.backgroundColor,
    theme_color: siteConfig.manifest.themeColor,
    lang: siteConfig.locale,
    categories: siteConfig.manifest.categories,
    icons: siteConfig.manifest.icons,
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  });
};
