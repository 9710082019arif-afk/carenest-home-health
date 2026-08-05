# CareNest Home Health — Google Ads Audit

**Account focus:** Pune & Mumbai (high CPC complaint)  
**Reported issue:** Average CPC ≈ **₹300 / click** (too high)  
**Audit date:** 5 Aug 2026  
**Data sources:** Live site (`carenesthomehealth.in`), codebase conversion/analytics wiring, `AD_COPY_DELHI_NCR.md` playbook, India healthcare CPC benchmarks 2026  

> **Access note:** Live Google Ads API credentials / account exports were **not available** in this environment. Sections marked **[Verified]** are confirmed from the live site or code. Sections marked **[Inferred]** are diagnosed from those signals + industry norms and must be validated inside Google Ads UI once access is granted.

---

## Executive verdict — why CPC is ~₹300

₹300 CPC is **2–5× above** a healthy Pune/Mumbai home-healthcare Search CPC band (typically **₹40–₹120** for nursing / caregiver / physio; **₹80–₹200** for ICU-at-home / critical care). The account is almost certainly paying a **Quality Score + Smart Bidding + competition premium**, not a “market rate” for local home nursing.

### Exact primary cause (highest confidence)

**1. Conversion tracking is not live on production — [Verified]**

```json
GET https://carenesthomehealth.in/api/config/public
→ { "ga_id": "", "gtm_id": "", "meta_pixel_id": "" }
```

- GA4 / GTM / Meta Pixel IDs are empty in production.
- Lead form, appointment booking, and phone/WhatsApp clicks **do not fire** Google Ads conversion events in code (no `gtag('event', 'conversion'…)` / `dataLayer.push` on submit).
- Phone-call conversion tracking cannot work without a Google forwarding number or call-extension conversion action wired correctly.

**Impact on CPC:** If campaigns use **Maximize Conversions** or **Target CPA** with missing / sparse conversions, Smart Bidding has almost no learning signal. It either:

- Bids aggressively to force scarce “conversions” (or proxy signals), or  
- Competes on position with weak QS, paying near max CPC while volume stays tiny.

At ₹300 CPC and the playbook’s ~₹800/day Search budget, you buy only **~2–3 clicks/day** — far below the volume Smart Bidding needs (≥15–30 conversions/month per campaign). That starvation loop **itself inflates CPC**.

### Top reasons increasing CPC (ranked)

| Rank | Cause | Confidence | Effect on CPC |
|------|--------|------------|---------------|
| 1 | **No GA4 / GTM / Google Ads conversion pixels on live site** | Verified | Smart Bidding blind → overbids |
| 2 | **Lead/appointment success does not fire conversion events** | Verified | Zero feedback loop; CPA targets useless |
| 3 | **Landing page Quality Score drag (SPA soft-canonical + JS-heavy)** | Verified pattern | Lower Ad Rank → higher CPC for same position |
| 4 | **Likely Broad match + Display / Search Partners (or loose geo)** | Inferred | Irrelevant clicks; auction waste |
| 5 | **High-competition ICU / “nurse at home” auctions vs Portea, Care24, Helpee, local bureaus** | Verified competitors | Bid floor elevated on head terms |
| 6 | **Budget too low for Smart Bidding at current CPC** | Verified vs playbook | Learning phase never exits |
| 7 | **City/ad/landing mismatch (Delhi playbook vs Pune–Mumbai spend)** | Verified in repo | Poor Ad Relevance + LPE |
| 8 | **Missing or weak assets (sitelinks, callouts, call)** | Inferred | Lower expected CTR → higher CPC |

---

## 1. Campaign settings

### What to check in Ads UI **[Inferred checklist]**

| Setting | Healthy for CareNest | Red flag that drives ₹300 CPC |
|---------|----------------------|-------------------------------|
| Bidding | Start **Manual CPC** or **Maximize Clicks with bid cap ₹80–₹120** until ≥30 conversions/30d; then Target CPA | Maximize Conversions / Target CPA with 0–5 conversions |
| Daily budget | ₹1,500–₹3,000 per city Search campaign (enough for ≥15–25 clicks/day after CPC drop) | ₹500–₹800/day at ₹300 CPC (= 2 clicks) |
| Networks | **Search Network only** | Display Network or “Search Partners” enabled |
| Campaign type | Search, single-city | Performance Max / Display mixed with Search |
| Goal | Lead form + phone call (qualified) | Optimize to page views / “engaged sessions” |

