# Decisions

Decisions taken during the build, so the reasoning is on record.

## Stack and structure

- **Next.js 16 (App Router, Turbopack)** with React Server Components by default. `trailingSlash: true` keeps the prototype's URLs (`/about/`, `/services/ai-automation/`).
- **Two root layouts.** `app/(site)` holds the public site (header, footer, global CSS). `app/(studio)` holds the embedded Sanity Studio so none of the site CSS or JS reaches the Studio, and none of the Studio reaches the site.
- **Page markup is converted, not retyped.** `scripts/gen-pages.mjs` converts each reference page's `<main>` into JSX (`components/generated`, `components/home/sections`). This keeps copy, classes and structure identical to `/reference`. The generated files are committed and edited by hand from there.
- **Content extraction.** `scripts/gen-content.mjs` turns the 13 articles, 6 case studies, leadership bios and job openings into JSON in `/content`. Article bodies become Portable Text so the same renderer serves local content and Sanity.
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
- **Client logo strips are hidden.** The prototype's ten logos are placeholders (per its README), so showing them as "Trusted by" would be invented social proof. The strip renders automatically once real logos are added in Sanity and marked approved.
- **Testimonials and case study results** render only when real, approved entries exist in Sanity. None are seeded.
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
