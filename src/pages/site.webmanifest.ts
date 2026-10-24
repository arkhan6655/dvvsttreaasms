import type { APIRoute } from 'astro';
import { siteConfig, homePath } from '../lib/site';

export const GET: APIRoute = () => {
  const manifest = {
    name: siteConfig.brand,
    short_name: 'VVStreams',
    description: 'Download the VVStreams Android app and read the install notes.',
    id: '/',
    start_url: homePath,
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0b0b0c',
    theme_color: '#0b0b0c',
    lang: 'en',
    categories: ['sports', 'entertainment'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  });
};