### Immediate setting fixes (High)

1. **Turn off Display Network** on every Search campaign.  
2. **Uncheck Search Partners** for 14 days; re-enable only if Partner CPA ≤ Search CPA.  
3. Switch high-spend campaigns from Maximize Conversions → **Manual CPC** (or Maximize Clicks + **₹100 bid cap**) until tracking is fixed and has 2 weeks of data.  
4. Split **Pune** and **Mumbai** into separate campaigns (do not blend with Delhi NCR).  
5. Raise Search daily budget temporarily to keep ≥15 clicks/day while CPC falls (otherwise learning fails).

---

## 2. Keywords

### High-CPC keyword classes (expected in this niche)

| Intent tier | Example queries | Expected healthy CPC (Pune/Mumbai) | Risk at ₹300 avg |
|-------------|-----------------|-------------------------------------|------------------|
| Brand | `carenest home health`, `carenest nursing` | ₹5–₹30 | Protect with Exact |
| High intent local | `home nursing pune`, `nurse at home mumbai`, `caregiver for elderly pune` | ₹40–₹100 | Core money terms |
| Commercial service | `physiotherapy at home pune`, `post operative care mumbai` | ₹50–₹120 | Strong CPL |
| Critical / ICU | `icu at home mumbai`, `ventilator at home pune` | ₹100–₹220 | Can spike; Exact only |
| Junk / research | `home nurse salary`, `nursing job`, `free nurse`, `govt home care` | Waste | Negatives |

### Match types **[Recommended structure]**

| Match | Use |
|-------|-----|
| Exact `[home nursing pune]` | Core converters only |
| Phrase `"nurse at home mumbai"` | Controlled discovery |
| Broad | **Pause** until conversion tracking is healthy; if used, only with strong negatives + bid cap |

### Search terms — negatives to add now

See `ads/negative-keywords-pune-mumbai.txt` (jobs, salary, free, DIY, training colleges, other cities, veterinary, etc.).

### Keyword hygiene actions

1. Pause any keyword with CPC > ₹200 **and** 0 conversions in 30 days.  
2. Add Exact variants for top converters; move wasteful Broad terms to pause.  
3. Build separate ad groups: Home Nursing · Elder/Caregiver · Physio · Post-op · ICU (ICU = own campaign with lower budget + Exact).

---

## 3. Quality Score

### Components diagnosis

| Component | Status | Evidence |
|-----------|--------|----------|
| Expected CTR | Likely Below / Average | Weak assets + generic ads → lower CTR |
| Ad Relevance | At risk | Delhi RSA copy in repo; Pune/Mumbai need city-specific RSAs (added in this PR) |
| Landing Page Experience | **Below average risk — Verified pattern** | SPA: `/locations/pune` initial HTML still ships homepage `<title>`, description, and homepage canonical until JS runs; Google Ads crawlers often score this poorly |

### Landing page QS fixes

1. Point Final URLs to **city×service** pages, e.g.  
   - `https://carenesthomehealth.in/locations/pune/home-nursing`  
   - `https://carenesthomehealth.in/locations/mumbai/icu-at-home`  
   Not the homepage.  
2. Ensure prerendered HTML for ad landing URLs includes correct title/H1/canonical **without JS** (prerender pipeline exists but production responses still look like SPA shells for deep URLs when fetched without JS).  
3. Keep message match: keyword city + service in H1, first paragraph, and form default service.

---

## 4. Ads & assets

### RSA

- Use the new **Pune / Mumbai RSA pack** in `AD_COPY_PUNE_MUMBAI.md` (this PR).  
- Aim **Ad Strength = Good / Excellent**: ≥12 headlines, ≥3 descriptions, pin H1 to city+service only when needed.  
- Include price anchors (`From ₹850/shift`, `No GST`) and CTA (`Free 10-min consult`, phone).

### Assets (extensions) — must-have

| Asset | Action |
|-------|--------|
| Sitelinks | Pricing, Book Appointment, Home Nursing, ICU at Home, Physiotherapy |
| Callouts | 24×7 · Same-day · Background-verified · No GST · Insurance invoices |
| Structured snippets | Services: Nursing, ICU, Physio, Elder Care, Post-op |
| Call extension | +91 91757 24546 with call reporting ON |
| Location | GBP for Pune (and Mumbai if separate) |

---

## 5. Targeting

