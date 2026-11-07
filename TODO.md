# TODO

Items that need real content, keys or a decision from Corevex. The site builds and runs without them; each related block is hidden or falls back until the value exists.

## Content

- [ ] PSEB registration number: set `NEXT_PUBLIC_PSEB_NUMBER` (shown in the footer and on About when set)
- [ ] Public contact email, phone and office address: set `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_OFFICE_ADDRESS` (Contact page details are hidden until set)
- [ ] Real client logos: add to `content/client-logos.json` (name, logo path, width, height). The logo strips stay hidden while it is empty
- [ ] Testimonials: add approved quotes to `content/testimonials.json`. Hidden while it is empty
- [ ] Case study results: add real numbers to `results` per case study in `content/case-studies.json`. Hidden until then
- [ ] Leadership headshots: add to `public/images` and set `image` in `content/team.json`. Placeholder SVGs are used until then
- [ ] Leadership LinkedIn URLs: set `linkedin` in `content/team.json`. The link is hidden until set
- [ ] Team and office photos
- [ ] Clutch and GitHub profile URLs: `NEXT_PUBLIC_CLUTCH_URL`, `NEXT_PUBLIC_GITHUB_URL` (hidden until set)
- [ ] Privacy Policy and Terms of Service: have them reviewed and approved by a legal advisor

## Keys and accounts

- [ ] Resend: verify the sending domain, set `CONTACT_FROM_EMAIL` to an address on it, create an audience and set `RESEND_AUDIENCE_ID`
- [ ] Vercel Blob store for CV uploads over 4.5 MB: `BLOB_READ_WRITE_TOKEN`
- [ ] GA4 measurement ID: `NEXT_PUBLIC_GA_ID` (no analytics script loads until set)
- [ ] Final domain: set `NEXT_PUBLIC_SITE_URL`, add the domain in Vercel and in Resend

## Performance

- [ ] Home page mobile Lighthouse performance is about 88 (other pages 99 to 100). Observed LCP is 0.4 to 0.5 s, but on localhost hydration runs before the first paint and Lighthouse's simulation charges that script time to LCP (3.8 s). Options: a lighter home page (fewer client sections hydrating at once), or measure on the deployed Vercel URL where scripts arrive after first paint
- [ ] First-load JS is about 150 KB gzip against a 120 KB target; the Next.js 16 framework floor is about 125 KB (see DECISIONS.md)

## Testing

- [ ] Visual baselines for Linux: run the CI workflow manually with "update visual" ticked, download the visual-baselines artifact into tests/visual/__screenshots__/linux and commit it
- [x] LinkedIn company URL confirmed: https://www.linkedin.com/company/corevex-solution/ (if `NEXT_PUBLIC_LINKEDIN_URL` is set in Vercel, update it there too)
- [ ] Optional: install the Microsoft Visual C++ runtime on Windows machines that should run Firefox tests locally (CI already runs Firefox and WebKit)

## Later

- [ ] Global rate limiting with Upstash Redis or Vercel KV if spam gets through the per-instance limiter
