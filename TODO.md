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
- [ ] 13 images pending regeneration: `client-review` and the 12 Insights covers. Replace the PNGs in `/new-images` and run `npm run images`
- [ ] Clutch and GitHub profile URLs: `NEXT_PUBLIC_CLUTCH_URL`, `NEXT_PUBLIC_GITHUB_URL` (hidden until set)
- [ ] Privacy Policy and Terms of Service: have them reviewed and approved by a legal advisor

## Keys and accounts

- [ ] Resend: verify the sending domain, set `CONTACT_FROM_EMAIL` to an address on it, create an audience and set `RESEND_AUDIENCE_ID`
- [ ] Vercel Blob store for CV uploads over 4.5 MB: `BLOB_READ_WRITE_TOKEN`
- [ ] GA4 measurement ID: `NEXT_PUBLIC_GA_ID` (no analytics script loads until set)
- [ ] Final domain: set `NEXT_PUBLIC_SITE_URL`, add the domain in Vercel and in Resend

## Performance

- [ ] Home page mobile Lighthouse performance is about 85 (others 97 to 99). The LCP is the hero mark; in Lighthouse's simulation it waits on hydration of the large home page. Next steps if needed: move more of the home page out of client wrappers so less of it hydrates
- [ ] First-load JS is about 150 KB gzip against a 120 KB target; the Next.js 16 framework floor is about 125 KB (see DECISIONS.md)

## Later

- [ ] Global rate limiting with Upstash Redis or Vercel KV if spam gets through the per-instance limiter