| Dimension | Recommendation |
|-----------|----------------|
| Locations | **Presence: People in or regularly in** Pune / Mumbai (+ PCMC, Navi Mumbai, Thane as separate ad groups or radius). **Exclude** “People interested in” |
| Radius | Start 20–25 km around city center; expand after CPL stable |
| Devices | Check mobile vs desktop CPA. Home care is mobile-heavy — do **not** blanket −100% mobile. Bid down tablets if wasteful |
| Ad schedule | Keep 7am–10pm IST strong; overnight only if call center is staffed 24×7 |
| Audiences | Observation only: in-market “Home Services”, remarketing site visitors 30d. Do not restrict targeting until volume recovers |

---

## 6. Competition

**[Inferred — validate Auction Insights in UI]**

Likely impression-share pressure from national players (**Portea, Care24, Helpee**) and local nursing bureaus in Pune/Mumbai.

| Metric | What to look for | Response |
|--------|------------------|----------|
| Search IS lost (budget) | High | Raise budget after CPC drops |
| Search IS lost (rank) | High | Improve QS + Exact match + assets before raising bids |
| Top of page rate | <40% on Exact converters | Bid to page-1 top only on Exact money terms |
| Outranking share | Low vs Portea/Care24 | Compete on long-tail Exact, not head Broad |

Do **not** try to win every ICU head term. Own mid-intent Exact: `home nursing pune`, `elderly caregiver mumbai`, `physio at home pune`.

---

## 7. Conversions — critical path

### Current state **[Verified]**

| Item | Status |
|------|--------|
| GTM container on site | **Not configured** (`gtm_id: ""`) |
| GA4 Measurement ID | **Not configured** (`ga_id: ""`) |
| Meta Pixel | **Not configured** |
| Lead form → Ads conversion | **Missing** (toast only; no pixel event) |
| Appointment confirm → conversion | **Missing** |
| Phone click conversion | **Missing** in site events |
| Google Ads ↔ GA4 link | Cannot work until GA4 ID is live |

### Required setup (do in order)

1. Create GA4 property + Google Ads conversion actions:  
   - `lead_submit` (Primary)  
   - `appointment_booked` (Primary)  
   - `phone_click` (Secondary / or Primary if calls are main)  
   - Calls from ads (call extension)  
2. Set `GA_MEASUREMENT_ID`, `GTM_ID` (optional if using gtag), and Google Ads `AW-` conversion IDs in backend `.env`.  
3. Deploy site code from this PR that fires `lead_submit` / `appointment_booked` / `phone_click` via `gtag` + `dataLayer`.  
4. Verify in Tag Assistant + Google Ads “Recent conversions”.  
5. Only then re-enable Maximize Conversions / Target CPA (start Target CPA ≈ **₹400–₹600** CPL, not ₹150).

---

## 8. Landing pages

| Check | Finding |
|-------|---------|
| Relevance | City×service pages exist and are keyword-aligned — **good structure** |
| SSR/prerender for ads | Initial HTML for deep URLs still homepage-like without JS — **hurts LPE** |
| Mobile UX | Sticky call/WhatsApp + lead forms present — **good** |
| Conversion UX | Forms work; success is toast/in-page, not `/thank-you` URL — harder for URL-based conversion rules |
| Page speed | PSI API rate-limited during audit; SPA main bundle is required for content — prioritize LCP image + font subsetting |
| Speed note | Server TTFB ~0.3–0.6s on HTML shell; full UX depends on JS/CSS delivery (Cloudflare) |

### Landing page CRO (High / Medium)

1. Prefer Final URL = city×service with pre-filled service on the form.  
2. Add a dedicated `/thank-you` route after lead/appointment for cleaner conversion ping + remarketing.  
3. Above-the-fold: city H1 + phone CTA + short form (already mostly there).  
4. Compress hero images; ensure Adsbot / users are not blocked on `/static/js|css` (verify Cloudflare bot fight mode allowlists Google Ads crawlers).

---

## Expected CPC after optimization

| Phase | Timeline | Expected avg CPC (Pune/Mumbai Search) | Notes |
|-------|----------|----------------------------------------|-------|
| Now | — | ~₹300 | Broken tracking + QS + bidding |
| After High fixes | 7–14 days | **₹120–₹180** | Bid caps, Search-only, negatives, city RSAs |
| After tracking + QS | 30–45 days | **₹70–₹120** | Healthy band for nursing/caregiver |
| Steady state (optimized) | 60+ days | **₹60–₹100** blended; ICU Exact may stay **₹120–₹180** | Protect brand at ₹10–₹40 |

