# VVStreams App

Static download and information site for the VVStreams Android app, built with Astro and deployed to GitHub Pages at **https://vvstreams.site/index1/**.

## Stack

- Astro 7, static output, no UI framework
- Self-hosted Barlow Condensed subset, system UI body font
- One bundled CSS file and one small JS file
- One flat `sitemap.xml` generated from the site config
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

`npm run qa` checks the built site for:

- exactly one direct APK link on the homepage
- Histats script and noscript pixel on every page
- no `mailto:` links
- no checksum or hash wording
- no advertising code
- no “official” wording
- internal links and anchor targets
- sitemap contents (one flat `sitemap.xml`), canonical tags and the live APK size

## One config file

Everything editable lives in [`site.config.mjs`](site.config.mjs):

| Field | Controls |
| --- | --- |
| `homeSlug` | Homepage path (`/index1/`), canonical, sitemap, schema, nav, footer, root fallback |
| `apk.url` | The only direct download target on the site |
| `apk.version`, `apk.sizeBytes` | Version facts, schema, copy, file-size checks |
| `apk.releaseDate`, `apk.minAndroid`, `apk.packageName` | Details shown on the homepage |
| `contactDisplay` | Cosmetic address; every appearance links to the homepage |
| `analytics.histatsId` | Histats site ID |
| `analytics.histatsEnabled` | Set to `false` to remove the script and pixel |

After changing `homeSlug`, update the Cloudflare root redirect as well. See [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Project layout

```
site.config.mjs          single source of truth
astro.config.mjs         Astro, trailing slashes, CSS output
src/pages/[home].astro   config-driven homepage
src/pages/*.astro        legal pages, 404, root fallback
src/components/          header, footer, hero, ticker, download card, FAQ, Histats
src/layouts/             base and legal layouts
src/data/                sports, devices, FAQ content
src/styles/global.css    all site styles
src/scripts/main.js      menu, sticky header state, scroll spy
scripts/                 config validation, APK verification, post-build QA
public/                  fonts, icons, OG image, CNAME, .nojekyll
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

Pushing to `main` builds and deploys through GitHub Actions. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for Pages, Cloudflare, DNS and Search Console setup.
