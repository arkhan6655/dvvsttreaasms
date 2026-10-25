import {
  siteConfig,
  homePath,
  homeUrl,
  siteRoot,
  siteHost,
  homeDescription,
  ogImage,
  ogImageAlt,
  pageTitle,
  releaseLabel,
  legalUpdatedLabel,
  homeAnchor,
  apkFileName,
  renderTemplate,
  navItems,
  legalLinks,
} from '../../site.config.mjs';

export {
  siteConfig,
  homePath,
  homeUrl,
  siteRoot,
  siteHost,
  homeDescription,
  ogImage,
  ogImageAlt,
  pageTitle,
  releaseLabel,
  legalUpdatedLabel,
  homeAnchor,
  apkFileName,
  renderTemplate,
  navItems,
  legalLinks,
};

export const absolute = (path: string) => new URL(path, siteRoot).href;

export const faqs = siteConfig.content.faqs.map((faq) => ({
  q: renderTemplate(faq.q),
  a: renderTemplate(faq.a),
}));

export const deviceRows = siteConfig.content.devices.map((row) => ({
  ...row,
  note: renderTemplate(row.note),
}));

const releaseDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const releases = siteConfig.releases.map((release) => ({
  ...release,
  notes: release.notes.map(renderTemplate),
  dateLabel: releaseDate.format(new Date(`${release.date}T00:00:00Z`)),
}));

export const permissions = siteConfig.apk.permissions.map((permission) => ({
  ...permission,
  detail: renderTemplate(permission.detail),
}));

export const publisher = siteConfig.publisher;

export const sports = siteConfig.content.sports.map((sport) => ({
  ...sport,
  descriptor: renderTemplate(sport.descriptor),
}));
