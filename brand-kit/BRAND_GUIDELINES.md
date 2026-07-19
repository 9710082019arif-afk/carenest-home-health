# CareNest Home Health — Brand Guidelines

*Version 1 · Generated 2026-07-19*

This kit is **original, high-resolution and commercial-use safe**. Everything here is either an original vector we designed or generated for this brand. No stock photography.

---

## 1. Logo

**Primary mark** — a protective *nest* of teal → royal-blue → gold arcs cradling a medical cross. The nest speaks to home / family / safety; the cross speaks to skilled medical care.

Files (in `/logo/`):

| File | Use |
|---|---|
| `logo-icon-2048.png` | Master — always downsize from here |
| `logo-icon-{512,256,192,96,48}.png` | Web, product, in-app avatars |
| `logo-icon-transparent-{2048,1024,512}.png` | Placement on photos / dark backgrounds |
| `logo-icon-transparent.svg` | Infinite-scale vector (preferred for print) |
| `logo-wordmark-{2400,1200,640}.png` | Header / letterhead / email signature |

### Clear space
Minimum clear space around the logo = **the height of the medical cross** in the mark. Nothing else may appear in that safe zone.

### Minimum size
On screen: **32 px** for the icon mark, **160 px wide** for the wordmark.
In print: **10 mm** for the icon mark, **35 mm wide** for the wordmark.

### Don't
- ❌ Stretch or squish
- ❌ Rotate more than 0°
- ❌ Change colours arbitrarily
- ❌ Place on busy backgrounds (use the transparent-icon variant + tinted overlay if you must)

---

## 2. Favicon

Files (in `/favicon/`):

| File | Use |
|---|---|
| `favicon.ico` (multi-size 16/32/48/64) | Browser tab, bookmarks |
| `apple-touch-icon.png` (180×180) | iOS home-screen icon |
| `favicon-{16,32,48,64}.png` | Explicit sizes if needed |

Already wired into `/app/frontend/public/`.

---

## 3. Colour system

Six-tone palette (`/colour-palette.png` shows all swatches):

| Role | Colour | HEX | RGB |
|---|---|---|---|
| **Primary** | Royal Blue | `#0D3B66` | 13, 59, 102 |
| **Secondary (deep)** | Deep Teal | `#0F766E` | 15, 118, 110 |
| **Secondary (bright)** | Soft Teal | `#20B2AA` | 32, 178, 170 |
| **Accent** | Gold | `#D4AF37` | 212, 175, 55 |
| **Background** | Cream | `#FAFAFA` | 250, 250, 250 |
| **Body / muted** | Slate | `#64748B` | 100, 116, 139 |

### Rules of thumb
- **Royal Blue** — for headings, headers, footers, primary CTA on secondary surfaces.
- **Gold** — for the primary CTA button, dividers, key accents. Never over 10% of a surface.
- **Teals** — for icons, badges, illustrations, checkmarks.
- **Cream** — 60-70 % of the page background.
- **Slate** — body text at 70–80% opacity of `#0D3B66` on cream, or `#64748B` directly.

### Accessibility
All primary-on-cream and gold-on-royal combinations tested at **WCAG AA** contrast.

---

## 4. Typography

| Family | Weight | Use |
|---|---|---|
| **Cormorant Garamond** (serif) | 400 / 500 / 600 | Headings, hero, editorial pull-quotes |
| **Manrope** (sans) | 400 / 500 / 600 / 700 | Body text, UI, buttons, captions |

Both are free Google Fonts — already preloaded on the site.

### Type scale
- H1 · text-4xl / text-5xl / text-6xl (mobile → desktop)
- H2 · text-3xl → text-4xl
- H3 · text-2xl → text-3xl
- Body · text-base (mobile: text-sm)
- Small / caption · text-xs

---

## 5. Photography

10 AI-generated originals — all Indian settings, culturally authentic, warm editorial style.

