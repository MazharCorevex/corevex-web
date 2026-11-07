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
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript |
| `npm run check` | Lint, type check and build |
| `npm run test:e2e` | Playwright: every page at 390, 768, 1366 and 1920 px, overflow at 360 to 1920 px and landscape, console errors, interactions, links and images |
| `npm run lhci` | Lighthouse CI (mobile) on Home, a service page, an article and Contact |
| `npm run qa:content` | Checks rendered pages for em dashes, prices, bracket placeholders, free offers and 20-minute wording (needs a running server on port 3100) |
| `npm run qa:js` | First-load JavaScript per page, gzipped (needs a running server on port 3100) |
| `npm run analyze` | Webpack build with the bundle analyzer |
| `npm run images` | Converts `/new-images/*.png` to WebP (q82 plus `-800`), copies `/reference` assets, optimises SVGs, rebuilds the size manifest |

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
tests             Playwright
```

## Content

Articles, case studies, testimonials, client logos, team and jobs live as JSON in `/content`. Edit the file, commit and push; Vercel rebuilds and every page is statically generated.

Testimonials, client logos and case study results only appear once real entries are added to their JSON files.

See `DECISIONS.md` for the reasoning behind the build and `TODO.md` for what still needs real content or keys.
