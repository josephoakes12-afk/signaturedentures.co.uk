# Google Relaunch Checklist (Signature Dentures)

Last updated: 20 February 2026

## Current audit status
- Merge conflict markers have been removed from public HTML pages.
- Public pages are currently set to `noindex, nofollow`.
- `404.html` is set to `noindex, follow`.
- `robots.txt` currently allows crawling and exposes sitemap:
  - `User-agent: *`
  - `Allow: /`
  - `Sitemap: https://signaturedentures.co.uk/sitemap.xml`

## 1) Preflight before relaunch (must pass)
- Confirm legal/business copy is final on key pages:
  - `/`
  - `/services.html`
  - `/pricing.html`
  - `/about.html`
  - `/faq.html`
  - `/contact.html`
- Confirm forms and contact links work.
- Confirm no test content/placeholders remain.
- Confirm all canonical tags point to final production URLs.
- Confirm sitemap URLs are correct and live.

## 2) Remove noindex when you are ready to go live
- On all indexable public pages, remove:
  - `<meta name="robots" content="noindex, nofollow" />`
- Keep `404.html` as `noindex, follow`.
- Do not block the site in `robots.txt` during relaunch.

## 3) Deployment checks right after publish
- Open `https://signaturedentures.co.uk/robots.txt` and verify it is crawl-allowed.
- Open `https://signaturedentures.co.uk/sitemap.xml` and verify all URLs return `200`.
- Spot-check page source on homepage and one service page:
  - Ensure `noindex` is removed on indexable pages.
  - Ensure canonical is present and correct.

## 4) Google Search Console relaunch steps
- In Search Console, verify property ownership if not already done.
- Submit (or resubmit) sitemap:
  - `https://signaturedentures.co.uk/sitemap.xml`
- Use URL Inspection and click **Request Indexing** for:
  - Homepage
  - Services page
  - Contact page
- If temporary removals were previously used, clear/expire them as appropriate.

## 5) First 14 days monitoring
- Check **Pages indexing** report daily for 3-5 days, then every few days.
- Watch for:
  - `Excluded by 'noindex' tag`
  - `Crawled - currently not indexed`
  - Canonicalization mismatches
- Fix issues and request reindexing for affected URLs.

## 6) Quick rollback rule (if needed)
- If incorrect pages are being indexed, reapply `noindex, nofollow` to those pages only.
- Keep crawl access open so Google can recrawl updated directives.

## Optional local verification commands (PowerShell)
```powershell
# Verify no merge markers remain
Select-String -Path *.html -Pattern '^(<<<<<<<|=======|>>>>>>>)'

# List robots directives in all HTML pages
Get-ChildItem -File -Filter *.html | ForEach-Object {
  $m = Select-String -Path $_.FullName -Pattern '<meta name="robots" content="([^"]+)"' -AllMatches
  foreach($match in $m.Matches){ "{0}: {1}" -f $_.Name,$match.Groups[1].Value }
}
```
