# Test report

Quality and testing pass on the Corevex Solutions site, run against a local production build (`npm run build` then `npm run start:test`, port 3100, `TEST_MODE=true`). Resend is mocked in test mode, so no real email was sent. The live Vercel site was never load tested.

Run everything with `npm run test:all`. The GitHub Actions workflow `.github/workflows/ci.yml` runs every suite on each push.

## Results per suite

| # | Suite | Command | Result |
| --- | --- | --- | --- |
| 1 | Responsive (Chromium, local) | `npm run test:responsive` | 944 / 944 passed |
| 1 | Responsive (Chromium, Firefox, WebKit on Linux CI) | CI `responsive` matrix | Chromium and Firefox: all passed. WebKit: all passed except the home page on 9 phone and tablet viewports (see below) |
| 1 | Visual regression (`toHaveScreenshot`) | `npm run test:visual` | 42 / 42 passed (Windows baselines) and 42 / 42 passed in CI on Linux baselines |
| 2 | Unit (Vitest and React Testing Library) | `npm run test:unit` | 106 / 106 passed, about 97% line coverage (threshold 80%) |
| 3 | End-to-end journeys | `npm run test:e2e` | 37 passed, 17 skipped by design (desktop-only or phone-only journeys in the other project) |
| 4 | Accessibility (axe-core) | `npm run test:a11y` | 162 / 162 passed, zero serious or critical issues |
| 5 | Lighthouse CI | `npm run test:perf` | See below. Desktop passes on every page; mobile is below 95 on 6 pages |
| 5 | Performance budgets (bundle tests) | `playwright.perf.config.ts` | 6 / 6 passed |
| 6 | Load, burst and abuse | `npm run test:load` | All passed |
| 7 | SEO and content checks | `npm run test:seo` | 16 / 16 passed |
| 7 | Links (linkinator) | part of `test:seo` | 143 / 143 links OK (LinkedIn skipped, see below) |
| 8 | Security headers, inputs and secrets | `playwright.security.config.ts`, `scripts/secrets-scan.mjs` | 7 / 7 passed; secrets scan clean; `npm audit --audit-level=high` clean |
| 9 | Content rules | `scripts/content-check.mjs` | 41 pages clean |
| 10 | Lint and types | `npm run lint`, `npm run typecheck` | Clean |

## Responsive coverage

38 pages × 22 viewport configurations × 3 browsers = 2,508 page checks, plus the condition tests.

- Phones in portrait and landscape: 360×800, 375×667, 390×844, 412×915, 430×932
- Tablets in portrait and landscape: 768×1024, 820×1180, 1024×1366
- Desktops: 1280×800, 1366×768, 1440×900, 1536×864, 1920×1080, 2560×1440

Each check covers:

- horizontal overflow
- overlapping text
- touch targets of at least 44 px on touch layouts
- images loaded and not stretched
- hero height
- header and footer layout
- page errors

The condition tests cover:

- 200% browser zoom
- text-only zoom at 200%
- reduced motion
- slow 4G with CPU throttling
- JavaScript disabled
- the iPhone safe area

Full-page screenshots for every page and viewport are in `test-results/responsive/<browser>/<viewport>/` (836 for Chromium locally). Visual baselines live in `tests/visual/__screenshots__/<platform>/`.

Firefox and WebKit run in CI on Linux only (last full run: GitHub Actions run 42370670135).

**Open WebKit item.** On the home page at the 9 phone and tablet viewports, WebKit refuses the full-page screenshot because its capture is over 32,767 px. The document measures about 19,000 px in Chromium and under 30,000 px in WebKit, and in Chromium no element reaches below the footer. Every other WebKit check passed. A diagnostic that names the stretching element is committed, but GitHub stopped starting Actions jobs (billing or spending limit) before it could run. Each of these tests stops at the screenshot, so its layout checks were not reported. Locally they will not start on this Windows machine, because Firefox needs the Microsoft Visual C++ runtime (`msvcp140_1.dll`) and WebKit fails to launch.

## Lighthouse

Median of 3 runs per page, local production build.

