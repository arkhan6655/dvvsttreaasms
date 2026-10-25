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
    'Download the {appName} {version} APK for Android mobile and TV. {sizeLabel}, Android {minAndroid}+, with install steps, device support, app permissions and answers to common questions.',
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
  redirect404ToHome: false,

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
    /**
     * Read from the AndroidManifest.xml of the published v3.3 APK.
     * Each entry describes what the permission allows, not a guarantee of use.
     */
    permissions: [
      {
        name: 'INTERNET',
        detail: 'Open network connections, which the app needs for streams and app data.',
      },
      {
        name: 'ACCESS_NETWORK_STATE',
        detail: 'Read the current network state, such as whether Wi-Fi or mobile data is connected.',
      },
      {
        name: 'WAKE_LOCK',
        detail: 'Keep the processor awake while playback is active.',
      },
      {
        name: 'FOREGROUND_SERVICE',
        detail: 'Run a foreground service, which Android shows as an ongoing notification.',
      },
      {
        name: 'FOREGROUND_SERVICE_MEDIA_PLAYBACK',
        detail: 'Run that foreground service as a media playback service on Android 14 and newer.',
      },
      {
        name: 'SYSTEM_ALERT_WINDOW',
        detail: 'Draw over other apps, which the floating player uses. Android asks you to grant it in system settings.',
      },
      {
        name: 'REQUEST_INSTALL_PACKAGES',
        detail: 'Ask Android to install an APK. Android still shows its own confirmation screen before anything is installed.',
      },
      {
        name: 'com.google.android.gms.permission.AD_ID',
        detail: 'Read the advertising ID. Declared by the advertising libraries included in the build.',
      },
      {
        name: 'ACCESS_ADSERVICES_AD_ID',
        detail: 'Access the Privacy Sandbox advertising ID on Android 13 and newer.',
      },
      {
        name: 'ACCESS_ADSERVICES_ATTRIBUTION',
        detail: 'Access Privacy Sandbox attribution data on Android 13 and newer.',
      },
      {
        name: 'com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE',
        detail: 'Read install-referrer information supplied by the app store that installed the app.',
      },
      {
        name: 'com.vvstreams.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION',
        detail: 'An app-private permission that keeps internal broadcast receivers unexported.',
      },
    ],
  },

  /** Cosmetic address. Every appearance links to the homepage. */
  contactDisplay: 'admin@vvstreams.site',

  /**
   * Ownership, kept low-key: stated on the About page, in the legal pages and
   * in structured data. The homepage describes the app and the download without
   * making an ownership claim.
   */
  publisher: {
    note: 'This site is run by the team that publishes the VVStreams app.',
  },

  analytics: {
    histatsEnabled: true,
    histatsId: '5060228',
  },

  /** Shown on the homepage so the file's declared access can be reviewed. */
  releases: [
    {
      version: '3.3',
      date: '2026-10-24',
      notes: ['Version 3.3. No release notes were published with this build.'],
    },
    {
      version: '3.2',
      date: '2026-10-18',
      notes: ['Fixed the floating player issue and background audio.'],
    },
    {
      version: '3.1 (republished)',
      date: '2026-10-17',
      notes: ['Floating player issue fixed.'],
    },
    {
      version: '3.1',
      date: '2026-10-12',
      notes: ['Version 3.1.'],
    },
  ],

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
    { label: 'DMCA', href: '/dmca/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],

  legalUpdated: '2026-10-24',

  pages: {
    about: {
      title: 'About',
      description:
        'Who runs {siteHost}, how the {appName} release is checked, and how to report a problem with the download.',
    },
    contact: {
      title: 'Contact',
      description:
        'How to reach the team behind {siteHost} about the {appName} download, a broken file or a rights complaint.',
    },
    privacy: {
      title: 'Privacy Policy',
      description:
        'What {siteHost} collects, how Histats analytics is gated behind consent, and what choices visitors have.',
    },
    terms: {
      title: 'Terms of Use',
      description:
        'The terms that apply when you use {siteHost}, including the APK download, acceptable use and liability.',
    },
    disclaimer: {
      title: 'Disclaimer',
      description:
        '{siteHost} publishes the {appName} Android app and is not affiliated with any league, team, broadcaster or streaming service.',
    },
    copyright: {
      title: 'Copyright',
      description:
        'Copyright and trademark information for {siteHost}, and how to raise a rights complaint about the site or the app.',
    },
    dmca: {
      title: 'DMCA and Takedown',
      description:
        'How to send a copyright or takedown notice about {siteHost} or the {appName} release, what a notice must contain, and how quickly we respond.',
    },
  },

  content: {
    sports: [
      { name: 'American football', descriptor: 'Professional and college' },
      { name: 'Basketball', descriptor: 'Professional and college' },
      { name: 'Baseball', descriptor: 'Major leagues' },
      { name: 'Ice hockey', descriptor: 'Professional leagues' },
      { name: 'Soccer', descriptor: 'Leagues and cups' },
      { name: 'Combat sports', descriptor: 'MMA and boxing' },
      { name: 'Wrestling', descriptor: 'Professional wrestling' },
      { name: 'Tennis', descriptor: 'Tours and majors' },
      { name: 'Cricket', descriptor: 'International and franchise' },
      { name: 'Motorsport', descriptor: 'Formula and endurance' },
      { name: 'Golf', descriptor: 'Tours and majors' },
      { name: 'Rugby', descriptor: 'Union and league' },
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
        a: '{appName} is an Android app for watching live sport on phones, tablets, Android TV and Fire TV devices. This page is where we publish the APK, with the file details, install steps and permission list for the current release.',
      },
      {
        q: 'Is {appName} free to download?',
        a: 'The APK is free to download from this page. Anything that happens inside the app — an account, a subscription or a regional restriction — is set by the app and the providers behind the streams, not by this page.',
      },
      {
        q: 'What Android version does {appName} need?',
        a: 'Version {version} requires Android {minAndroid} (API {minApi}) or newer. It includes 64-bit and 32-bit native libraries, so it runs on most modern phones, tablets and TV boxes.',
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
        a: 'Download the newer APK from this page, then install it over the existing app. Android usually keeps your data when the package name and signing key match. Back up anything important first.',
      },
      {
        q: 'Why won’t the {appName} APK install?',
        a: 'Common causes are an older Android version, insufficient storage, a corrupted download, or an existing copy signed with a different key. Re-download the file, check free space, and uninstall the old copy only if you accept losing its data.',
      },
      {
        q: 'Is the {appName} APK safe?',
        a: 'The download section links to the file we publish. Before installing, check that the name ends in .apk, that the size matches the details on this page, and that the permissions Android lists match the table in section 07. A build from another site is not the same file.',
      },
      {
        q: 'Why does the app ask for overlay and install permissions?',
        a: 'The overlay permission is what the floating player uses to draw over other apps. The install permission lets the app hand a new APK to Android’s installer, which still asks you to confirm. Both are granted per app in system settings and can be revoked at any time.',
      },
      {
        q: 'Is {appName} available in my country?',
        a: 'Availability depends on the app and on the rights held by broadcasters in your region. This page does not provide streams or regional workarounds. Use services you are licensed to access.',
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
