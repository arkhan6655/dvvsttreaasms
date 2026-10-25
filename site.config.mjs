/**
 * VVStreams App — single source of truth.
 *
 * Edit this file, commit to the main branch, and GitHub Actions rebuilds
 * the whole site. The only outside change is the Cloudflare root redirect when
 * you change homeSlug (and optionally a 301 for the old slug).
 *
 * All values below can contain {placeholders}:
 *   {brand} {appName} {version} {sizeLabel} {sizeBytes} {sizeBytesFormatted}
 *   {minAndroid} {minApi} {packageName} {releaseDate} {architectures}
 *   {architectureCount} {siteHost} {fileName}
 */
export const siteConfig = {
  siteUrl: 'https://vvstreams.site',
  brand: 'VVStreams App',
  appName: 'VVStreams',
  tagline: 'Download for Android mobile and TV',

  seoTitle: 'VVStreams Download',
  titleTemplate: '%s | {brand}',
  descriptionTemplate:
    'Download the {appName} {version} APK for Android mobile and TV. {sizeLabel}, Android {minAndroid}+, with install steps, device support and answers to common questions.',
  ogImageAltTemplate: '{appName} Download — APK {version} for Android mobile and TV',
  ogImagePath: '/og/vvstreams-app.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  locale: 'en',
  ogLocale: 'en_US',
  robotsMeta: 'index, follow, max-image-preview:large',
  themeColor: '#0b0b0c',

  /**
   * Homepage path segment.
   * Change to "index2", "index3", etc. when needed, then add the old slug to
   * legacyHomeSlugs so old links redirect instead of returning a 404.
   */
  homeSlug: 'index1',
  legacyHomeSlugs: [],
  redirect404ToHome: true,

  apk: {
    url: 'https://github.com/arkhan66648/VVSTreamsdownload/releases/download/v3.3/VVStreams-3.3.apk',
    version: '3.3',
    fileNameTemplate: '{appName}-{version}.apk',
    sizeLabel: '4.76 MB',
    sizeBytes: 4758914,
    releaseDate: '2026-10-24',
    minAndroid: '7.0',
    minApi: 24,
    packageName: 'com.vvstreams.app',
    architectures: {
      label: 'arm64-v8a · armeabi-v7a · x86 · x86_64',
      count: 4,
    },
  },

  /** Cosmetic address. Every appearance links to the homepage. */
  contactDisplay: 'admin@vvstreams.site',

  analytics: {
    histatsEnabled: true,
    histatsId: '5060228',
  },

  manifest: {
    name: 'VVStreams App',
    shortName: 'VVStreams',
    description: 'Download the VVStreams Android app and read the install notes.',
    backgroundColor: '#0b0b0c',
    themeColor: '#0b0b0c',
    categories: ['sports', 'entertainment'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  },

  nav: [
    { label: 'Download', hash: 'download' },
    { label: 'Overview', hash: 'overview' },
    { label: 'Sports', hash: 'sports' },
    { label: 'Devices', hash: 'devices' },
    { label: 'Install', hash: 'install' },
    { label: 'Guide', hash: 'guide' },
    { label: 'FAQ', hash: 'faq' },
  ],

  legal: [
    { label: 'Privacy', href: '/privacy/' },
    { label: 'Terms', href: '/terms/' },
    { label: 'Disclaimer', href: '/disclaimer/' },
    { label: 'Copyright', href: '/copyright/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],

  legalUpdated: '2026-10-24',

  pages: {
    about: {
      title: 'About',
      description:
        'About {siteHost}: an independent download and setup page for the {appName} Android app.',
    },
    contact: {
      title: 'Contact',
      description:
        'Contact details for {siteHost}. The published address links back to the {appName} homepage.',
    },
    privacy: {
      title: 'Privacy Policy',
      description:
        'How {siteHost} uses Histats analytics, cookies and hosting logs, and what choices visitors have.',
    },
    terms: {
      title: 'Terms of Use',
      description:
        'The terms that apply when you use {siteHost}, including the APK download, acceptable use and liability.',
    },
    disclaimer: {
      title: 'Disclaimer',
      description:
        '{siteHost} is an independent download page. It is not affiliated with any league, team, broadcaster or streaming service.',
    },
    copyright: {
      title: 'Copyright',
      description:
        'Copyright and trademark information for {siteHost}, and how to report content that infringes your rights.',
    },
  },

  content: {
    sports: [
      { name: 'NFL', descriptor: 'American football' },
      { name: 'NBA', descriptor: 'Professional basketball' },
      { name: 'MLB', descriptor: 'Major League Baseball' },
      { name: 'NHL', descriptor: 'Ice hockey' },
      { name: 'Soccer', descriptor: 'Global leagues and cups' },
      { name: 'UFC', descriptor: 'Mixed martial arts' },
      { name: 'WWE', descriptor: 'Professional wrestling' },
      { name: 'Tennis', descriptor: 'Tours and Grand Slams' },
      { name: 'Cricket', descriptor: 'International and franchise' },
      { name: 'Basketball', descriptor: 'Pro and college' },
      { name: 'Football', descriptor: 'Pro and college' },
      { name: 'More sports', descriptor: 'Boxing, golf, motorsport, rugby' },
    ],

    devices: [
      {
        device: 'Android phone',
        support: 'Supported',
        note: 'Android {minAndroid} or newer. Touch interface, portrait or landscape.',
      },
      {
        device: 'Android tablet',
        support: 'Supported',
        note: 'Same APK. The interface scales to larger screens.',
      },
      {
        device: 'Android TV / Google TV',
        support: 'Sideload',
        note: 'Install with Downloader or a USB drive. A remote works for navigation.',
      },
      {
        device: 'Fire TV / Fire Stick',
        support: 'Usually',
        note: 'Fire OS is Android-based. Sideload only; not in the Amazon Appstore.',
      },
      {
        device: 'Android emulator',
        support: 'Possible',
        note: 'x86 and x86_64 libraries are included. Performance varies.',
      },
      {
        device: 'Windows / macOS',
        support: 'No native app',
        note: 'Use an Android emulator if you need it on a computer.',
      },
      {
        device: 'iPhone / iPad',
        support: 'Not supported',
        note: 'iOS cannot install Android APK files.',
      },
    ],

    faqs: [
      {
        q: 'What is {appName}?',
        a: '{appName} is an Android app built for following live sports. It brings scores, schedules and sports coverage into one place on phones, tablets and Android TV. This page is a download and setup resource for the app; it is not the app itself.',
      },
      {
        q: 'Is {appName} free to download?',
        a: 'The APK is completely free to download. You can download the latest version on this page and install it on any compatible Android device. Any account, subscription or regional requirement inside the app is set by the app and its content providers, not by this page.',
      },
      {
        q: 'What Android version does {appName} need?',
        a: 'Version {version} requires Android {minAndroid} (API {minApi}) or newer. It includes 64-bit and 32-bit native libraries, so it works on most modern phones, tablets and TV boxes.',
      },
      {
        q: 'Does {appName} work on Android TV?',
        a: 'Yes. The APK can be sideloaded on Android TV and Google TV devices. You will need a file manager or the Downloader app, and you must allow installs from unknown sources for that app.',
      },
      {
        q: 'Can I install {appName} on a Fire TV Stick?',
        a: 'Fire OS is based on Android, so sideloading is usually possible through the Downloader app. It is not distributed through the Amazon Appstore, and behaviour can vary by Fire OS version. Test it on your device before relying on it.',
      },
      {
        q: 'Can I use {appName} on iPhone or iPad?',
        a: 'No. {appName} is distributed as an Android APK. iOS does not install APK files.',
      },
      {
        q: 'How big is the {appName} APK?',
        a: 'The v{version} file is {sizeLabel}. That is small for a video app, which makes it practical on older phones and TV boxes with limited storage.',
      },
      {
        q: 'How do I update {appName}?',
        a: 'Download the newer APK from the same release source, then install it over the existing app. Android usually keeps your data when the package name and signing key match. Back up anything important first.',
      },
      {
        q: 'Why won’t the {appName} APK install?',
        a: 'Common causes are an older Android version, insufficient storage, a corrupted download, or an existing copy signed with a different key. Re-download the file, check free space, and uninstall the old copy only if you accept losing its data.',
      },
      {
        q: 'Is the {appName} APK safe?',
        a: 'No APK can be guaranteed safe. Download it from the original release linked on this page, scan it with your own security software, review the permissions Android shows, and avoid modified builds from unknown sites. Install at your own risk.',
      },
      {
        q: 'Is {appName} available in my country?',
        a: 'Availability depends on the app and on the rights held by broadcasters in your region. This page does not provide streams or bypass regional restrictions. Use services you are licensed to access.',
      },
    ],
  },
};

const templateValues = {
  brand: siteConfig.brand,
  appName: siteConfig.appName,
  version: siteConfig.apk.version,
  sizeLabel: siteConfig.apk.sizeLabel,
  sizeBytes: String(siteConfig.apk.sizeBytes),
  sizeBytesFormatted: siteConfig.apk.sizeBytes.toLocaleString('en-GB'),
  minAndroid: siteConfig.apk.minAndroid,
  minApi: String(siteConfig.apk.minApi),
  packageName: siteConfig.apk.packageName,
  releaseDate: siteConfig.apk.releaseDate,
  architectures: siteConfig.apk.architectures.label,
  architectureCount: String(siteConfig.apk.architectures.count),
  siteHost: new URL(siteConfig.siteUrl).host,
};

/** Replace {placeholders} with the values above. Unknown keys are left as-is. */
export const renderTemplate = (template) =>
  template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(templateValues, key) ? templateValues[key] : match,
  );

export const apkFileName = renderTemplate(siteConfig.apk.fileNameTemplate);
export const homePath = `/${siteConfig.homeSlug}/`;
export const homeUrl = new URL(homePath, `${siteConfig.siteUrl}/`).href;
export const siteRoot = `${siteConfig.siteUrl}/`;
export const siteHost = templateValues.siteHost;
export const homeDescription = renderTemplate(siteConfig.descriptionTemplate);
export const ogImage = new URL(siteConfig.ogImagePath, siteRoot).href;
export const ogImageAlt = renderTemplate(siteConfig.ogImageAltTemplate);
export const navItems = siteConfig.nav;
export const legalLinks = siteConfig.legal;

export const pageTitle = (title) =>
  title === siteConfig.seoTitle
    ? title
    : renderTemplate(siteConfig.titleTemplate).split('%s').join(title);

export const releaseLabel = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${siteConfig.apk.releaseDate}T00:00:00Z`));

export const legalUpdatedLabel = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${siteConfig.legalUpdated}T00:00:00Z`));

export const homeAnchor = (hash) => `${homePath}#${hash}`;
