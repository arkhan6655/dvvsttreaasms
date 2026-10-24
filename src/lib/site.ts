import { siteConfig, homePath, homeUrl } from '../../site.config.mjs';

export { siteConfig, homePath, homeUrl };

export const siteRoot = `${siteConfig.siteUrl}/`;
export const ogImage = new URL('/og/vvstreams-app.jpg', siteRoot).href;
export const ogImageAlt = 'VVStreams Download — APK 3.3 for Android mobile and TV';

export const absolute = (path: string) => new URL(path, siteRoot).href;
export const homeAnchor = (hash: string) => `${homePath}#${hash}`;

export const navItems = [
  { label: 'Download', hash: 'download' },
  { label: 'Overview', hash: 'overview' },
  { label: 'Sports', hash: 'sports' },
  { label: 'Devices', hash: 'devices' },
  { label: 'Install', hash: 'install' },
  { label: 'Guide', hash: 'guide' },
  { label: 'FAQ', hash: 'faq' },
];

export const legalLinks = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Disclaimer', href: '/disclaimer/' },
  { label: 'Copyright', href: '/copyright/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const pageTitle = (title: string) =>
  title === siteConfig.seoTitle ? title : `${title} | ${siteConfig.brand}`;

export const releaseLabel = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${siteConfig.apk.releaseDate}T00:00:00Z`));

export const homeDescription =
  'Download the VVStreams 3.3 APK for Android mobile and TV. 4.76 MB, Android 7.0+, with install steps, device support and answers to common questions.';
