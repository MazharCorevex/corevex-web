# Pre-deployment test report

**Date:** 12 November 2026
**Build:** local production build (`npm run build && npm run start`), Next.js 16, tested on Windows 11. Nothing was deployed. The live site was not touched.
**Overall: FAIL.** Every functional, accessibility, SEO, security and load check passes. Two performance budgets fail and need your decision: mobile Lighthouse LCP on 8 image-hero pages, and first-load JS (146.6 to 150.2 kB vs the 120 kB budget). No test or budget was weakened.

## Summary

| Category | Result | Notes |
|---|---|---|
| 1. Performance, desktop | PASS | 21/21 pages: Perf 99 to 100, LCP 0.29 to 0.91 s, CLS 0 |
| 1. Performance, mobile | **FAIL** | 13/21 pass; 8 image-hero pages miss LCP < 2.0 s in Lighthouse's simulated throttling |
| 1. First-load JS ≤ 120 kB gz | **FAIL** | 146.6 to 150.2 kB on every page; the React + Next.js runtime alone is about 128 kB |
| 1. INP (4x CPU) | PASS | Worst interaction 168 ms (< 200 ms) |
| 1. Images, fonts, caching, video, third parties | PASS | See section 1 |
| 2. Responsive, Chromium | PASS | 18 widths × 47 pages, 11 devices in portrait and landscape, components, 200% zoom |
| 2. Responsive, Firefox and WebKit | NOT RUN LOCALLY | They can't start on this PC (missing `msvcp140_1.dll`, the Visual C++ runtime); CI on Linux runs them |
| 3. E2E journeys | PASS | 99 passed |
| 4. Accessibility | PASS | axe: 0 serious or critical on every page; 240 passed, 1 timing flake (passes 3/3 alone) |
| 5. SEO and content | PASS | 16 passed; 48 pages clean; 142 links, 0 broken |
| 6. Security | PASS | 8 passed; no secrets; npm audit 0 high or critical |
| 7. Load (k6) | PASS | 12,284 requests, 0% errors, p95 21 ms (pages) and 10 ms (contact API) |
| 7. Memory | PASS | 5 min of navigation: heap plateaus, DOM nodes and listeners constant |
| 8. Unit (Vitest) | PASS | 132 passed |
| Lint and typecheck | PASS | ESLint and `tsc --noEmit` clean |

## 1. Performance

### Lighthouse CI (3 runs per page, median)

Budgets. Mobile: Perf ≥ 95, LCP < 2.0 s, CLS < 0.05, TBT < 150 ms, SI < 2.5 s, FCP < 1.5 s. Desktop: Perf ≥ 98, LCP < 1.2 s, CLS < 0.02.
The 404 page answers HTTP 404, which Lighthouse refuses to audit. `tests/perf/vitals.spec.ts` measures it instead.

#### Mobile (Moto G Power, Slow 4G, simulated)

