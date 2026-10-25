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

export const sports = siteConfig.content.sports.map((sport) => ({
  ...sport,
  descriptor: renderTemplate(sport.descriptor),
}));
