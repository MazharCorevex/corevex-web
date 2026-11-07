# Corevex Solutions website

Production build of the Corevex Solutions marketing site: Next.js 16 (App Router), TypeScript, Resend, Calendly, deployed on Vercel.

## Run locally

Requirements: Node.js 20 or newer, npm.

```bash
npm install
cp .env.example .env.local   # then fill in the values you have
npm run dev                  # http://localhost:3000
```

Production build and server:

```bash
npm run build
npm run start
```

The site works without any keys: content comes from the JSON files in `/content`, forms log to the console in development, the booking button links to the contact page and analytics stay off.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build and server |
| `npm run start:test` | Production server on port 3100 with `TEST_MODE=true` (mock email) |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript |
| `npm run check` | Lint, type check and build |
| `npm run images` | Converts `/new-images/*.png` to WebP (q82 plus `-800`), copies `/reference` assets, optimises SVGs, rebuilds the size manifest |
| `npm test` | Unit tests and end-to-end journeys |
| `npm run test:unit` | Vitest and Testing Library with coverage (`test-results/coverage`) |
| `npm run test:e2e` | Playwright journeys: navigation, mobile menu, forms, booking, filters, 404, keyboard only |
| `npm run test:responsive` | Every page at 20 sizes in Chromium, Firefox and WebKit, plus zoom, text zoom, reduced motion, slow 4G, no JavaScript and the iPhone safe area. Screenshots in `test-results/responsive` |
| `npm run test:visual` | Screenshot comparison against `tests/visual/__screenshots__` (add `-- --update-snapshots` after an intended change) |
| `npm run test:a11y` | axe-core on every page, heading order, alt text, labels, focus and skip link |
| `npm run test:seo` | Titles, descriptions, canonicals, Open Graph, sitemap, robots, JSON-LD, content rules, then every link with linkinator |
| `npm run test:security` | Headers, injection, /studio, secrets in the client build, npm audit |
| `npm run test:perf` | three.js and image budgets, then Lighthouse CI mobile and desktop |
| `npm run test:load` | 200 connections for 3 minutes, a 50 request form burst and abuse inputs against a local build |
| `npm run test:all` | Everything above in order |

Playwright suites start the production server themselves (`npm run build` first). Tests never send real email: with `TEST_MODE=true` email goes to an in-memory outbox. Load tests refuse any host but localhost. On Windows, set `CHROME_PATH` to your Chrome for Lighthouse, and install the Microsoft Visual C++ runtime if you want Firefox locally.

## Structure

```
app/(site)        public pages, root layout with header and footer
app/actions.ts    server actions for contact, careers and newsletter
app/api           CV upload token
app/og            Open Graph images
components        UI, sections, interactive pieces, forms
content           site content (articles, case studies, team, jobs, testimonials, logos)
lib               content layer, SEO data, site constants, server helpers
scripts           image pipeline, generators, QA scripts
styles            design tokens, ported prototype styles, overrides
tests             Vitest (unit) and Playwright suites (e2e, responsive, visual, a11y, seo, security, perf)
```

## Content

Articles, case studies, testimonials, client logos, team and jobs live as JSON in `/content`. Edit the file, commit and push; Vercel rebuilds and every page is statically generated.

Testimonials, client logos and case study results only appear once real entries are added to their JSON files.

See `DECISIONS.md` for the reasoning behind the build and `TODO.md` for what still needs real content or keys.