| Page | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | JS kB | Budget |
|---|---|---|---|---|---|---|---|---|---|---|---|
| / | 85 | 100 | 100 | 100 | 1.21 s | 4.25 s | 83 ms | 0 | 2.15 s | 185 | FAIL |
| /about/ | 94 | 100 | 100 | 100 | 1.21 s | 3.08 s | 41 ms | 0 | 1.41 s | 180 | FAIL |
| /careers/ | 94 | 100 | 100 | 100 | 1.06 s | 3.12 s | 52 ms | 0 | 1.26 s | 180 | FAIL |
| /contact/ | 100 | 100 | 100 | 100 | 1.06 s | 1.06 s | 49 ms | 0 | 1.06 s | 180 | PASS |
| /cookies/ | 100 | 100 | 100 | 100 | 1.06 s | 1.06 s | 43 ms | 0.001 | 1.06 s | 180 | PASS |
| /faq/ | 100 | 100 | 100 | 100 | 1.06 s | 1.06 s | 42 ms | 0 | 1.06 s | 180 | PASS |
| /insights/ | 89 | 100 | 100 | 100 | 1.21 s | 3.66 s | 68 ms | 0 | 1.21 s | 180 | FAIL |
| /insights/what-is-rag/ | 100 | 100 | 100 | 100 | 1.21 s | 1.21 s | 51 ms | 0 | 1.21 s | 180 | PASS |
| /privacy/ | 100 | 100 | 100 | 100 | 1.21 s | 1.21 s | 34 ms | 0 | 1.21 s | 180 | PASS |
| /services/ | 100 | 100 | 100 | 100 | 1.06 s | 1.06 s | 59 ms | 0 | 1.17 s | 185 | PASS |
| /services/ai-agents-as-a-service/ | 100 | 100 | 100 | 100 | 1.21 s | 1.21 s | 61 ms | 0 | 1.65 s | 185 | PASS |
| /services/ai-automation/ | 100 | 100 | 100 | 100 | 1.21 s | 1.21 s | 45 ms | 0 | 1.78 s | 185 | PASS |
| /services/ai-llm-development/ | 89 | 100 | 100 | 100 | 1.21 s | 3.70 s | 46 ms | 0 | 1.47 s | 185 | FAIL |
| /services/code-rescue/ | 100 | 100 | 100 | 100 | 1.21 s | 1.21 s | 52 ms | 0 | 1.70 s | 185 | PASS |
| /services/custom-software-development/ | 89 | 100 | 100 | 100 | 1.21 s | 3.80 s | 44 ms | 0 | 1.92 s | 185 | FAIL |
| /services/full-stack-development/ | 91 | 100 | 100 | 100 | 1.21 s | 3.48 s | 42 ms | 0 | 1.71 s | 185 | FAIL |
| /services/mobile-app-development/ | 100 | 100 | 100 | 100 | 1.21 s | 1.21 s | 54 ms | 0 | 1.94 s | 185 | PASS |
| /services/saas-app-development/ | 100 | 100 | 100 | 100 | 1.21 s | 1.21 s | 64 ms | 0 | 1.82 s | 185 | PASS |
| /terms/ | 100 | 100 | 100 | 100 | 1.21 s | 1.21 s | 44 ms | 0 | 1.21 s | 180 | PASS |
| /work/ | 90 | 100 | 100 | 100 | 1.21 s | 3.63 s | 45 ms | 0 | 1.29 s | 180 | FAIL |
| /work/mary-properties/ | 100 | 100 | 100 | 100 | 1.06 s | 1.06 s | 44 ms | 0 | 1.06 s | 180 | PASS |

#### Desktop

| Page | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Budget |
|---|---|---|---|---|---|---|---|---|---|---|
| / | 99 | 100 | 100 | 100 | 0.34 s | 0.91 s | 0 ms | 0 | 0.69 s | PASS |
| /about/ | 100 | 100 | 100 | 100 | 0.33 s | 0.74 s | 0 ms | 0 | 0.50 s | PASS |
| /careers/ | 100 | 100 | 100 | 100 | 0.29 s | 0.70 s | 0 ms | 0 | 0.43 s | PASS |
| /contact/ | 100 | 100 | 100 | 100 | 0.29 s | 0.29 s | 0 ms | 0 | 0.37 s | PASS |
| /cookies/ | 100 | 100 | 100 | 100 | 0.29 s | 0.29 s | 0 ms | 0 | 0.30 s | PASS |
| /faq/ | 100 | 100 | 100 | 100 | 0.29 s | 0.29 s | 0 ms | 0 | 0.30 s | PASS |
| /insights/ | 100 | 100 | 100 | 100 | 0.33 s | 0.72 s | 0 ms | 0 | 0.44 s | PASS |
| /insights/what-is-rag/ | 100 | 100 | 100 | 100 | 0.33 s | 0.33 s | 0 ms | 0 | 0.42 s | PASS |
| /privacy/ | 100 | 100 | 100 | 100 | 0.33 s | 0.33 s | 0 ms | 0 | 0.33 s | PASS |
| /services/ | 100 | 100 | 100 | 100 | 0.29 s | 0.29 s | 0 ms | 0 | 0.32 s | PASS |
| /services/ai-agents-as-a-service/ | 100 | 100 | 100 | 100 | 0.33 s | 0.78 s | 0 ms | 0 | 0.52 s | PASS |
| /services/ai-automation/ | 100 | 100 | 100 | 100 | 0.33 s | 0.79 s | 0 ms | 0 | 0.53 s | PASS |
| /services/ai-llm-development/ | 100 | 100 | 100 | 100 | 0.33 s | 0.79 s | 0 ms | 0 | 0.54 s | PASS |
| /services/code-rescue/ | 100 | 100 | 100 | 100 | 0.33 s | 0.79 s | 0 ms | 0 | 0.53 s | PASS |
| /services/custom-software-development/ | 100 | 100 | 100 | 100 | 0.33 s | 0.81 s | 0 ms | 0 | 0.53 s | PASS |
| /services/full-stack-development/ | 100 | 100 | 100 | 100 | 0.33 s | 0.79 s | 0 ms | 0 | 0.53 s | PASS |
| /services/mobile-app-development/ | 100 | 100 | 100 | 100 | 0.34 s | 0.79 s | 0 ms | 0 | 0.58 s | PASS |
| /services/saas-app-development/ | 100 | 100 | 100 | 100 | 0.33 s | 0.78 s | 0 ms | 0 | 0.51 s | PASS |
| /terms/ | 100 | 100 | 100 | 100 | 0.33 s | 0.33 s | 0 ms | 0 | 0.33 s | PASS |
| /work/ | 100 | 100 | 100 | 100 | 0.33 s | 0.33 s | 0 ms | 0 | 0.42 s | PASS |
| /work/mary-properties/ | 100 | 100 | 100 | 100 | 0.29 s | 0.29 s | 0 ms | 0 | 0.45 s | PASS |

