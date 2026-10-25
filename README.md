# VVStreams App

Static download and information site for the VVStreams Android app, built with Astro and deployed to GitHub Pages at **https://vvstreams.site/index1/**.

## Stack

- Astro 7, static output, no UI framework
- Self-hosted Barlow Condensed subset, system UI body font
- One bundled CSS file and one small JS file
- One flat `sitemap.xml` generated from `site.config.mjs`
- `CNAME` and `site.webmanifest` generated from `site.config.mjs`
- Histats analytics on every page
- No advertising code, no consent gate, no third-party frameworks

## Local development

```powershell
npm install
npm run dev
```

The homepage is served at `http://localhost:4321/index1/`.

## Build and check

```powershell
npm run build
npm run qa
```

`npm run build` first validates the config, then builds the site. `npm run qa` checks the built output for:

- exactly one direct APK link on the homepage
- one flat `sitemap.xml` containing exactly the indexable pages
- canonical, `og:url`, `og:image` and robots meta matching the config
- JSON-LD with no placeholders, insecure URLs or local URLs
- unique titles and meta descriptions
- legacy homepage redirects targeting the active homepage
- the 404 page redirecting to the active homepage
- root redirect, noindex rules, `robots.txt`, `CNAME` and manifest consistency
- the configured version, size label, file name, minimum Android and API level
- Histats script and noscript pixel on every page
- no `mailto:` links, checksum wording, ad code or “official” wording
- internal links and anchor targets
- the live APK URL and its file size

The same `npm run qa` step runs in GitHub Actions, so a bad config change fails the deploy instead of going live.

## One config file

Everything editable lives in [`site.config.mjs`](site.config.mjs):

| Field | Controls |
| --- | --- |
| `siteUrl` | Absolute site origin, canonical URLs, sitemap, schema, OG tags and generated `CNAME` |
| `brand`, `appName`, `tagline` | Site identity, headings, header, footer and generated manifest |
| `seoTitle`, `titleTemplate`, `descriptionTemplate`, `ogImage*`, `themeColor`, `robotsMeta` | Homepage title, meta description, Open Graph, Twitter and robots directives |
| `homeSlug` | Active homepage path (`/index1/`), canonical, sitemap, schema, nav, manifest and root fallback |
| `legacyHomeSlugs` | Old homepage paths that must redirect to the active homepage instead of 404 |
| `redirect404ToHome` | Set to `false` to disable the 404 page’s homepage redirect |
| `apk.url` | The only direct download target on the site |
| `apk.version`, `apk.sizeLabel`, `apk.sizeBytes` | Version facts, schema, copy and file-size checks |
| `apk.fileNameTemplate` | Filename shown in the install steps |
| `apk.releaseDate`, `apk.minAndroid`, `apk.minApi`, `apk.packageName`, `apk.architectures` | File details, schema and device notes |
| `contactDisplay` | Cosmetic address; every appearance links to the homepage |
| `analytics.histatsId`, `analytics.histatsEnabled` | Histats analytics |
| `manifest.*` | Web app manifest name, colors, categories and icons |
| `nav`, `legal` | Header/footer navigation and legal page list |
| `pages.*` | Per-page SEO titles and meta descriptions |
| `legalUpdated` | Legal pages’ “last updated” date and schema `dateModified` |
| `content.sports`, `content.devices`, `content.faqs` | Homepage content data |

Values may contain placeholders such as `{appName}`, `{version}`, `{sizeLabel}`, `{minAndroid}`, `{minApi}`, `{siteHost}` and `{platforms}`. `scripts/validate-config.mjs` checks the whole file before every build.

### Changing the homepage slug

1. Change `homeSlug` (`index1` → `index2`).
2. Add the old slug to `legacyHomeSlugs` (`['index1']`).
3. Update the Cloudflare root redirect to the new homepage.
4. Optionally add a Cloudflare 301 from the old slug to the new one for SEO.

The build creates `/index2/` as the homepage and `/index1/` as a `noindex` redirect page. Any other missing URL hits `404.html`, which immediately redirects visitors to the active homepage.

After changing the slug, resubmit the sitemap or request indexing for the new homepage in Search Console. The sitemap URL itself never changes.

## Project layout

```
site.config.mjs          single source of truth
astro.config.mjs         Astro, trailing slashes, legacy redirects, CSS output
src/pages/[home].astro   config-driven homepage
src/pages/*.astro        legal pages, 404, root fallback
src/pages/CNAME.ts       generated custom-domain file
src/pages/sitemap.xml.ts generated flat sitemap
src/pages/robots.txt.ts  generated robots.txt
src/components/          header, footer, hero, ticker, download card, FAQ, Histats
src/layouts/             base and legal layouts
src/styles/global.css    all site styles
src/scripts/main.js      menu, sticky header state, scroll spy
scripts/                 config validation, APK verification, post-build QA
public/                  fonts, icons, OG image, .nojekyll
```

## Content rules

- One direct APK link, in the mid-page `#download` section only.
- Header, hero, footer and article links use `#download`.
- No SHA-256, checksum or hash values anywhere.
- No AdSense, ad slots, `ads.txt` or CMP.
- Histats loads for every visitor, without a consent gate.
- The contact address is cosmetic and always links to the homepage.
- No league logos, no “free live streams”, no invented ratings or download counts.

## Deployment

Pushing to `main` builds, runs QA and deploys through GitHub Actions. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for Pages, Cloudflare, DNS and Search Console setup.
