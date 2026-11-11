# Corevex Solutions website

Production rebuild of the approved static prototype in `/reference` (unzipped `Corevex-Website.zip`). Match its design, copy, images and behaviour exactly; this is a re-platform, not a redesign.

## Stack

- Next.js (App Router) + TypeScript, static generation for all marketing pages
- Styling: port `/reference/assets/css/style.css` into global tokens plus CSS Modules. Do not switch to Tailwind or change the look.
- Content: local JSON in `/content` (articles, case studies, testimonials, client logos, job openings, team). No CMS; Sanity is out of scope
- Images: `next/image`, sources from `/reference/assets/img`
- 3D: React Three Fiber for the Core scroll section (desktop only), static image fallback on mobile and reduced motion
- Forms: server actions with spam protection (honeypot + rate limit), email via Resend (notification to CONTACT_TO_EMAIL, branded confirmation to the sender, newsletter to a Resend audience)
- Booking: every "Book a 30-minute call" button opens the Calendly popup from NEXT_PUBLIC_CALENDLY_URL, brand colour #48AC9F
- Analytics: GA4 or Plausible with scroll depth, CTA clicks and form step events
- Hosting: Vercel, deployed from the GitHub repo, preview deploys per branch

## Pages

Home · Services hub · 8 service pages (custom-software-development, full-stack-development, mobile-app-development, saas-app-development, ai-llm-development, ai-automation, ai-agents-as-a-service, code-rescue) · Work index + case study template · AI Lab · About · Careers · Insights index + article template · Contact · FAQ · Privacy · Terms · 404

Keep the existing URLs (without `index.html`), titles, meta descriptions and JSON-LD from `/reference`.

## Key components

Header with mega menu and mobile drawer · Hero with 3D mark, orbit of 7 service chips and circular core preview · Services bento · Code Rescue band with animated health check · Pinned Core section · Numbers band · Work rail · Tech stack explorer (Frontend, Backend, Mobile, AI and LLM, Automation) · Process steps · Industries accordion · Trust cards · Insights block · Contact finale form · Dark footer with newsletter card

## Design tokens

- Colors: navy #262B47, teal #48AC9F, teal deep #2E8579, teal glow #8CD9D3, midnight #012A54, ink #0D1022, mist #F6F7F9, line #E3E6EC
- Fonts: Montserrat 600 (headings), Inter (body, hero display 700), JetBrains Mono (small labels)
- Light-first: white and mist sections, navy only for hero art accents, one feature band per page, contact finale and footer
- Motion: reveal on scroll, photo fade and parallax, tile tilt, button sweep; all disabled under prefers-reduced-motion

## Content rules

- The call is 30 minutes: use "Book a 30-minute call" everywhere, never 20

- Never use em dashes anywhere in copy
- No prices, rates, timelines or availability promises on the site
- No "free audit" or free blueprint offers
- Design-study projects are labelled "Product design study", never presented as client work
- Hide any block that has no real data yet (testimonials, case study results); never ship [bracket] placeholder text
- Code comments: short human labels only (section names), no long explanations

## Facts

Corevex Solutions, PSEB registered, founded 2022, 50+ engineers and specialists. Leadership: Mazhar H (CEO and Founder), M Azhar (Co-founder and Solution Architect), Zafar H (Chief Operating Officer). Stack: TypeScript, JavaScript, React, Next.js, Angular, Node.js, .NET, Python, React Native, Flutter, LLM and AI; automation with n8n, Make, GoHighLevel.

## Open items

- Contact details are set (hello@corevex.org, +92 333 2031151, Sikandar Plaza, Canal Road, Hasilpur, Bahawalpur); no PSEB number, Clutch or GitHub links are shown
- Real client logos, leadership headshots, team and office photos
- Final domain (Resend domain verification and Vercel domain)
