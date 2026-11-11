# Decisions

Decisions taken during the build, so the reasoning is on record.

## Stack and structure

- **Next.js 16 (App Router, Turbopack)** with React Server Components by default. `trailingSlash: true` keeps the prototype's URLs (`/about/`, `/services/ai-automation/`).
- **No CMS.** Sanity was built in phase 7 and then removed at the client's request as out of scope. All content lives as JSON in `/content`, read by `lib/content.ts`, and every page is fully static (no ISR). Changing content means editing the JSON and redeploying.
- **Page markup is converted, not retyped.** `scripts/gen-pages.mjs` converts each reference page's `<main>` into JSX (`components/generated`, `components/home/sections`). This keeps copy, classes and structure identical to `/reference`. The generated files are committed and edited by hand from there.
- **Content extraction.** `scripts/gen-content.mjs` turns the 13 articles, 6 case studies, leadership bios and job openings into JSON in `/content`. Article bodies are stored as Portable Text JSON (rendered with `@portabletext/react`), which keeps headings, links and tables structured.
- **SEO data extraction.** `scripts/gen-seo.mjs` copies every page's title, meta description and JSON-LD from `/reference` into `lib/seo-data.json`, so nothing is retyped and nothing drifts.

## Styling

- **The prototype stylesheet is ported as ordered global CSS, not split into CSS Modules.** `style.css` is a cascade of later sections overriding earlier ones (light header over dark header, white hero over dark hero, and so on). Splitting it into per-component modules would change specificity and source order and therefore the look. It lives in `styles/tokens.css` (design tokens) and `styles/site.css` (everything else, in original order). New UI that did not exist in the prototype (form errors, honeypot, alerts) uses CSS Modules (`components/forms/forms.module.css`). No Tailwind, no CSS-in-JS, no UI kit.
- **`styles/overrides.css`** holds the few additions: above-the-fold reveals and headline words animate with CSS keyframes on load instead of waiting for JavaScript (better LCP), Next image slots inside `.bg` tiles, drawer visibility for keyboard users, and 44 px tap targets on touch devices.
- **Fonts** come from `next/font/google`: Inter (variable, Latin), Montserrat 600 (Latin), JetBrains Mono 500 (Latin, not preloaded because it is only used for small labels). All `display: swap`. The self-hosted woff2 files from the prototype are not used.

## Images

- `new-images/*.png` converted to WebP quality 82 plus an `-800` version in `public/images/photos`, replacing same-name files. All other prototype assets copied into `public/images`; SVGs optimised with SVGO. Hero videos are not copied because no page uses them.
- `lib/image-manifest.json` stores the width and height of every image so the `Img` component always renders explicit dimensions (no layout shift). Raster images go through `next/image` (AVIF and WebP). SVG icons and logos are plain `img` with width and height.
- Tile and accordion backgrounds that were CSS `background-image` in the prototype are now `next/image` fills so they get responsive sizes and modern formats.

## Interactivity

- Client components only for interactive pieces: header (mega menu, drawer), hero orbit, health check, pinned Core, tech stack tabs, industries accordion, work rail, filters, feature list, before and after, AI Lab demos, leadership sheet, forms, booking button, plus one small `Motion` component for scroll reveals, count up, parallax and tile tilt (IntersectionObserver and CSS transitions only). Wrapper components (Tabs, Accordion, Rail, Filter) keep their content server rendered and only add behaviour.
- **3D Core uses plain three.js, not React Three Fiber.** It is a direct port of the prototype's `core-3d.js` and is about 40 KB lighter than adding React Three Fiber on top. It is loaded with a dynamic `import()` only on screens 861 px and wider with a fine pointer and no reduced-motion preference, and only when the section is about to scroll into view. Everyone else sees the static WebP render.

## Content rules applied