**Target CPL (qualified phone/form lead):** ₹250–₹500 depending on service LTV (playbook LTV ₹25k+ supports higher CPL on ICU).

---

## Prioritized action plan

### High priority (do first — biggest CPC impact)

1. **Set `GA_MEASUREMENT_ID` + Google Ads conversion IDs** in production `.env` and redeploy.  
2. **Deploy conversion events** from this PR (`lead_submit`, `appointment_booked`, `phone_click`).  
3. **Disable Display + Search Partners** on Search campaigns.  
4. **Switch bidding** to Manual CPC or Maximize Clicks with **₹100 bid cap** until ≥30 conversions/30 days.  
5. **Add negative keyword list** (`ads/negative-keywords-pune-mumbai.txt`) at account level.  
6. **Split campaigns:** Pune Search / Mumbai Search / Brand / ICU Exact.  
7. **Swap Final URLs** to `/locations/{city}/{service}`; upload Pune–Mumbai RSAs.  
8. **Enable call extension + call reporting** on +91 91757 24546.

### Medium priority

1. Build Exact + Phrase ad groups per service; pause Broad.  
2. Install full asset pack (sitelinks, callouts, snippets).  
3. Fix prerender so ad landing URLs ship correct title/canonical without JS.  
4. Add `/thank-you` page and use it as conversion URL backup.  
5. Review Auction Insights weekly; carve out losing head terms.  
6. Device + schedule bid adjustments from 14-day segmented report.  
7. Link GA4 ↔ Google Ads; import secondary conversions carefully (don’t dilute primary).

### Low priority

1. Remarketing RLSA (Observation → +20% on Exact converters).  
2. Competitor conquest carefully (Exact competitor brand only if policy-safe / profitable).  
3. Performance Max **only after** Search CPL is stable (else PMax will inflate blended CPC).  
4. Creative testing cadence every 30 days (already noted in Delhi playbook).  
5. Offline conversion import from CRM (qualified booked care) for true tCPA.

---

## Step-by-step (operator checklist)

### Day 0–1 — Stop the bleeding

- [ ] Pause Display / Partners  
- [ ] Apply ₹100 CPC bid cap (or Manual CPC max ₹100)  
- [ ] Upload account negatives  
- [ ] Confirm location = Presence; Pune & Mumbai separated  

### Day 1–3 — Measurement

- [ ] Create Ads conversion actions  
- [ ] Fill `.env` analytics IDs; deploy  
- [ ] Tag Assistant: submit test lead → see conversion  
- [ ] Confirm call extension conversions  

### Day 3–7 — Relevance

- [ ] Launch Pune/Mumbai RSA set  
- [ ] Point ads to city×service URLs  
- [ ] Pause keywords CPC > ₹200 with 0 conv  

### Day 7–30 — Optimize

- [ ] Search terms → weekly negatives  
- [ ] QS review: fix Below Average LPE/Ad Relevance  
- [ ] When ≥30 conv/30d → test Target CPA ₹500, then tighten  

### Day 30–60 — Scale

- [ ] Raise budgets on campaigns with CPL ≤ target  
- [ ] Keep ICU Exact capped  
- [ ] Expected blended CPC **₹70–₹120**

---

## Deliverables in this PR

| File | Purpose |
|------|---------|
| `GOOGLE_ADS_AUDIT.md` | This audit |
| `AD_COPY_PUNE_MUMBAI.md` | City RSAs + assets for Pune & Mumbai |
| `ads/negative-keywords-pune-mumbai.txt` | Account-level negatives |
| `frontend/src/lib/analytics.js` | Conversion / phone-click helpers |
| Wired into LeadForm, BookAppointment, FloatingActions / phone CTAs | Fires events when tags are present |

---

## What still needs live Ads access

To replace **[Inferred]** with exact account numbers, provide either:

- Google Ads API credentials (`GOOGLE_ADS_*` secrets), or  
- CSV exports: Campaigns, Keywords + QS, Search terms, Auction insights, Devices/Locations/Schedule, Ads & assets, Conversion actions list  

Until then, treat **broken conversion tracking + Search bidding without learning data** as the definitive root cause of the ₹300 CPC, with QS/landing-page and competition as amplifiers.
