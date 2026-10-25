# Deployment

Target: **https://vvstreams.site/index1/** — GitHub Pages, `main` branch, custom domain, Cloudflare in front.

The repository is `arkhan6655/dvvsttreaasms`. The workflow at `.github/workflows/deploy.yml` builds with Node 24 and publishes `dist/` as a Pages artifact.

## 1. GitHub Pages

### Enable with the UI

1. Repository → **Settings** → **Pages**.
2. **Build and deployment** → **Source**: **GitHub Actions**.
3. **Custom domain**: `vvstreams.site` → **Save**.
4. Wait for the DNS check, then enable **Enforce HTTPS** once the certificate is issued.

### Enable with the API

```bash
curl -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/arkhan6655/dvvsttreaasms/pages \
  -d '{"build_type":"workflow"}'

curl -X PUT \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/arkhan6655/dvvsttreaasms/pages \
  -d '{"build_type":"workflow","cname":"vvstreams.site"}'
```

`CNAME` is generated from `siteUrl` in `site.config.mjs` and ships at the root of the artifact. Keep the GitHub Pages custom-domain setting in sync with it.

If the first deploy fails with **“Get Pages site failed”**, Pages was not enabled before the workflow ran. Enable it, then re-run the workflow.

## 2. Cloudflare DNS

Add these records in the Cloudflare dashboard for `vvstreams.site`:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `@` | `arkhan6655.github.io` | Proxied |
| CNAME | `www` | `vvstreams.site` | Proxied |

Cloudflare flattens the apex `CNAME`, so the apex works without hard-coded GitHub IPs. If flattening is unavailable, use GitHub’s Pages A records:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

The custom domain must be set in GitHub Pages before Cloudflare proxying is switched on, otherwise GitHub cannot issue its certificate for `vvstreams.site`.

SSL/TLS settings:

- **Overview** → **Full (strict)**
- **Edge Certificates** → **Always Use HTTPS**: on
- **Minimum TLS Version**: 1.2
- Leave **Automatic HTTPS Rewrites** on

If the GitHub certificate is still provisioning, set the proxied records to **DNS only** temporarily, finish the Pages domain setup, then switch back to proxied.

## 3. Root redirect: `/` → `/index1/`

Cloudflare → **Rules** → **Redirect Rules** → **Create rule**.

- **Name:** Homepage to index1
- **If incoming requests match:** Custom filter expression
  - Field: `URI Path`
  - Operator: `equals`
  - Value: `/`
- **Then:** Static redirect
  - **URL:** `https://vvstreams.site/index1/`
  - **Status code:** `301`
  - **Preserve query string:** on

Do not redirect the whole site, only the exact root path. Legal pages (`/privacy/`, `/terms/`, etc.) must stay at the root. The build also emits a noindex `index.html` fallback with a meta refresh, so the root still works if the rule is ever disabled.

For `www`, add a second rule:

- If hostname equals `www.vvstreams.site` → redirect to `https://vvstreams.site/index1/` with `301`.

When you change `homeSlug` in `site.config.mjs`, update the redirect target in the same maintenance window. Example: `/index1/` → `/index2/`. Also add the old slug to `legacyHomeSlugs` so `/index1/` redirects to the active homepage instead of returning 404.

## 4. Cache rules

Create these in Cloudflare → **Caching** → **Cache Rules**.

**Immutable assets**

- If URI Path matches `/_astro/*` or `/fonts/*` or `/og/*` or `/icon*` or `/favicon*` or `/apple-touch-icon*`
- Cache eligibility: **Eligible for cache**
- Edge TTL: **1 year**
- Browser TTL: **1 year**

**HTML**

- If URI Path ends with `/` or `/404.html`
- Cache eligibility: **Eligible for cache**
- Edge TTL: **5 minutes**
- Browser TTL: **Respect origin** (GitHub Pages sends a short cache lifetime)

Do not cache the APK through Cloudflare. It is served by GitHub.

## 5. Security headers

Cloudflare → **Rules** → **Transform Rules** → **Modify response header** → **Create rule**.

Apply to all incoming requests and set:

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

After the site has been on HTTPS for a while and all subdomains are ready, add HSTS:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Add `preload` only if you intend to submit the domain and accept the long commitment.

