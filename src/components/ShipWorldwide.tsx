import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { ExternalLink, Package, Truck, Plane, Ship, Search, Sparkles } from "lucide-react";
import {
  CARRIERS,
  COUNTRIES,
  COUNTRY_BY_ISO,
  ZONES,
  quote,
  type Carrier,
  type QuoteOption,
} from "@/lib/shipping";
import { useCurrency } from "./CurrencyProvider";

const NPR_PER_USD = 133.5;
const WORLD_TOPO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const SERVED_ISO = new Set(COUNTRIES.map(c => c.iso3));

const ZONE_COLOR: Record<string, string> = {
  saarc: "hsl(160 80% 55% / 0.85)",
  asia: "hsl(200 95% 60% / 0.85)",
  mena: "hsl(35 95% 60% / 0.85)",
  europe: "hsl(265 90% 70% / 0.85)",
  americas: "hsl(220 100% 65% / 0.85)",
  oceania: "hsl(320 85% 65% / 0.85)",
};

const carrierIcon = (id: string) =>
  id === "sfl" ? <Plane className="h-3.5 w-3.5" /> : <Ship className="h-3.5 w-3.5" />;

export const ShipWorldwide = () => {
  const { currency } = useCurrency();
  const [iso, setIso] = useState("USA");
  const [weight, setWeight] = useState(2);
  const [hovered, setHovered] = useState<{ name: string; iso?: string } | null>(null);

  const country = COUNTRY_BY_ISO[iso];
  const zone = country ? ZONES[country.zone] : null;

  const quotesByCarrier = useMemo(() => {
    const out: Record<string, QuoteOption[]> = {};
    CARRIERS.forEach(c => {
      out[c.id] = quote(c, { fromIso: "NPL", toIso: iso, weightKg: weight });
    });
    return out;
  }, [iso, weight]);

  const cheapest = useMemo(() => {
    const all = Object.values(quotesByCarrier).flat();
    if (!all.length) return null;
    return all.reduce((a, b) => (a.totalUSD < b.totalUSD ? a : b));
  }, [quotesByCarrier]);

  const fmt = (usd: number) =>
    currency === "USD"
      ? `$${usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
      : `Rs ${Math.round(usd * NPR_PER_USD).toLocaleString("en-IN")}`;

  return (
    <section id="ch-worldwide" className="relative min-h-screen px-6 lg:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              06 · Ship Worldwide
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              From Kathmandu, <span className="text-gradient">to anywhere.</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Door-to-door international delivery via SFL Nepal & DSV — air, sea, and road
              freight to 220+ countries. Compare rates side-by-side.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {CARRIERS.map(c => (
              <a
                key={c.id}
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                className="glass squircle elastic flex items-center gap-3 px-4 py-2.5 text-xs"
              >
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold"
                  style={{ background: `hsl(${c.accent} / 0.18)`, color: `hsl(${c.accent})` }}
                >
                  {c.id.toUpperCase()}
                </span>
                <span className="text-foreground font-medium">{c.name}</span>
                <ExternalLink className="h-3 w-3 opacity-60 ml-auto" />
              </a>
            ))}
          </div>
        </div>

        {/* Map + Form */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mb-8">
          {/* Map */}
          <div className="glass-strong squircle p-4 relative overflow-hidden">
            <div className="aspect-[2/1.05] w-full">
              <ComposableMap
                projectionConfig={{ scale: 145 }}
                width={900}
                height={460}
                style={{ width: "100%", height: "100%" }}
              >
                <Geographies geography={WORLD_TOPO}>
                  {({ geographies }: { geographies: Array<{ rsmKey: string; id: string; properties: { name: string } }> }) =>
                    geographies.map(geo => {
                      const code = isoNumericToAlpha3[String(geo.id).padStart(3, "0")];
                      const country = code ? COUNTRY_BY_ISO[code] : undefined;
                      const served = country !== undefined;
                      const isSelected = code === iso;
                      const fill = served
                        ? isSelected
                          ? "hsl(var(--accent-glow))"
                          : ZONE_COLOR[country.zone]
                        : "hsl(var(--muted) / 0.45)";
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke="hsl(var(--background))"
                          strokeWidth={0.4}
                          onClick={() => served && code && setIso(code)}
                          onMouseEnter={() =>
                            setHovered({ name: geo.properties.name, iso: code })
                          }
                          onMouseLeave={() => setHovered(null)}
                          style={{
                            default: { outline: "none", cursor: served ? "pointer" : "default" },
                            hover: {
                              outline: "none",
                              fill: served ? "hsl(var(--accent-glow))" : "hsl(var(--muted) / 0.6)",
                              transition: "fill 0.2s",
                            },
                            pressed: { outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>

            {/* Hover label */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 left-4 glass squircle px-3 py-2 text-xs"
                >
                  <div className="font-medium">{hovered.name}</div>
                  {hovered.iso && SERVED_ISO.has(hovered.iso) ? (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {ZONES[COUNTRY_BY_ISO[hovered.iso].zone].label} · click to quote
                    </div>
                  ) : (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Contact sales for routing
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zone legend */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {Object.entries(ZONES).map(([id, z]) => (
                <div
                  key={id}
                  className="glass squircle px-2.5 py-1 text-[10px] flex items-center gap-1.5"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: ZONE_COLOR[id] }}
                  />
                  {z.label}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="glass-strong squircle p-6 flex flex-col gap-5">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Destination
              </label>
              <select
                value={iso}
                onChange={(e) => setIso(e.target.value)}
                className="mt-2 w-full bg-transparent border border-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-foreground/40"
              >
                {[...COUNTRIES]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(c => (
                    <option key={c.iso3} value={c.iso3} className="bg-background">
                      {c.name} · {ZONES[c.zone].label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Chargeable weight
                </label>
                <span className="text-sm tabular-nums font-medium">{weight.toFixed(1)} kg</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={50}
                step={0.5}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="mt-3 w-full accent-foreground"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0.5 kg</span><span>10 kg</span><span>25 kg</span><span>50 kg</span>
              </div>
            </div>

            <div className="rounded-xl bg-foreground/5 p-3 text-[11px] text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-1.5 text-foreground font-medium mb-1">
                <Sparkles className="h-3 w-3" /> About these rates
              </div>
              Estimates from published baseline tariffs for {country?.name ?? "destination"}.
              Final rates from your SFL / DSV account may vary by contract,
              fuel surcharge, and dimensional weight.
            </div>

            {cheapest && (
              <div className="rounded-xl border border-[hsl(var(--accent-glow)/0.4)] bg-[hsl(var(--accent-glow)/0.08)] p-3">
                <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--accent-glow))]">
                  Best value
                </div>
                <div className="text-sm font-medium mt-1">
                  {CARRIERS.find(c => c.id === cheapest.carrierId)?.name} · {cheapest.serviceLabel}
                </div>
                <div className="text-2xl font-bold mt-1 tabular-nums">{fmt(cheapest.totalUSD)}</div>
                <div className="text-[11px] text-muted-foreground">
                  {cheapest.etaDays[0]}–{cheapest.etaDays[1]} business days
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Carrier comparison */}
        <div className="grid md:grid-cols-2 gap-5">
          {CARRIERS.map(carrier => (
            <CarrierCard
              key={carrier.id}
              carrier={carrier}
              quotes={quotesByCarrier[carrier.id] ?? []}
              cheapestId={cheapest?.carrierId === carrier.id ? cheapest.service : null}
              fmt={fmt}
              countryName={country?.name ?? ""}
            />
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground mt-6 max-w-3xl">
          For freight, hazardous goods, or volumetric shipments above 50 kg, request a custom quote
          directly from each carrier. Tracking via{" "}
          <a href={CARRIERS[0].trackingUrl} className="text-foreground hover:underline" target="_blank" rel="noopener noreferrer">
            sflnepal.com
          </a>{" "}
          and{" "}
          <a href={CARRIERS[1].trackingUrl} className="text-foreground hover:underline" target="_blank" rel="noopener noreferrer">
            dsv.com
          </a>.
        </p>
      </div>
    </section>
  );
};

/* ---------------- Carrier card ---------------- */
interface CardProps {
  carrier: Carrier;
  quotes: QuoteOption[];
  cheapestId: string | null;
  fmt: (usd: number) => string;
  countryName: string;
}
const CarrierCard = ({ carrier, quotes, cheapestId, fmt, countryName }: CardProps) => (
  <div className="glass-strong squircle p-5 flex flex-col">
    <div className="flex items-start justify-between mb-1">
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-2xl text-xs font-bold"
          style={{
            background: `hsl(${carrier.accent} / 0.16)`,
            color: `hsl(${carrier.accent})`,
            boxShadow: `inset 0 0 0 1px hsl(${carrier.accent} / 0.25)`,
          }}
        >
          {carrier.id.toUpperCase()}
        </span>
        <div>
          <div className="font-semibold">{carrier.name}</div>
          <div className="text-[11px] text-muted-foreground">{carrier.fullName}</div>
        </div>
      </div>
      <a
        href={carrier.trackingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
      >
        Track <ExternalLink className="h-3 w-3" />
      </a>
    </div>
    <p className="text-[11px] text-muted-foreground mb-4">{carrier.tagline}</p>

    <div className="space-y-2">
      {quotes.map(q => {
        const isBest = q.service === cheapestId;
        return (
          <div
            key={q.service}
            className={`rounded-xl p-3 flex items-center justify-between gap-3 transition ${
              isBest
                ? "border border-[hsl(var(--accent-glow)/0.5)] bg-[hsl(var(--accent-glow)/0.08)]"
                : "border border-border/50 bg-foreground/[0.02]"
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium flex items-center gap-2">
                {carrierIcon(carrier.id)}
                {q.serviceLabel}
                {isBest && (
                  <span className="text-[9px] uppercase tracking-wider text-[hsl(var(--accent-glow))]">
                    best value
                  </span>
                )}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {q.etaDays[0]}–{q.etaDays[1]} business days · to {countryName || "—"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold tabular-nums">{fmt(q.totalUSD)}</div>
              <div className="text-[10px] text-muted-foreground">
                incl. {Math.round((q.surchargeUSD / q.baseUSD) * 100)}% fuel
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Package className="h-3 w-3" /> Estimate
      </div>
      <a
        href={carrier.website}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground flex items-center gap-1"
      >
        Open {carrier.name} <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  </div>
);

/* ---------------- ISO numeric → alpha-3 (only the codes we serve + a few neighbours) ---------------- */
/* Source: ISO 3166-1. world-atlas geographies use numeric codes. */
const isoNumericToAlpha3: Record<string, string> = {
  "004": "AFG", "008": "ALB", "012": "DZA", "024": "AGO", "032": "ARG", "036": "AUS", "040": "AUT",
  "050": "BGD", "056": "BEL", "064": "BTN", "068": "BOL", "076": "BRA", "100": "BGR", "104": "MMR",
  "112": "BLR", "124": "CAN", "144": "LKA", "152": "CHL", "156": "CHN", "158": "TWN", "170": "COL",
  "188": "CRI", "191": "HRV", "196": "CYP", "203": "CZE", "208": "DNK", "214": "DOM", "218": "ECU",
  "222": "SLV", "231": "ETH", "246": "FIN", "250": "FRA", "266": "GAB", "268": "GEO", "270": "GMB",
  "276": "DEU", "288": "GHA", "300": "GRC", "320": "GTM", "324": "GIN", "328": "GUY", "332": "HTI",
  "340": "HND", "344": "HKG", "348": "HUN", "352": "ISL", "356": "IND", "360": "IDN", "364": "IRN",
  "368": "IRQ", "372": "IRL", "376": "ISR", "380": "ITA", "384": "CIV", "388": "JAM", "392": "JPN",
  "398": "KAZ", "400": "JOR", "404": "KEN", "408": "PRK", "410": "KOR", "414": "KWT", "417": "KGZ",
  "418": "LAO", "422": "LBN", "426": "LSO", "428": "LVA", "430": "LBR", "434": "LBY", "440": "LTU",
  "442": "LUX", "458": "MYS", "466": "MLI", "478": "MRT", "484": "MEX", "496": "MNG", "498": "MDA",
  "504": "MAR", "508": "MOZ", "512": "OMN", "516": "NAM", "524": "NPL", "528": "NLD", "554": "NZL",
  "558": "NIC", "562": "NER", "566": "NGA", "578": "NOR", "586": "PAK", "591": "PAN", "598": "PNG",
  "600": "PRY", "604": "PER", "608": "PHL", "616": "POL", "620": "PRT", "624": "GNB", "626": "TLS",
  "630": "PRI", "634": "QAT", "642": "ROU", "643": "RUS", "646": "RWA", "682": "SAU", "686": "SEN",
  "688": "SRB", "694": "SLE", "702": "SGP", "703": "SVK", "704": "VNM", "705": "SVN", "706": "SOM",
  "710": "ZAF", "716": "ZWE", "724": "ESP", "728": "SSD", "729": "SDN", "740": "SUR", "748": "SWZ",
  "752": "SWE", "756": "CHE", "760": "SYR", "762": "TJK", "764": "THA", "768": "TGO", "780": "TTO",
  "784": "ARE", "788": "TUN", "792": "TUR", "795": "TKM", "800": "UGA", "804": "UKR", "807": "MKD",
  "818": "EGY", "826": "GBR", "834": "TZA", "840": "USA", "854": "BFA", "858": "URY", "860": "UZB",
  "862": "VEN", "887": "YEM", "894": "ZMB", "242": "FJI", "604": "PER",
};

// Suppress unused import warning
void Search; void Truck;
