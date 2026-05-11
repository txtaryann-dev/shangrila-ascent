# Advanced Feature Build Plan

This is a sizable scope (5 feature areas, ~12 sub-features). I'll group it into phases so you can approve all of it, or tell me to start with a subset.

## Phase 1 — Smart Logistics Engine
- **Live countdown**: Replace the static "Order in 2h 14m" copy in `LocalLogistics.tsx` with a real `useEffect` countdown to the daily Kathmandu cutoff (e.g., 4:00 PM NPT). Updates every second; switches messaging to "Next-day dispatch" once cutoff passes.
- **Interactive hub selector**: Upgrade hub buttons into a stylized SVG map of Nepal with clickable pins (KTM, PKR, BWA, BIR). Selection updates the live panel + writes selected hub to a new `LogisticsContext` so cart/checkout can read shipping cost & ETA.

## Phase 2 — High-Conversion Checkout
- **EMI calculator**: New `EMICalculator.tsx` mounted inside `ProductChapter` for Aurora Pro & Featherbook. Slider for tenure (3/6/9/12 mo), toggle for Khalti/eSewa "0% interest" promo vs. bank EMI (13.99% APR). Shows monthly figure + total payable.
- **Frequently Bought Together**: New `BundleUpsell.tsx` with 2–3 curated accessories per hero product (MagSafe, Leather Case, AppleCare-style protection). Checkboxes update a live subtotal; "Add bundle" pushes all selected items to `CartProvider` via `addMany`.

## Phase 3 — Wholesale B2B Portal
- **Bulk inventory matrix**: Refactor `Wholesale.tsx` into a quantity grid (rows = SKUs, columns = qty input + tier badge + line total). Tier logic: 1–9 list, 10–49 −5%, 50–199 −15%, 200+ −22%. Tier highlights in real time.
- **Quote generator**: "Export Quote" button → generates a branded PDF (using `jspdf` + `jspdf-autotable`) and CSV with line items, tier discounts, subtotal, VAT, grand total, and a quote ID + 14-day validity.

## Phase 4 — International Freight
- **SFL vs DSV comparison**: New `FreightCompare.tsx` inside `ShipWorldwide`. Inputs: weight (kg), destination (dropdown of 8 regions). Output: side-by-side cards showing SFL Express, SFL Economy, DSV Air, DSV Sea — price (NPR + USD via `CurrencyProvider`), transit days, CO₂ estimate. Pricing model lives in `src/lib/freight.ts` (rate tables per region/lane).

## Phase 5 — Immersive UI
- **3D exploded view**: Extend `AuroraPhone3D.tsx` with an `exploded` prop. Add separate meshes for chip (A18), battery, camera module, mainboard. A slider in `Product3DViewer` animates Z-offsets via `useFrame` lerp (respects reduced-motion → instant snap).
- **Magnetic header**: Upgrade `TopNav.tsx` to track `scrollY` velocity (via `useMotionValue` + `useVelocity`). Header height + backdrop-blur + background opacity interpolate with scroll velocity; snaps back when idle.
- **Haptic-feel buttons**: Add a new `magnetic` variant to `button.tsx` with scale 0.97 active + spring-back, plus subtle shadow pulse. Apply to primary CTAs across hero, product, wholesale, checkout.

## Technical notes
- New context: `LogisticsContext` (selected hub, ETA, shipping cost) consumed by Cart + Checkout.
- New deps: `jspdf`, `jspdf-autotable` (PDF quote). No backend needed — all client-side.
- Reduced-motion: every new animation gates on the existing `useReducedMotion` hook.
- Light/dark theme tokens preserved; no hardcoded colors.
- No Lovable Cloud needed for any of this (pure frontend).

## Suggested order
Phase 1 → 2 → 5 (visible polish) → 3 → 4. Each phase is ~1 implementation pass.

**Want me to build all 5 phases now, or start with a specific subset (e.g., Phase 1 + 2 first)?**