Do not add a strict Content-Security-Policy yet. Histats loads `s10.histats.com` and `sstatic1.histats.com`, the page uses one inline JSON-LD block plus the Histats inline bootstrap script, and `404.html` uses a one-line inline redirect script to the active homepage.

## 6. Search Console

Use a **Domain property** for `vvstreams.site`, not a URL-prefix property:

1. Search Console → **Add property** → **Domain** → `vvstreams.site`.
2. Copy the TXT value.
3. Cloudflare → **DNS** → **Add record** → TXT, name `@`, content the value.
4. Verify in Search Console.
5. Submit `https://vvstreams.site/sitemap.xml`.

A domain property survives the move from `/index1/` to `/index2/`, so verification does not need to be repeated.

## 7. Changing the homepage slug

1. Edit `homeSlug` in `site.config.mjs` (`index1` → `index2`).
2. Add the old slug to `legacyHomeSlugs` (`['index1']`). This generates a `noindex` redirect page so old links land on the active homepage instead of 404.
3. Run `npm run build && npm run qa` locally.
4. Commit and push to `main`.
5. Update the Cloudflare root redirect to `https://vvstreams.site/index2/`.
6. Optionally add a Cloudflare 301 from `/index1/*` to `/index2/` for the strongest SEO signal.
7. Request indexing for the new homepage in Search Console.

The build updates the canonical, OG tags, schema, sitemap, navigation, footer, manifest `start_url`, `404.html` redirect and root fallback. If you forget the Cloudflare steps, users still move from `/` and `/index1/` to the active homepage, but with an extra client-side hop.

Any missing URL is served by `404.html`, which immediately redirects to the active homepage while keeping the HTTP 404 status for crawlers.

## 8. Verification

```bash
curl -I https://vvstreams.site/
# expect 301 and location: https://vvstreams.site/index1/

curl -I https://vvstreams.site/index1/
# expect 200

curl -I https://vvstreams.site/privacy/
# expect 200

curl https://vvstreams.site/robots.txt
# expect the sitemap line

curl https://vvstreams.site/sitemap.xml
# expect one <urlset> with the active homepage first

curl -I https://vvstreams.site/CNAME
# expect 200 and vvstreams.site

curl -I https://vvstreams.site/404-test/
# expect 404; a browser then redirects to the active homepage
```

Browser checks:

- Hero “Download APK” scrolls smoothly to `#download` and stops below the sticky header.
- There is exactly one direct APK link.
- `admin@vvstreams.site` opens the homepage, never a mail client.
- Histats sends a request on every page and a pixel is present in the noscript markup.
- No ad code is requested.
- Legal pages return 200 and appear in the footer.
- After a slug change, `/indexN/` (old) redirects to the new homepage.
- A deliberately broken URL lands on the homepage.

Run `npm run qa` after every build.

## 9. Token hygiene

The initial push used a personal access token kept in `github-details.txt`, which is ignored by Git.

After the first successful deployment:

1. Revoke the token in GitHub → **Settings** → **Developer settings** → **Personal access tokens**.
2. Delete `github-details.txt`, or replace the token with a new one.
3. Confirm the file is not tracked:

```bash
git check-ignore -v github-details.txt
git log --all -- github-details.txt
```

The workflow uses the repository’s own `GITHUB_TOKEN`; no personal token is stored in Actions.

## 10. Troubleshooting

| Symptom | Check |
| --- | --- |
| Deploy fails at `configure-pages` or `deploy-pages` | Pages source must be **GitHub Actions**; enable it and re-run |
| Custom domain shows 404 | DNS records, Pages custom domain, certificate status |
| Root returns GitHub 404 | Cloudflare root redirect rule, or the noindex fallback `index.html` |
| CSS or fonts 404 | Custom domain must be active; assets use root-absolute paths |
| Histats shows no hits | Ad blocker, DNS filtering, or script blocked by a browser extension. The request should appear in DevTools → Network |
| Page count in Search Console is low | Submit the sitemap, request indexing for `/index1/`, check canonicals |
| QA step fails in Actions | Read the listed page; usually a stale hardcoded value, a canonical mismatch or an APK size change |
| Old `/index1/` returns 404 after a slug change | Add the old slug to `legacyHomeSlugs`, rebuild and redeploy |
| Old `/index1/` still indexed after a slug change | Add a Cloudflare 301 from the old slug, keep it for at least a few weeks |
