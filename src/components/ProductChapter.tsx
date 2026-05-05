import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Calculator, Check, ChevronRight, Shield, BadgeCheck, Star, Truck, Plus } from "lucide-react";
import { useCurrency } from "./CurrencyProvider";
import { EMIModal } from "./EMIModal";

export interface AddOn {
  name: string;
  priceNPR: number;
}

interface ProductChapterProps {
  index: string; // "01"
  category: string;
  title: string;
  tagline: string;
  body: string;
  image: string;
  basePriceNPR: number;
  bullets: string[];
  addOns: AddOn[];
  id: string;
  sku?: string;
  stock?: "in" | "low" | "out";
  rating?: { score: number; count: number };
}

const SHIPPING_OPTIONS = [
  { city: "Kathmandu", code: "KTM", eta: "Same day", costNPR: 0, badge: true },
  { city: "Pokhara", code: "PKR", eta: "1–2 days", costNPR: 350, badge: false },
  { city: "Butwal", code: "BWA", eta: "2–3 days", costNPR: 450, badge: false },
  { city: "Biratnagar", code: "BIR", eta: "2–3 days", costNPR: 450, badge: false },
];

export const ProductChapter = ({
  index, category, title, tagline, body, image,
  basePriceNPR, bullets, addOns, id,
  sku, stock = "in", rating = { score: 4.8, count: 312 },
}: ProductChapterProps) => {
  const { format } = useCurrency();
  const ref = useRef<HTMLElement>(null);
  const [emiOpen, setEmiOpen] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [shipIdx, setShipIdx] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const productSubtotal = basePriceNPR + Array.from(selected).reduce((s, i) => s + addOns[i].priceNPR, 0);
  const shipCost = SHIPPING_OPTIONS[shipIdx].costNPR;
  const total = productSubtotal + shipCost;

  const productSku = sku ?? `SW-${category.slice(0, 3).toUpperCase()}-${title.split(" ")[0].toUpperCase().slice(0, 6)}`;

  const stockLabel = useMemo(() => {
    if (stock === "in") return { text: "In Stock", dot: "bg-emerald-400 shadow-[0_0_10px_rgb(52_211_153/.8)]" };
    if (stock === "low") return { text: "Low Stock", dot: "bg-amber-400 shadow-[0_0_10px_rgb(251_191_36/.8)]" };
    return { text: "Backorder", dot: "bg-rose-500 shadow-[0_0_10px_rgb(244_63_94/.7)]" };
  }, [stock]);

  const toggle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <section ref={ref} id={id} className="relative mt-20 scroll-mt-24">
      {/* Sticky chapter header */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="container">
          <div className="sticky top-28 inline-flex items-center gap-3 glass rounded-full px-4 py-1.5 backdrop-blur-xl pointer-events-auto">
            <span className="font-display text-sm font-semibold text-accent">{index}</span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{category}</span>
          </div>
        </div>
      </div>

      <div className="container grid lg:grid-cols-[40%_60%] gap-8 lg:gap-[60px] items-start pt-16">
        {/* Sticky product image — desktop sticky, mobile inline */}
        <motion.div
          style={{ scale: imgScale, y: imgY }}
          className="relative w-full max-w-[500px] mx-auto lg:mx-0 lg:min-w-[400px] aspect-square lg:sticky lg:top-20 rounded-[2rem] overflow-hidden
            bg-[radial-gradient(ellipse_at_50%_30%,hsl(var(--accent-glow)/0.18),transparent_60%),radial-gradient(ellipse_at_70%_80%,hsl(280_90%_60%/0.14),transparent_55%),linear-gradient(180deg,hsl(0_0%_6%),hsl(0_0%_2%))]
            border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]"
        >
          <div aria-hidden className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-[hsl(280_90%_60%/0.15)] blur-3xl" />
          <img
            src={image}
            alt={title}
            loading="lazy"
            width={1024}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent">
            ◉ {category}
          </div>
          <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 glass rounded-full px-3 py-1 text-[10px] text-white/85">
            <span className={`h-1.5 w-1.5 rounded-full ${stockLabel.dot}`} />
            {stockLabel.text}
          </div>
        </motion.div>

        {/* Specs / pricing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition">Shangrila</a>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <a href="#shop" className="hover:text-foreground transition">Shop</a>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <a href={`#${id}`} className="hover:text-foreground transition">{category}</a>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-foreground/80">{tagline}</span>
          </nav>

          <p className="text-sm text-accent font-medium tracking-wider uppercase mt-5 lg:mt-0">{tagline}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-2 leading-[1.05]">
            {title}
          </h2>

          {/* Reviews + SKU row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="inline-flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(rating.score) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
              ))}
              <span className="ml-1 text-foreground font-medium">{rating.score.toFixed(1)}</span>
              <span>· {rating.count} reviews</span>
            </div>
            <span className="opacity-30">|</span>
            <span className="font-mono text-[11px]">SKU: <span className="text-foreground/80">{productSku}</span></span>
          </div>

          <p className="text-muted-foreground mt-4 max-w-md">{body}</p>

          <ul className="mt-6 space-y-2.5 text-sm">
            {bullets.map(b => (
              <li key={b} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Starting at</p>
            <motion.p
              key={total}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="font-display text-4xl md:text-5xl font-bold mt-1"
            >
              {format(total)}
            </motion.p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Inclusive of all taxes · {format(productSubtotal)} product + {format(shipCost)} shipping to {SHIPPING_OPTIONS[shipIdx].city}
            </p>

            {/* Trust badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] glass rounded-full px-2.5 py-1">
                <Shield className="h-3 w-3 text-emerald-400" /> 2-yr warranty
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] glass rounded-full px-2.5 py-1">
                <BadgeCheck className="h-3 w-3 text-[hsl(var(--accent-glow))]" /> Authenticity guaranteed
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] glass rounded-full px-2.5 py-1">
                <Truck className="h-3 w-3 text-[hsl(var(--accent-glow-2))]" /> Free returns · 14 days
              </span>
            </div>

            {/* EMI — larger, more discoverable */}
            <button
              onClick={() => setEmiOpen(true)}
              className="mt-5 w-full sm:w-auto inline-flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-accent/30 bg-gradient-to-r from-[hsl(var(--accent-glow)/0.10)] to-[hsl(var(--accent-glow-2)/0.10)] hover:border-accent/60 hover:shadow-[0_0_30px_hsl(var(--accent-glow)/0.35)] transition-all group"
            >
              <span className="flex items-center gap-3">
                <span className="h-9 w-9 grid place-items-center rounded-xl bg-foreground text-background">
                  <Calculator className="h-4 w-4" />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold">Calculate monthly installment</span>
                  <span className="block text-[11px] text-muted-foreground">From {format(Math.round(total / 12))} / mo · 0% interest available</span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition" />
            </button>
          </div>

          {/* Real-time shipping calculator */}
          <div className="mt-6 glass-strong rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Shipping calculator</span>
              <span className="text-[11px] text-muted-foreground">Live rates</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SHIPPING_OPTIONS.map((s, i) => {
                const on = i === shipIdx;
                return (
                  <button
                    key={s.code}
                    onClick={() => setShipIdx(i)}
                    className={`relative text-left rounded-2xl px-3 py-2.5 border transition-all ${
                      on
                        ? "border-accent/70 bg-accent/10 shadow-[0_0_20px_hsl(var(--accent-glow)/0.3)]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {s.badge && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-lg">
                        Same day
                      </span>
                    )}
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.code}</div>
                    <div className="text-sm font-semibold mt-0.5">{s.city}</div>
                    <div className="text-[11px] text-muted-foreground">{s.eta} · {s.costNPR === 0 ? "Free" : format(s.costNPR)}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total with delivery</span>
              <span className="font-display text-xl font-bold tabular-nums">{format(total)}</span>
            </div>
          </div>

          {/* Frequently bought together — redesigned */}
          {addOns.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Frequently bought together
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {addOns.map((a, i) => {
                  const on = selected.has(i);
                  return (
                    <button
                      key={a.name}
                      onClick={() => toggle(i)}
                      className={`group flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                        on
                          ? "border-accent/60 bg-accent/10 shadow-[0_0_20px_hsl(var(--accent-glow)/0.3)]"
                          : "border-white/10 hover:border-white/30 hover:-translate-y-0.5"
                      }`}
                    >
                      <span className={`h-14 w-14 shrink-0 rounded-xl grid place-items-center bg-gradient-to-br from-foreground/10 to-foreground/5 border ${on ? "border-accent/40" : "border-white/10"}`}>
                        {on ? <Check className="h-5 w-5 text-[hsl(var(--accent-glow))]" /> : <Plus className="h-5 w-5 text-muted-foreground" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium truncate">{a.name}</span>
                        <span className="block text-base font-display font-bold tabular-nums">{format(a.priceNPR)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews summary */}
          <div className="mt-8 glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Customer reviews</p>
              <a href="#" className="text-xs text-[hsl(var(--accent-glow))] hover:underline">See all {rating.count}</a>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="font-display text-4xl font-bold">{rating.score.toFixed(1)}</div>
              <div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(rating.score) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                  ))}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Based on {rating.count} verified buyers</div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { name: "Anish T.", city: "Kathmandu", stars: 5, text: "Build quality is unreal. Worth every rupee — the camera honestly competes with my old DSLR." },
                { name: "Sneha R.", city: "Pokhara", stars: 5, text: "Delivered next morning. Setup in 5 minutes. Battery life on this is genuinely days, not hours." },
              ].map((r) => (
                <div key={r.name} className="border-t border-border/40 pt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">{r.name} · <span className="text-muted-foreground">{r.city}</span></span>
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < r.stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                      ))}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex gap-3 flex-wrap">
            <button className="elastic px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2
              hover:shadow-[0_0_40px_hsl(var(--accent-glow)/0.6)] hover:scale-[1.04] active:scale-[0.98] transition-all">
              Buy Now <ArrowRight className="h-4 w-4" />
            </button>
            <button className="elastic glass px-6 py-3 rounded-full text-sm hover:bg-foreground/5 hover:scale-[1.04] active:scale-[0.98] transition-all">Learn more</button>
          </div>
        </motion.div>
      </div>

      <EMIModal
        open={emiOpen}
        onClose={() => setEmiOpen(false)}
        basePrice={total}
        productName={title}
      />
    </section>
  );
};