### Mobile (slow 4G, 4× CPU)

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | 89 | 100 | 100 | 100 | 3.8 s | 0.000 | 42 ms | 180 KB |
| /about/ | 96 | 100 | 100 | 100 | 2.8 s | 0.000 | 33 ms | 175 KB |
| /contact/ | 100 | 100 | 100 | 100 | 1.1 s | 0.000 | 36 ms | 175 KB |
| /insights/ | 92 | 100 | 100 | 100 | 3.4 s | 0.000 | 35 ms | 175 KB |
| /insights/what-is-rag/ | 100 | 100 | 100 | 100 | 1.1 s | 0.000 | 44 ms | 175 KB |
| /services/ai-agents-as-a-service/ | 100 | 100 | 100 | 100 | 1.1 s | 0.000 | 42 ms | 180 KB |
| /services/ai-automation/ | 100 | 100 | 100 | 100 | 1.1 s | 0.000 | 42 ms | 180 KB |
| /services/ai-llm-development/ | 100 | 100 | 100 | 100 | 1.1 s | 0.000 | 36 ms | 180 KB |
| /services/code-rescue/ | 100 | 100 | 100 | 100 | 1.1 s | 0.000 | 39 ms | 180 KB |
| /services/custom-software-development/ | 92 | 100 | 100 | 100 | 3.3 s | 0.000 | 44 ms | 180 KB |
| /services/full-stack-development/ | 92 | 100 | 100 | 100 | 3.3 s | 0.000 | 42 ms | 180 KB |
| /services/mobile-app-development/ | 100 | 100 | 100 | 100 | 1.1 s | 0.000 | 39 ms | 180 KB |
| /services/saas-app-development/ | 93 | 100 | 100 | 100 | 3.2 s | 0.000 | 41 ms | 180 KB |

### Desktop

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | 99 | 100 | 100 | 100 | 0.8 s | 0.000 | 0 ms | 180 KB |
| /about/ | 100 | 100 | 100 | 100 | 0.7 s | 0.000 | 0 ms | 180 KB |
| /contact/ | 100 | 100 | 100 | 100 | 0.3 s | 0.000 | 0 ms | 180 KB |
| /insights/ | 100 | 100 | 100 | 100 | 0.7 s | 0.000 | 0 ms | 180 KB |
| /insights/what-is-rag/ | 100 | 100 | 100 | 100 | 0.3 s | 0.000 | 0 ms | 180 KB |
| /services/ai-agents-as-a-service/ | 100 | 100 | 100 | 100 | 0.3 s | 0.000 | 0 ms | 180 KB |
| /services/ai-automation/ | 100 | 100 | 100 | 100 | 0.3 s | 0.000 | 0 ms | 180 KB |
| /services/ai-llm-development/ | 100 | 100 | 100 | 100 | 0.3 s | 0.000 | 0 ms | 180 KB |
| /services/code-rescue/ | 100 | 100 | 100 | 100 | 0.3 s | 0.000 | 0 ms | 180 KB |
| /services/custom-software-development/ | 100 | 100 | 100 | 100 | 0.8 s | 0.000 | 0 ms | 180 KB |
| /services/full-stack-development/ | 100 | 100 | 100 | 100 | 0.7 s | 0.000 | 0 ms | 180 KB |
| /services/mobile-app-development/ | 100 | 100 | 100 | 100 | 0.3 s | 0.000 | 0 ms | 180 KB |
| /services/saas-app-development/ | 100 | 100 | 100 | 100 | 0.3 s | 0.000 | 0 ms | 180 KB |

JS is the total script transfer Lighthouse records for the page.

### Budgets

| Budget | Status |
| --- | --- |
| Performance ≥ 95 | Desktop: met on every page. Mobile: missed on Home (89), Insights (92), custom software (92), full stack (92), SaaS (93). About is borderline (95 to 96) |
| LCP < 2 s | Desktop: met. Mobile: missed on the same pages (2.8 to 3.8 s simulated) |
| CLS < 0.05 | Met everywhere (0.000) |
| TBT < 150 ms | Met everywhere (33 to 46 ms mobile, 0 ms desktop) |
| First-load JS < 120 KB | Not met. About 175 to 180 KB transferred. The Next.js 16 and React 19 framework runtime alone is about 125 KB, so the budget can't be met without dropping the framework |
| No image over 250 KB | Met (bundle test checks every page) |
| three.js not in the initial bundle, never on mobile | Met. It loads only on desktop with a fine pointer and no reduced motion, once the Core section is near. It never loads on phone, tablet or reduced motion |

Why mobile falls short: on those pages the largest element is an image (the hero mark, the header logo or a feature photo). Lighthouse's simulated slow 4G queues that image behind the JavaScript. The LCP actually measured in the same runs is 0.2 to 0.5 s. Preloading the image and giving it high fetch priority did not change the simulated value. The remaining options change the approved design, so they are left for you to decide (see below).

## Load test

Local production build, 6 pages in rotation (`/`, `/services/`, `/services/code-rescue/`, `/services/ai-automation/`, `/insights/`, `/insights/what-is-rag/`).

| Measure | Result |
| --- | --- |
| Ramp | 50 → 100 → 150 connections, 10 s each, then 200 for 180 s |
| Requests | 152,835, all 200 OK |
| Average throughput | 728 req/s |
| p50 / p95 / p99 | 252 ms / 370 ms / 415 ms |
| p95 at 200 users | 373 ms (target under 500 ms) |
| Errors / timeouts | 0 / 0 |

