# Java Home Health Care — PRD

## Original problem statement
Build India's most premium, luxurious, high-converting, SEO-optimized Home Healthcare website for Java Home Care Services (javahomecare.in, +91 9175724546, info@javahomecare.in). Luxury medical theme, glassmorphism, dark+light mode, 22 services, 11+ locations, lead capture, AI chat, blog, careers, gallery, legal pages, and full SEO.

## Architecture
- **Backend**: FastAPI + MongoDB (motor). All routes prefixed `/api`. AI chat streamed via SSE using Claude Sonnet 4.5 through `emergentintegrations`. Lead / appointment / contact / newsletter / careers persisted in Mongo and mirrored to `info@javahomecare.in` via Emergent-managed Resend.
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn components. Luxury design: Cormorant Garamond (headings), Manrope (body). Royal blue / soft teal / gold accent. Glassmorphism header with mega-menu. Sticky mobile action bar. Light + Dark modes.

## User personas
- Adult children arranging home care for elderly parents
- Post-op patients discharging from hospital
- Referring physicians recommending home care
- Job seekers (nurses / caregivers / physios)

## Core requirements (static)
1. Home / About / Services listing + 22 individual pages / Book Appointment / Contact / FAQ / Gallery / Testimonials / Blog / Careers / Legal x4
2. 11 city location pages
3. AI chat, WhatsApp + Call floating actions, sticky mobile bar
4. Newsletter, career applications, contact form → all email + DB
5. SEO: MedicalBusiness / LocalBusiness schema, OpenGraph, canonical, sitemap-ready

## Implemented (as of 2026-07-18)
- Full page hierarchy with dynamic routing for services & locations
- Multi-step appointment booking (4 steps)
- Streaming Claude Sonnet 4.5 chat widget (SSE)
- Lead + appointment + contact + newsletter + career APIs (DB + Resend email)
- Luxury glassmorphism header w/ mega-menu (services, locations)
- Floating WhatsApp + AI chat + emergency phone (desktop), sticky mobile action bar
- Testimonial carousel, 4.9★ rating widget, partner marquee
- Dark / Light theme toggle
- Legal pages (privacy / terms / refund / cancellation)
- SEO metadata + LocalBusiness/MedicalBusiness JSON-LD

## Prioritized backlog (P0/P1/P2)
- P1: Google Reviews live widget (requires Places API key)
- P1: Google Analytics 4 + Meta Pixel injection (env slots ready)
- P1: XML sitemap.xml + robots.txt (backend endpoint)
- P1: Individual blog post pages (currently listing only)
- P2: Admin dashboard to view leads (currently API only)
- P2: PWA manifest + offline
- P2: Video testimonials
- P2: Emergency banner with dismiss
- P2: Exit-intent popup

## Next tasks
- Add sitemap.xml + robots.txt generation
- Add per-location & per-service dedicated pages for all 13x9 SEO combinations
- Google Analytics + Meta Pixel snippet insertion
- Insurance partner logos + certification imagery
- DNS records advisory doc for javahomecare.in cutover (A / CNAME) while keeping Titan MX intact
