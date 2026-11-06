# Progress

## Completed

- [x] Phase 1: Next.js 16 + TypeScript, ESLint, Prettier, tokens and ported stylesheet, next/font, folders (app, components, lib, styles, sanity, content, scripts)
- [x] Phase 2: image pipeline (`npm run images`): new PNGs to WebP q82 plus -800, reference assets copied, SVGs optimised, dimension manifest
- [x] Phase 3: header with mega menu (8 services) and drawer, dark footer with newsletter, skip link, focus states
- [x] Phase 4: home page, all sections, data-driven work rail and insights block
- [x] Phase 5: service template, 8 service pages (bodies in components/services/bodies), Services hub
- [x] Phase 6: Work index and case study template, AI Lab, About, Careers, Insights index and article template, Contact, FAQ, Privacy, Terms, 404 (Playwright: 194 passed)
- [ ] Phase 7: Sanity schemas, seed, embedded Studio
- [ ] Phase 8: Calendly booking
- [ ] Phase 9: forms with Resend
- [ ] Phase 10: SEO, sitemap, robots, llms.txt, headers
- [ ] Phase 11: Lighthouse CI, Playwright, link and content checks

## Next steps

Continue from the first unchecked phase. Regenerate markup with `node scripts/gen-pages.mjs` only for pages not yet hand edited (home sections are never overwritten).