- "Book a 20-minute call" changed to "Book a 30-minute call" everywhere, including the contact form option.
- Work cards and the home rail say **"Product design study"** (the prototype mixed "Design study" and "Concept"). The work index note now says "Projects marked Product design study ...".
- **Client logo strips are hidden.** The prototype's ten logos are placeholders (per its README), so showing them as "Trusted by" would be invented social proof. The strip renders automatically once real logos are added to `content/client-logos.json`.
- **Testimonials and case study results** render only when real entries exist in `content/testimonials.json` and the case study `results`. Both are empty.
- Bracket placeholders are never rendered: the PSEB number, email, phone, address and social links come from environment variables and the element is hidden when the value is empty. The "[Replace with ...]" notes on Privacy and Terms are removed (legal review is listed in TODO.md).
- Services hub intro said "Seven services" while listing eight; changed to "Eight services".

## Forms

- Server actions (`app/actions.ts`) with server-side validation, a honeypot field, a minimum fill time and an in-memory rate limit (5 submissions per 10 minutes per IP per form). The in-memory limiter is per server instance; for strict global limits add Upstash Redis or Vercel KV later (noted in TODO.md).
- Email through Resend: notification to `CONTACT_TO_EMAIL`, branded confirmation to the sender. Sender address from `CONTACT_FROM_EMAIL`. Newsletter signups are added to `RESEND_AUDIENCE_ID`.
- **CV upload:** PDF only, 5 MB max, checked in the browser and again on the server (type, size and `%PDF-` signature). Vercel functions accept at most 4.5 MB per request, so when `BLOB_READ_WRITE_TOKEN` is set the CV is uploaded straight to Vercel Blob from the browser and the server action receives the file URL and attaches it to the notification email. Without the token the file goes through the server action directly (fine locally and for files under 4.5 MB).
- Forms submit through `startTransition` instead of the `action` prop so a validation error does not wipe what the visitor typed.
- In development without Resend keys the forms log a warning and show success; in production they show an error instead of silently dropping the message.

## Booking

- Every "Book a 30-minute call" button is a link to `NEXT_PUBLIC_CALENDLY_URL` that opens the Calendly popup with `primary_color=48ac9f`. The Calendly script and stylesheet are injected on the first click only. Without the env variable the button falls back to `/contact/#call`.

## Performance

- **First-load JavaScript budget (120 KB gzip) is not reachable on Next.js 16 as specified.** The framework alone ships about 125 KB gzipped on every App Router page (React DOM 63.8 KB, Next router runtime 44.6 KB, plus router, Turbopack runtime and polyfill chunks). Pages measure 147 to 152 KB, so the app code on top is 20 to 25 KB. Checked with Turbopack and webpack builds (same result). Measured with `npm run qa:js`; Next 16 no longer prints sizes in `next build` output.
- What was done to keep app JavaScript small: no `next/image` inside client components (images are passed in as server-rendered slots), the mega menu is server rendered and passed to the header, every `NEXT_PUBLIC_` variable has a default so no `process` polyfill is needed, three.js is a separate chunk loaded only on desktop when the Core section nears the viewport, Calendly loads on first click, GA4 only with an ID, and the tech stack logos are CSS masks over the existing SVG files instead of inline SVG (half the size of that section).
- **CSS is inlined** (`experimental.inlineCss`) so there is no render-blocking stylesheet request.
- Above-the-fold reveals and headline words animate with CSS keyframes from first paint, and hero photos are never hidden waiting for JavaScript.
- Open Graph images are served from `/og/<type>/<slug>.png` because Next's file-based `opengraph-image` URLs hit the trailing-slash redirect.

## Accessibility

- Small teal labels, chips and links on light backgrounds use `--teal-text: #287469` (5.5:1 on white) instead of `#2E8579` (4.4:1), and muted text uses `#636A7D`. The brand teal tokens are unchanged for buttons, accents and dark sections.
- Mega menu and footer column titles are `h2` (styled exactly as the old `h4`) so heading levels do not skip.
- Drawer and leader sheet use `inert` when closed, Escape closes menus and sheets, tabs support arrow keys.

## Content checks