Form burst: 50 contact submissions from one address in 9.8 s.

| Measure | Result |
| --- | --- |
| Accepted | 5 |
| Rate limited (429) | 45, first at the 6th request |
| Other statuses | 0 |
| Server healthy afterwards | Yes |
| Emails | 10 to the mock outbox (notification and confirmation for each accepted request), 0 real |

Abuse inputs, all handled as expected:

| Input | Status |
| --- | --- |
| 7 MB body | 413 |
| 6 MB CV | 413 |
| `.exe` uploaded as a CV | 415 |
| HTML file named `.pdf` | 415 |
| JSON body | 415 |
| Broken multipart | 400 |
| Script and `onerror` injection | 200, escaped in the email |
| 50 KB text field | 200, trimmed |
| Invalid email | 400 |
| `javascript:` link | 400 |
| Unknown form | 404 |

## Bugs found and fixed

| Area | Bug | Fix |
| --- | --- | --- |
| Images | Photos stretched when CSS set only a width | `img, video { height: auto }` |
| Hero | Hero column overflowed small phones | `minmax(0, 1fr)` hero grid at 860 px and below |
| Industries | Collapsed accordion labels were pushed off-centre | Closed item text taken out of flow |
| Hero | Orbit chips overlapped on short landscape screens | They become a swipe row when height is 520 px or less |
| Motion | Some blocks never revealed when scrolling fast | Reveal observer uses threshold 0 with a bottom margin |
| Touch | Footer, breadcrumb, legal and table-of-contents links under 44 px | Minimum 44 px targets on touch layouts up to 1100 px |
| Header | Mega menu opened on hover, then closed again on the same click | Click toggles unless hover already opened it; a tap outside closes it |
| Header | Mobile drawer let focus escape | Focus is trapped in the drawer and returns to the menu button |
| Copy | "One business day" reply promises | Removed (CLAUDE.md: no timelines) |
| Copy | Code Rescue used a different booking label | "Book a 30-minute call" with the Calendly popup |
| 404 | The 404 page HTML was empty until JavaScript ran | Static `not-found` page replaces the client catch-all |
| Accessibility | Scrollable tables and swipe rows were not keyboard reachable | Focusable regions with labels and focus styles |
| Accessibility | Low contrast on notes and health check tags | Darker tokens |
| Accessibility | /work/ skipped a heading level | Hidden "Projects" heading |
| No JavaScript | Forms, form steps, tabs and animated blocks unusable | Forms post to server actions; a noscript style shows the final state |
| iPhone | Content under the notch and home bar | Safe-area padding on the layout, drawer, footer, contact and sheet |
| Text zoom | Long words and buttons overflowed at 200% text size | Wrapping rules and `min-width: 0` on grid children |
| SEO | Service and Article JSON-LD missing required fields | Name, provider, URL, image, publisher, dates added |
| Security | High npm audit findings | `zod` and `basic-ftp` overrides |
| Performance | Every page inlined the full stylesheet (Home HTML 420 KB) | Stylesheet served as a cached file; Home HTML is 146 KB; load test p95 dropped from 876 ms to 236 ms |
| WebKit (CI) | `upgrade-insecure-requests` made WebKit fetch localhost scripts over https, so the page never hydrated | Test builds skip it; production keeps it |
| Linux fonts (CI) | Before and after lists overlapped on 360 px phones | The "after" list sits at the bottom on phones |
| Forms | Burst submissions needed clear HTTP codes | Shared handlers return 400, 413, 415, 429 through `/api/forms/*` |

## Needs your input

- **Mobile Lighthouse on 6 pages.** Reaching 95 under simulated slow 4G means a smaller or text-based largest element above the fold on Home, Insights and three service pages. That changes the approved design, so it is your call.
- **The 120 KB first-load JS budget.** The framework alone is about 125 KB. Either raise the budget to about 185 KB or accept the CI failure.
- **GitHub Actions billing.** The last push could not start any job: "recent account payments have failed or your spending limit needs to be increased". Fix it under Settings, Billing and plans, then re-run CI to get the WebKit home page diagnostic.
- **Firefox and WebKit locally.** Install the Microsoft Visual C++ Redistributable if you want to run them on this machine. CI covers them meanwhile.
- **Open items from CLAUDE.md.** PSEB number, contact email, phone and office address; real client logos, headshots and team photos; the final domain for Resend and Vercel.
- **Legal review** of the Privacy and Terms copy.
- **Commit attribution.** Seven pushed commits (29aac84 to 57f6417) end with a literal `$T` instead of the co-author line. Fixing that means rewriting pushed history, so it has been left alone.
