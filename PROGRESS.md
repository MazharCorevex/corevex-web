# Progress

## Completed

- [x] Phase 1: Next.js 16 + TypeScript, ESLint, Prettier, tokens and ported stylesheet, next/font, folders (app, components, lib, styles, content, scripts)
- [x] Phase 2: image pipeline (`npm run images`): new PNGs to WebP q82 plus -800, reference assets copied, SVGs optimised, dimension manifest
- [x] Phase 3: header with mega menu (8 services) and drawer, dark footer with newsletter, skip link, focus states
- [x] Phase 4: home page, all sections, data-driven work rail and insights block
- [x] Phase 5: service template, 8 service pages (bodies in components/services/bodies), Services hub
- [x] Phase 6: Work index and case study template, AI Lab, About, Careers, Insights index and article template, Contact, FAQ, Privacy, Terms, 404 (Playwright: 194 passed)
- [x] Phase 7: content layer. Sanity was built first, then removed as out of scope; all content is local JSON in `/content`
- [x] Phase 8: Calendly popup on first click, teal, 30-minute wording everywhere
- [x] Phase 9: contact (3 steps), careers (PDF, 5 MB, Blob for large files), newsletter with honeypot, rate limit, Resend
- [x] Phase 10: metadata and canonicals on every page, generated OG images (/og/*.png), sitemap.xml, robots.txt, llms.txt, JSON-LD from reference, security headers
- [x] Phase 11: Lighthouse CI, Playwright (208 passed), link and image checks, content rules check. JS budget not reachable on Next 16, see DECISIONS.md

## Next steps

All phases are complete. Remaining items need real content or keys and are listed in TODO.md. To resume work: `npm install`, `npm run build`, `npm run test:e2e`.