- `scripts/content-check.mjs` scans every rendered page, `llms.txt`, `sitemap.xml` and `robots.txt`. The AI Lab extraction demo intentionally shows a sample supplier invoice with amounts; those amounts are excluded from the price rule because they are demo data, not Corevex pricing.

## Quality and testing pass

- **Suites and where they live.** Unit and component tests use Vitest and Testing Library (`tests/unit`). Playwright suites each have their own config and output folder: `playwright.config.ts` (end-to-end journeys), `.responsive`, `.visual`, `.a11y`, `.seo` (SEO and content rules), `.security` and `.perf` (bundle and image budgets). Lighthouse CI uses `lighthouserc.cjs` with `LHCI_PRESET=desktop` for the desktop run. Load, burst and abuse tests use autocannon and plain fetch (`scripts/load-test.mjs`) and refuse to run against anything but localhost.
- **No real email in tests.** With `TEST_MODE=true` the Resend client is replaced by an in-memory outbox, even when `.env.local` holds a real key. `/api/test/outbox` exists only in test mode and returns 404 otherwise.
- **Form endpoint with status codes.** The form logic moved to `lib/server/forms.ts`. Server actions stay the primary path for the site, and `/api/forms/<contact|newsletter|careers>` exposes the same logic with real HTTP codes (400 validation, 413 too large, 415 wrong type, 429 rate limited) so the burst test can see the limiter. The endpoint has the same honeypot, timing and rate limit.
- **Forms work without JavaScript.** Every form has `action={...}` for progressive enhancement and keeps its `onSubmit` handler for the enhanced path. A `<noscript>` style shows all contact steps, all tech stack panels, the orbit chips and every reveal in its final state.
- **Booking wording.** The Code Rescue buttons said "Book a code rescue call". All booking buttons now say "Book a 30-minute call" and open Calendly, as the content rules require.
- **Reply-time promises removed.** "Replies within one business day" (7 places plus the confirmation email) is an availability promise, which CLAUDE.md forbids. It now reads "A senior engineer reads every enquiry and replies personally." The content checker also catches business days, same day, 24/7 and "within N hours/days" phrasing.
- **CSS no longer inlined.** `experimental.inlineCss` put the whole stylesheet into every HTML page and again into the RSC payload (home was 420 KB raw). Turning it off cut home to 146 KB and service pages to 52 KB, raised mobile Lighthouse on Home from 86 to 88 and on service and contact pages to 100, and took the local load test p95 at 200 connections from 880 ms to 240 ms.
- **Single root layout.** With the Studio gone, `app/layout.tsx` and `app/not-found.tsx` sit at the top level and the catch-all route is removed. Unknown URLs now get the branded 404 as server-rendered HTML; before, the body was empty until JavaScript ran.
- **Firefox and WebKit run in CI.** On this Windows machine Firefox needs the Microsoft Visual C++ runtime (`msvcp140_1.dll`), which is a system install, so local runs use Chromium and the GitHub Actions matrix runs all three browsers on Linux.
- **Visual baselines per platform.** Font rendering differs between Windows and Linux, so baselines are stored under `tests/visual/__screenshots__/<platform>`. Linux baselines come from the CI job (run the workflow manually with "update visual" and commit the artifact). Baselines cover one page per template at 390, 768 and 1366, full page, with reduced motion so the orbit and 3D are still.
- **Test-side allowances, kept narrow.** Text inside closed `<details>`, visually hidden `.sr` headings, the off-screen skip link and horizontally scrolling rails are not treated as overflow or overlap. Hover-only chips on desktop are not treated as missing content without JavaScript. Firefox cannot emulate a coarse pointer, so touch target checks there apply up to the 1100 px touch layout.
- **Thresholds that follow CLAUDE.md.** The Privacy meta description (49 characters) comes from the prototype, so the SEO check accepts 40 characters as the minimum instead of rewriting approved copy.
- **LinkedIn is not link-checked.** LinkedIn answers 403 to every automated client. The company page URL (`/company/corevex-solution/`) was supplied by the client.
- **Dependency overrides.** `zod` is pinned to `^4.6.7` (fixes the advisory in `@vercel/oidc` through `@vercel/cli-config`, whose own latest release requires `^4.6.6`) and `basic-ftp` to `^6.2.6` (only used by the Lighthouse CI tool). `npm audit --audit-level=high` is clean; ten moderate advisories remain in dev-only lint tooling.
- **`upgrade-insecure-requests` only in production builds.** WebKit applies it to `http://localhost`, which blocked every script in the CI test server. Builds made with `TEST_MODE=true` leave it out; production keeps it, and HSTS covers the rest.
- **3D check waits for the chunk, not the canvas.** CI runners have no GPU, so the Core section correctly falls back to the static image there. The bundle test asserts that three.js is fetched only once the section is near, which is the budget rule.

