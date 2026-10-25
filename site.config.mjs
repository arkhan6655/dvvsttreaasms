/**
 * VVStreams App — single source of truth.
 *
 * Edit this file, commit to the main branch, and GitHub Actions rebuilds
 * the whole site. The only outside change is the Cloudflare redirect when
 * you change homeSlug.
 */
export const siteConfig = {
  brand: 'VVStreams App',
  tagline: 'Download for Android mobile and TV',
  seoTitle: 'VVStreams Download',
  siteUrl: 'https://vvstreams.site',

  /**
   * Homepage path segment.
   * Change to "index2", "index3", etc. when needed.
   * The build will print the exact Cloudflare redirect target.
   */
  homeSlug: 'index1',

  apk: {
    url: 'https://github.com/arkhan66648/VVSTreamsdownload/releases/download/v3.3/VVStreams-3.3.apk',
    version: '3.3',
    sizeLabel: '4.76 MB',
    sizeBytes: 4758914,
    releaseDate: '2026-10-24',
    minAndroid: '7.0',
    packageName: 'com.vvstreams.app',
    architectures: 'arm64-v8a · armeabi-v7a · x86 · x86_64',
  },

  /** Cosmetic address. Every appearance links to the homepage. */
  contactDisplay: 'admin@vvstreams.site',

  analytics: {
    histatsEnabled: true,
    histatsId: '5060228',
  },
};

export const homePath = `/${siteConfig.homeSlug}/`;
export const homeUrl = new URL(homePath, `${siteConfig.siteUrl}/`).href;
