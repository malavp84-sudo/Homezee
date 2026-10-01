# Homezee - UX/UI Research

## 1. Problem Analysis
| # | User problem | Evidence / insight | Design response |
|---|---|---|---|
| 1 | Brokers charge ~1 month rent (India: 15 days to 1 month) | Brokerage is the top complaint of tenants relocating | "Zero Brokerage" owner-direct rentals, badge on every listing |
| 2 | Newcomers overpay for daily products/services | No local price reference | Price range on every card, "Fair price" hint |
| 3 | Don't know trusted doctors, shops, food, transport | Reliance on Google reviews, which are noisy and not hyperlocal | Area-first browsing, ratings, "Recommended by neighbours" |
| 4 | Daily helpers (bai, doodh wala, sabji wala, laundry wala) found only by word of mouth | No digital directory, no rates or timings | Dedicated "Daily Helpers" section with timings, rate, area, one-tap call |
| 5 | Feeling like a stranger | Missing local context and culture | "City Specialities" guide, warm welcome tone |

## 2. Personas
- **Riya, 24, IT professional, relocated to a new city.** Wants a flat with no broker, tiffin and a maid within a week. Mobile-only.
- **Sharma family, 40s, shifting neighbourhood.** Needs doctors, milk, vegetables, school transport. Prefers Hindi.
- **Ramesh, 45, sabji wala.** Low digital literacy. Needs simple, icon-led onboarding and WhatsApp/phone contact. (Provider side, phase 2.)

## 3. User Journeys
1. **Land:** pick city and area, then see a home screen of what's nearby.
2. **Find:** browse a category or search, filter by distance, rating and price.
3. **Trust:** check rating, verified badge, price, timings.
4. **Act:** one tap to Call or WhatsApp, and Save for later.

## 4. Information Architecture
Bottom tabs (max 5, thumb-reachable):
- **Home:** location switcher, search, categories, Daily Helpers, Zero-Brokerage rentals, City Specialities
- **Explore:** all categories and filterable list
- **Helpers:** daily-helper directory
- **Saved:** favourites
- **Profile:** language, settings

Detail screen: photos/icon, rating, price, timings, area, Call / WhatsApp CTA.

## 5. Design Principles
1. **Speed to contact:** any listing is at most 3 taps from a call.
2. **Glanceable trust:** rating, verified and price visible on the card.
3. **Local and warm:** friendly copy, Hindi/English, familiar categories.
4. **Low-literacy friendly:** big icons, short labels, large touch targets (min 48dp).
5. **Accessible:** contrast 4.5:1 or better, scalable text, don't rely on colour alone.

## 6. Visual System
- **Colours:** Primary Teal `#0F766E` (trust, calm), Accent Saffron `#F59E0B` (local, warm), Background `#F8FAF9`, Surface `#FFFFFF`, Text `#0F172A`, Muted `#64748B`, Success `#16A34A`.
- **Type:** system sans, sizes 12/14/16/20/26, weights 500/700.
- **Shape:** 16px card radius, 12px chips, soft shadows.
- **Spacing:** 4pt grid (4, 8, 12, 16, 24).
- **Components:** Search bar, Category tile, Listing card, Helper card, Chip, Badge, CTA button, Section header.

## 7. Services Provided to Users
1. Owner-direct rentals with zero brokerage
2. Food and tiffin
3. Doctors and clinics
4. Shops and groceries
5. Transport
6. Daily helpers: bai, doodh wala, sabji wala, laundry wala, and more
7. City specialities guide
8. Price transparency and ratings

## 8. Phase Roadmap
- **Phase 1 (MVP, in progress):** browse, search, detail, call/WhatsApp, saved, sample data.
- **Phase 2:** backend (Supabase), auth by phone OTP, provider self-signup, reviews.
- **Phase 3:** in-app chat, booking or subscription for daily helpers, maps, payments, Hindi and regional languages.

## 9. Success Metrics
Time to first contact, contacts per session, share of rentals with zero brokerage, weekly retention, provider count per area.
