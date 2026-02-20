# Search Hide Plan

## What changed in this commit
- Added `<meta name="robots" content="noindex, nofollow" />` to all public HTML pages:
  - `index.html`
  - `about.html`
  - `services.html`
  - `pricing.html`
  - `faq.html`
  - `contact.html`
  - `privacy.html`
  - `cookies.html`
  - `accessibility.html`
  - `404.html` (standardized from `noindex` to `noindex, nofollow`)
- Added a maintenance comment near the robots tag in each page head:
  - `<!-- TEMP: Site hidden from search while business setup. Remove noindex to relaunch. -->`
- Left `robots.txt` unchanged and crawl-allowed for now (`User-agent: *`, `Allow: /`, sitemap present) so Google can still fetch pages and see `noindex`.

## Manual Google Search Console removal steps
1. Go to **Google Search Console** for `https://signaturedentures.co.uk/`.
2. Open **Removals**.
3. Click **New request**.
4. Choose **Temporarily remove URL** or **Remove all URLs with this prefix**.
5. Use this prefix: `https://signaturedentures.co.uk/`

Note: the Removals tool generally hides URLs for about 6 months and clears cached snippets while longer-term deindexing takes effect from page-level `noindex`.

## Optional later tightening
- After URLs are removed from results, you may optionally set `robots.txt` to `Disallow: /` if desired.
- `robots.txt` is not the primary hiding mechanism; page-level `noindex` is.

## Relaunch checklist
- Remove all `<meta name="robots" content="noindex, nofollow" />` tags.
- (If changed later) restore `robots.txt` to crawl-allowing state.
- Resubmit sitemap in Search Console.
- Request indexing for key pages.