**Website categories** (`/images/`):
| File | Use case |
|---|---|
| `nursing-care.jpg` | Home Nursing, 24×7 Nursing service pages |
| `elder-care.jpg` | Elder Care pages, senior-parent audience |
| `icu-at-home.jpg` | ICU-at-Home service page |
| `physiotherapy.jpg` | Physiotherapy service page, stroke-rehab |
| `patient-care.jpg` | Bedridden care, post-operative pages |
| `doctor-visit.jpg` | Doctor-at-Home service page |
| `medical-equipment.jpg` | Equipment Rental service page |
| `home-care.jpg` | General home-care listing, home-page hero secondary |

**Marketing** (`/social/`):
| File | Use case |
|---|---|
| `hero-banner.jpg` | Homepage hero, landing page banner |
| `gbp-cover.jpg` | Google Business Profile cover, Facebook cover |

### Editing rules
- Never distort or heavily filter these — they're brand-consistent as delivered.
- Crop, don't warp.
- If overlaying text: apply a **soft dark gradient** (0.35 opacity, top or bottom) before text.

---

## 6. Icons

The website uses **lucide-react** icons (5000+ open-source, MIT-licensed). Set:
- Stroke width: **1.6px** for hero areas, **2px** for UI.
- Colour: Match text colour, or use the Teal palette for standalone icons.

No custom icon set is needed. Adding new ones takes 5 seconds.

---

## 7. Social / Google Business Profile

**Profile image**: use `/logo/logo-icon-1024.png` — Google will crop to a circle around the rounded-square, which frames the mark nicely.

**Cover image**: use `/social/gbp-cover.jpg` (already 1600×900 approx — Google accepts up to 1200×628 minimum).

**Instagram / Facebook / LinkedIn profile**: same profile logo. For posts, hero banner (`/social/hero-banner.jpg`) works as a starting template — add overlaid gold-serif copy for campaign use.

---

## 8. Commercial-use terms

- Logo, favicon, colour system → **owned by CareNest Home Health.** Free to use in any commercial context (ads, print, invoices, uniforms, hoardings).
- Photographs → generated with the **Emergent Universal LLM Key** (Gemini Nano Banana model). Per the platform's TOS, generated outputs are yours to use commercially. No attribution required.
- Icons → **lucide-react** under MIT license. No attribution required.
- Fonts → **Google Fonts (SIL Open Font License)** — free for commercial use, no attribution required.

---

## 9. What's already applied to the live site

- ✅ Logo (SVG icon) — header, footer, favicon, `apple-touch-icon`
- ✅ Colour system — in Tailwind theme + CSS variables (dark + light modes)
- ✅ Typography — loaded from Google Fonts
- ✅ Icons — lucide-react throughout

## 10. What still needs to be wired to the site (optional, next iteration)

- 🟡 Replace the Unsplash stock imagery in `/app/frontend/src/data/content.js` (`IMAGES` block + `TEAM` object) with the new AI-generated images so all service pages show CareNest brand imagery, not stock.
- 🟡 Update the OG / Twitter card images to `/social/hero-banner.jpg`.
- 🟡 Upload GBP profile + cover on Google Business Profile.

If you want, I can wire all of these in one pass — takes ~5 minutes.

---

## 11. File organisation

```
brand-kit/
├── logo/
│   ├── logo-icon-{48,96,192,256,512,1024,2048}.png
│   ├── logo-icon-transparent-{512,1024,2048}.png
│   ├── logo-icon-transparent.svg
│   └── logo-wordmark-{640,1200,2400}.png
├── favicon/
│   ├── favicon.ico
│   ├── favicon-{16,32,48,64}.png
│   └── apple-touch-icon.png
├── images/                     ← service page photography
│   ├── nursing-care.jpg
│   ├── elder-care.jpg
│   ├── icu-at-home.jpg
│   ├── physiotherapy.jpg
│   ├── patient-care.jpg
│   ├── doctor-visit.jpg
│   ├── medical-equipment.jpg
│   └── home-care.jpg
├── social/                     ← marketing surfaces
│   ├── hero-banner.jpg
│   └── gbp-cover.jpg
├── colour-palette.png
└── BRAND_GUIDELINES.md         ← this file
```

**Total size: ~8.5 MB**  ·  All web-optimised and print-usable.
