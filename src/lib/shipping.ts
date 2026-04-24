/**
 * Carrier rate engine
 * --------------------
 * SFL Nepal and DSV do not expose public self-serve REST APIs for tariff
 * lookups — both are contract carriers that issue per-account credentials.
 *
 * This module computes transparent ESTIMATES from published baseline tariffs
 * (chargeable weight × zone factor × carrier multiplier + fuel surcharge).
 * The `quote()` function is the single integration point: the day you receive
 * real DSV / SFL API credentials, replace the body of `quoteFromCarrierApi()`
 * with the live REST call and the rest of the UI keeps working.
 */

export type CarrierId = "sfl" | "dsv";
export type ServiceLevel = "economy" | "express" | "priority";

export interface Carrier {
  id: CarrierId;
  name: string;
  fullName: string;
  tagline: string;
  trackingUrl: string;
  website: string;
  /** Carrier-wide multiplier vs. baseline (per kg, USD) */
  base: number;
  /** Fuel + security surcharge (% of subtotal) */
  surchargePct: number;
  /** Service catalogue */
  services: { id: ServiceLevel; label: string; speedFactor: number; speedDays: [number, number] }[];
  accent: string; // hsl tokens reference
}

export const CARRIERS: Carrier[] = [
  {
    id: "sfl",
    name: "SFL Nepal",
    fullName: "Speedway Fastrack Logistics",
    tagline: "Nepal's largest international courier · Door-to-door across 220+ countries",
    trackingUrl: "https://sflnepal.com/track-shipment/",
    website: "https://sflnepal.com/",
    base: 8.5,
    surchargePct: 14,
    services: [
      { id: "economy", label: "SFL Economy", speedFactor: 0.78, speedDays: [7, 12] },
      { id: "express", label: "SFL Express", speedFactor: 1.0, speedDays: [4, 6] },
      { id: "priority", label: "SFL Priority", speedFactor: 1.35, speedDays: [2, 3] },
    ],
    accent: "220 100% 65%",
  },
  {
    id: "dsv",
    name: "DSV",
    fullName: "DSV Global Transport & Logistics",
    tagline: "Global freight forwarder · Air, sea & road across 80+ countries",
    trackingUrl: "https://www.dsv.com/en/our-solutions/track-and-trace",
    website: "https://www.dsv.com/",
    base: 9.2,
    surchargePct: 11,
    services: [
      { id: "economy", label: "DSV Road / Sea-Air", speedFactor: 0.7, speedDays: [9, 16] },
      { id: "express", label: "DSV Air Express", speedFactor: 1.05, speedDays: [3, 5] },
      { id: "priority", label: "DSV Priority Air", speedFactor: 1.4, speedDays: [2, 3] },
    ],
    accent: "0 0% 95%",
  },
];

/* --------------------------------------------------------------- */
/* Destinations                                                     */
/* --------------------------------------------------------------- */
export type ZoneId = "saarc" | "asia" | "mena" | "europe" | "americas" | "oceania";

export interface Country {
  iso3: string;
  name: string;
  zone: ZoneId;
}

export const ZONES: Record<ZoneId, { label: string; factor: number }> = {
  saarc:    { label: "SAARC",            factor: 0.55 },
  asia:     { label: "Asia & Far East",  factor: 1.0  },
  mena:     { label: "Middle East / Africa", factor: 1.15 },
  europe:   { label: "Europe & UK",      factor: 1.4  },
  americas: { label: "Americas",         factor: 1.65 },
  oceania:  { label: "Oceania",          factor: 1.55 },
};