### Slowest 5 pages (mobile) and why

| Page | Perf | LCP | Cause |
|---|---|---|---|
| / | 85 | 4.25 s | The LCP is the hero mark image, which shares Slow 4G bandwidth with about 180 kB of JS in Lighthouse's simulation; 300 ms of unused JS |
| /services/custom-software-development/ | 89 | 3.80 s | The LCP is the hero photo; same JS contention |
| /services/ai-llm-development/ | 89 | 3.70 s | The LCP is the hero photo; same JS contention; 150 ms of unused CSS |
| /insights/ | 89 | 3.66 s | The LCP is the featured article photo |
| /work/ | 90 | 3.63 s | The LCP is the first project card image; 340 ms of unused JS |

Real throttled measurements in Chromium (not Lantern's estimate) are much lower: home LCP 1.93 s, custom software 1.66 s, about 1.73 s, work 2.13 s. The budget is judged on Lighthouse, so these pages stay FAIL.

### Other performance checks

| Check | Result |
|---|---|
| INP, 4x CPU slowdown (web-vitals) | Services menu 168 ms, tech tabs 128 ms, industries accordion 104 ms, newsletter submit 128 ms, contact steps 104 ms. PASS |
| Home on Fast 3G / Slow 4G / 4G | FCP 1.94 / 1.19 / 0.59 s; usable 4.17 / 2.68 / 0.85 s |
| Custom software page on Fast 3G / Slow 4G / 4G | FCP 1.96 / 1.42 / 0.81 s; LCP 3.13 / 1.91 / 0.81 s; usable 3.56 / 2.58 / 0.93 s |
| First-load JS (gzip) | 146.6 to 150.2 kB per page. FAIL (budget 120 kB) |
| three.js gating | Not in any first-load bundle; loads only for the Core section on desktop without reduced motion. PASS |
| Images | 192 image requests, 166 via the optimizer (the rest are SVG icons); AVIF or WebP; lazy below the fold; only hero images take priority; none over 200 kB; none served at more than 2x their display size. PASS |
| Gears video | Not requested until the section is near the viewport; poster only on mobile and with reduced motion. PASS |
| Fonts | Self-hosted via next/font, preloaded, `font-display: swap`. PASS |
| Caching and compression | Static assets `public, max-age=31536000, immutable`; HTML, CSS and JS gzip-compressed. PASS |
| Third parties before interaction | 0 (81 first-party requests on home). GA loads only after consent; Calendly loads only on a booking click. PASS |
| Cold vs warm | Home 504 kB → 0.6 kB, 978 → 155 ms; code rescue 494 kB → 0.3 kB; RAG article 492 kB → 0.3 kB |
| 404 page | Measured by Playwright: renders with status 404 and passes the vitals checks |

## 2. Responsive

| Suite | Result |
|---|---|
| 18 widths (320 to 2560) × 47 pages, Chromium | PASS |
| 11 device profiles (iPhone SE, 13, 15 Pro Max, Pixel 7, Galaxy S23, iPad Mini, Air, Pro 12.9, Surface Pro, two laptops), portrait and landscape | PASS in Chromium. The WebKit and Firefox profiles were not run locally |
| Component checks at 320, 390, 768 and 1440 (cookie banner, booking window, offer and price cards, code rescue health check) | PASS |
| Anchor targets clear the sticky header at 390 and 1440 | PASS |
| 200% zoom | PASS |
| Firefox and WebKit | Not run locally: Playwright reports `Host system is missing dependencies: msvcp140_1.dll` (Microsoft Visual C++ 2015 to 2022 runtime). The CI workflow runs all three engines on Linux |

Checks per page: no horizontal scroll, no overlapping text, tap targets ≥ 44 px on touch, body text ≥ 14 px on phones, no cut-off text, image aspect ratios, and no console errors or warnings.

**Screenshots.** Full-page captures at 390, 768 and 1440 for every page are written to `tests/screenshots/chromium/{width}/` by `npm run test:screens`. They total 49 MB, so they are gitignored and rebuilt on demand. Contact sheets are committed:
- [chromium-390.jpg](tests/screenshots/contact-sheets/chromium-390.jpg)
- [chromium-768.jpg](tests/screenshots/contact-sheets/chromium-768.jpg)
- [chromium-1440.jpg](tests/screenshots/contact-sheets/chromium-1440.jpg)

Visual regression baselines were updated for Windows. Linux baselines need the CI `update_visual` run (see Issues).

## 3. E2E journeys (Resend mocked with TEST_MODE=true)

99 passed, desktop and mobile.

- **Contact:** valid submit; field errors; honeypot; rate limit (the 6th enquiry in 10 minutes gets 429); `?offer=` prefills every offer; an unknown offer falls back to "No specific offer".
- **Careers:** file type and size limits.
- **Newsletter:** subscribe; invalid address; duplicate address.
- **Cookie consent:** zero GA requests before Accept; GA after Accept; `_ga` cookies removed on withdrawal; the footer link reopens settings.
- **Navigation:** menu, drawer, back and forward, breadcrumbs, every CTA resolves; a broken URL shows the 404 page.
- **Pricing:** only $199, $599, $2,000 to $2,500 per month, from $5,000 and from $1,000 appear anywhere; no other currency or hourly rates.

## 4. Accessibility

- **axe-core** on every page, desktop and mobile: 0 serious or critical violations.
- **Keyboard:**
  - Every page: focus ring visible, focus on screen, no trap, and the first Tab reaches the skip link.
  - Tabs work with the arrow keys and the accordion with Enter and Space.
  - The drawer and the cookie panel work by keyboard.
- **Other:** form errors are announced; one banner, one main and one contentinfo per page; all navs labelled; contrast, alt text, labels and heading order checked by axe.
- **Reduced motion:** animations, the orbit, the 3D scene and the video are disabled.
- **Result:** 240 passed, 1 flaky. "Tab order on /" once found the work rail's Previous button off screen while smooth scrolling ran under 4 parallel workers. It passed 3 of 3 on its own, and the test was not changed.

## 5. SEO and content

- **Pages:** unique titles ≤ 60 and descriptions ≤ 160 characters, canonical, Open Graph and Twitter tags with `og-image.jpg`, one H1 per page.
- **Indexing:** sitemap.xml, robots.txt and JSON-LD are valid.
- **Links:** 142 crawled, 0 broken, no redirect chains. LinkedIn is skipped because it blocks crawlers.
- **Copy scan:** 48 pages clean. No em dash, no placeholders ([brackets], {{ }}, lorem, TBD, "coming soon"), no banned words, only approved prices, "Book a 30-minute call" everywhere.
- **Legal pages:** show Corevex Solutions, the Hasilpur address, hello@corevex.org, the Lahore courts and the 11 November 2026 effective date.

## 6. Security

- **Headers:** CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy and frame protection on pages, assets and API routes.
- **Secrets scan:** client build (340 files), 252 tracked files and the diffs of all 45 commits contain no keys or tokens. The contact sender address appears in `lib/server/email.ts` by design; it is reported as a note, not a secret.
- **npm audit:** 0 high, 0 critical, 9 moderate (glob and minimatch through dev tooling).
- **API:** rejects malformed multipart, non-PDF CVs, XSS and `%00` input, PUT and DELETE, and a 7 MB payload (413), all without stack traces.

## 7. Load and stability

- **k6 (local build only):** 50 VUs for 2 minutes on Home and the custom software page, plus a contact API burst of 20 requests per second for 20 s with Resend mocked. 12,284 requests, 0 failed, all checks passed. Pages p95 21 ms (p99 74 ms); contact p95 10 ms.
- **Console:** no errors or warnings in Chromium across the responsive matrix.
- **Memory:** 5 minutes of client navigation (114 loops). Heap 6.6 → 7.7 MB with a flat second half (< 5% growth); DOM nodes 1,006 and listeners 483, unchanged.

## 8. Unit tests (Vitest)

132 passed across 10 files: utilities, form validation, offer slug mapping, consent logic and cookie handling, price formatting, the legal parser, and component rendering.

## 9. Automation

- **npm scripts:** `test:unit`, `test:e2e`, `test:responsive`, `test:screens`, `test:a11y`, `test:visual`, `test:perf`, `test:seo`, `test:security`, `test:load`, `test:all`.
- **CI:** `.github/workflows/ci.yml` runs every suite on each pull request, with a `test-all` gate job that fails if any job fails or is skipped. While the two performance budgets fail, this gate will be red.

## Issues

### Fixed in this round

| Severity | Issue | Fix |
|---|---|---|
| High | Hero orbit chips overlapped each other at 861 to 1000 px (Surface Pro portrait): the copy column took 620 px and left the art 121 px | The copy is capped at 44vw in that range, and the chips switch to the swipe row whenever the art is narrower than 340 px |
| High | Tech stack tabs jumped back to the first tab when the section scrolled into view, undoing a keyboard user's choice | The entrance reset only runs if the visitor hasn't picked a tab |
| High | Hero headline and service photos started at opacity 0, which Chrome excludes from LCP | The first paint is visible; only a transform animates |
| High | Keyboard focus could land off screen (hidden header, skip link) | The header shows while it has focus; the skip link is fixed |
| Medium | Body text under 14 px on phones (legal effective date, Work note, marquee title) | 14 px below 768 px |
| Medium | three.js deprecation warning in the console on Home | `shapePath.toShapes()` replaces `SVGLoader.createShapes` |
| Medium | Careers CV error was not announced | A persistent polite live region, linked with `aria-describedby` |
| Medium | Image `sizes` too large for the mobile app, team avatar, author and leader images; first Work cards lazy | Correct `sizes`, first two Work cards eager, logo no longer high priority |
| Medium | Teal link and ribbon text under 4.5:1 contrast | `--teal-text` #287469 |
| Low | Contact page told visitors to choose "Book a call" | Now "Book a 30-minute call" |
| Low | Four titles over 60 characters | Shortened in seo-data and content |

### Needs your input

| Severity | Issue | Options |
|---|---|---|
| High | Mobile Lighthouse LCP fails on 8 image-hero pages (3.1 to 4.3 s simulated; real throttled runs 1.7 to 2.1 s) | (a) Reduce hydration JS so the image gets the bandwidth (see the next row). (b) Make those heroes text-first, so the headline is the LCP and the photo sits below it or loads after. (c) Accept and record it as a known deviation |
| High | First-load JS 146.6 to 150.2 kB gz vs 120 kB | React DOM plus the Next.js runtime is about 128 kB before any site code, so the budget can't be met on this stack as is. Options: move more sections to server components and drop client islands; replace small interactive pieces with CSS-only versions; or raise the budget to about 155 kB (your call, not mine) |
| Medium | Firefox and WebKit can't run on this PC | Install the Microsoft Visual C++ 2015 to 2022 runtime (`winget install Microsoft.VCRedist.2015+.x64`) or rely on the Linux CI run |
| Low | Linux visual baselines are out of date after the footer and legal page changes | Run the CI workflow manually with `update_visual` and commit the uploaded baselines |
| Low | 9 moderate npm advisories in dev tooling | Wait for upstream fixes; `npm audit fix --force` would make breaking upgrades |

Raw outputs are in `test-results/` (gitignored): `perf/lighthouse.md`, `perf/*.json`, `load/k6-summary.json`, `js-budget.txt` and the per-suite run logs.