## Header, booking, WhatsApp and email changes

- **Services menu.** The label links to /services/; a separate arrow button (aria-expanded, aria-controls) opens the panel. Hover opens after 120 ms and closes 250 ms after leaving, desktop with a fine pointer only. The panel sits under the header, as wide as the content container, at most min(600px, 70vh), two columns plus "View all services". The light page dim is a `body::after` layer driven by `:has()`, not a portal, so pointer leave events stay correct. The header is a server component; menu state lives in `HeaderClient.tsx`.
- **Header layout.** The menu stays next to the logo; only "Start a project" is pushed to the right edge of the content container (the prototype's `margin-left: auto` sat on the wrong element).
- **Booking window.** "Book a 30-minute call" opens a branded modal `<dialog>` with Calendly's inline embed (no widget.js), instead of Calendly's full-screen popup. The page is locked with the scrollbar width compensated, focus returns to the button on close, and a fallback link appears after 8 seconds.
- **WhatsApp button.** Bottom right on every page, number from `NEXT_PUBLIC_WHATSAPP_NUMBER` (default 923332031151), start message "Hi Corevex, can you help me with". Phones use wa.me (opens the app). Desktop tries `whatsapp://` first and opens WhatsApp Web only if the app does not take focus within 1.5 seconds.
- **Visitor emails never fail a form.** The notification to `CONTACT_TO_EMAIL` decides success. The visitor confirmation and the newsletter audience update are attempted and logged on failure. The server logs once which email settings are present (names only) and flags the resend.dev test sender.

## Portfolio boards

- **Work section replaced.** The six earlier concept studies (Fleetline, Medora, Pulse, Ledgerly, Relay, Vaultix) are retired. The Work section now holds 12 projects built from the supplied presentation boards (ClubSync AI and Haven were removed at the client's request), each still labelled "Product design study" until confirmed as client work (flip `isDesignStudy` per project in `content/case-studies.json`).
- **Filters.** A SaaS filter joins Custom Software, Full-Stack, Mobile, AI and LLM, and Automation. Mobile: Voltway, Orbit Money, Lumen, Dose, Nimbus, Aura Home. SaaS: Highstreet. AI and Automation: Northgate AP Autopilot, Apex Voice Receptionist, Brightsmile AI. Custom Software and Full-Stack: Australian Direct Tutoring, Mary Properties.
- **Boards are never cropped.** They carry their own titles and feature chips, so cards, the home rail and service features use 4:3, and the Work grid reads row by row. Where a project had two boards, the second shows under "More screens".
- **Source images** live in `new-images/portfolio/` (gitignored); `npm run images` writes 1600 and 800 wide WebP to `public/images/portfolio/` and no longer copies the old reference boards.
- **Logo strip under the hero.** Until real client logos are published in `content/client-logos.json`, the home marquee shows the portfolio projects as initials-and-name marks, headed "Selected work from our portfolio" (not "Trusted by", since they are design studies). Marks rest in a neutral grey for contrast and take each brand colour on hover; each links to its case study.
- **Contact details.** Email hello@corevex.org, phone +92 333 2031151 and the Hasilpur office address are defaults in `lib/site.ts`, shown on the Contact page and in the Organization structured data. No PSEB number, Clutch or GitHub link is shown, at the client's request; the settings still exist but stay empty.