export const COUNTRIES: Country[] = [
  { iso3: "IND", name: "India",          zone: "saarc" },
  { iso3: "BGD", name: "Bangladesh",     zone: "saarc" },
  { iso3: "PAK", name: "Pakistan",       zone: "saarc" },
  { iso3: "LKA", name: "Sri Lanka",      zone: "saarc" },
  { iso3: "BTN", name: "Bhutan",         zone: "saarc" },

  { iso3: "CHN", name: "China",          zone: "asia" },
  { iso3: "JPN", name: "Japan",          zone: "asia" },
  { iso3: "KOR", name: "South Korea",    zone: "asia" },
  { iso3: "SGP", name: "Singapore",      zone: "asia" },
  { iso3: "MYS", name: "Malaysia",       zone: "asia" },
  { iso3: "THA", name: "Thailand",       zone: "asia" },
  { iso3: "VNM", name: "Vietnam",        zone: "asia" },
  { iso3: "IDN", name: "Indonesia",      zone: "asia" },
  { iso3: "PHL", name: "Philippines",    zone: "asia" },
  { iso3: "HKG", name: "Hong Kong",      zone: "asia" },
  { iso3: "TWN", name: "Taiwan",         zone: "asia" },

  { iso3: "ARE", name: "UAE",            zone: "mena" },
  { iso3: "SAU", name: "Saudi Arabia",   zone: "mena" },
  { iso3: "QAT", name: "Qatar",          zone: "mena" },
  { iso3: "KWT", name: "Kuwait",         zone: "mena" },
  { iso3: "OMN", name: "Oman",           zone: "mena" },
  { iso3: "ZAF", name: "South Africa",   zone: "mena" },
  { iso3: "EGY", name: "Egypt",          zone: "mena" },
  { iso3: "TUR", name: "Türkiye",        zone: "mena" },

  { iso3: "GBR", name: "United Kingdom", zone: "europe" },
  { iso3: "DEU", name: "Germany",        zone: "europe" },
  { iso3: "FRA", name: "France",         zone: "europe" },
  { iso3: "NLD", name: "Netherlands",    zone: "europe" },
  { iso3: "ITA", name: "Italy",          zone: "europe" },
  { iso3: "ESP", name: "Spain",          zone: "europe" },
  { iso3: "CHE", name: "Switzerland",    zone: "europe" },
  { iso3: "SWE", name: "Sweden",         zone: "europe" },
  { iso3: "NOR", name: "Norway",         zone: "europe" },
  { iso3: "DNK", name: "Denmark",        zone: "europe" },
  { iso3: "POL", name: "Poland",         zone: "europe" },
  { iso3: "IRL", name: "Ireland",        zone: "europe" },

  { iso3: "USA", name: "United States",  zone: "americas" },
  { iso3: "CAN", name: "Canada",         zone: "americas" },
  { iso3: "MEX", name: "Mexico",         zone: "americas" },
  { iso3: "BRA", name: "Brazil",         zone: "americas" },
  { iso3: "ARG", name: "Argentina",      zone: "americas" },
  { iso3: "CHL", name: "Chile",          zone: "americas" },

  { iso3: "AUS", name: "Australia",      zone: "oceania" },
  { iso3: "NZL", name: "New Zealand",    zone: "oceania" },
];

export const COUNTRY_BY_ISO: Record<string, Country> =
  Object.fromEntries(COUNTRIES.map(c => [c.iso3, c]));

/* --------------------------------------------------------------- */
/* Quote engine                                                     */
/* --------------------------------------------------------------- */
export interface QuoteRequest {
  fromIso: "NPL";
  toIso: string;     // ISO3
  weightKg: number;
  dimsCm?: { l: number; w: number; h: number };
  declaredValueUSD?: number;
}

export interface QuoteOption {
  carrierId: CarrierId;
  service: ServiceLevel;
  serviceLabel: string;
  etaDays: [number, number];
  totalUSD: number;
  baseUSD: number;
  surchargeUSD: number;
  chargeableKg: number;
  source: "estimate" | "live";
}

const dimWeight = (d?: QuoteRequest["dimsCm"]) =>
  d ? (d.l * d.w * d.h) / 5000 : 0;

export const quote = (carrier: Carrier, req: QuoteRequest): QuoteOption[] => {
  const country = COUNTRY_BY_ISO[req.toIso];
  if (!country) return [];
  const zone = ZONES[country.zone];
  const chargeable = Math.max(req.weightKg, dimWeight(req.dimsCm));

  return carrier.services.map(svc => {
    const base = chargeable * carrier.base * zone.factor * svc.speedFactor;
    // Light minimum (first 0.5 kg) handling fee
    const handling = 6 + (chargeable < 0.5 ? 4 : 0);
    const subtotal = base + handling;
    const surcharge = subtotal * (carrier.surchargePct / 100);
    const total = subtotal + surcharge;
    return {
      carrierId: carrier.id,
      service: svc.id,
      serviceLabel: svc.label,
      etaDays: svc.speedDays,
      totalUSD: Math.round(total * 100) / 100,
      baseUSD: Math.round(subtotal * 100) / 100,
      surchargeUSD: Math.round(surcharge * 100) / 100,
      chargeableKg: Math.round(chargeable * 100) / 100,
      source: "estimate",
    };
  });
};

export const quoteAll = (req: QuoteRequest): QuoteOption[] =>
  CARRIERS.flatMap(c => quote(c, req));

/* --------------------------------------------------------------- */
/* (placeholder) live carrier API call                              */
/* --------------------------------------------------------------- */
/**
 * Once you obtain DSV developer.dsv.com OAuth credentials
 * or SFL Nepal API credentials, swap this implementation:
 *
 * export const quoteFromCarrierApi = async (
 *   carrier: CarrierId, req: QuoteRequest
 * ): Promise<QuoteOption[]> => {
 *   const res = await fetch(`/api/shipping/${carrier}/quote`, {
 *     method: "POST", body: JSON.stringify(req),
 *   });
 *   return (await res.json()).options as QuoteOption[];
 * };
 *
 * Today, `quote()` returns transparent estimates so the UI stays useful.
 */
