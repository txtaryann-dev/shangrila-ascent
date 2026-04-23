import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Calculator, Check } from "lucide-react";
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
}

export const ProductChapter = ({
  index, category, title, tagline, body, image,
  basePriceNPR, bullets, addOns, id,
}: ProductChapterProps) => {
  const { format } = useCurrency();
  const ref = useRef<HTMLElement>(null);
  const [emiOpen, setEmiOpen] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const total = basePriceNPR + Array.from(selected).reduce((s, i) => s + addOns[i].priceNPR, 0);

  const toggle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <section ref={ref} id={id} className="relative min-h-screen py-24 flex items-center">
      {/* Sticky chapter header */}
      <div className="absolute top-24 left-0 right-0 z-10 pointer-events-none">
        <div className="container">
          <div className="sticky top-28 inline-flex items-center gap-3 glass rounded-full px-4 py-1.5 backdrop-blur-xl pointer-events-auto">
            <span className="font-display text-sm font-semibold text-accent">{index}</span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{category}</span>
          </div>
        </div>
      </div>

      <div className="container grid lg:grid-cols-2 gap-12 items-center pt-12">
        {/* Sticky product image */}
        <motion.div
          style={{ scale: imgScale, y: imgY }}
          className="relative aspect-square rounded-[2.5rem] overflow-hidden
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
        </motion.div>

        {/* Specs / pricing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <p className="text-sm text-accent font-medium tracking-wider uppercase">{tagline}</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mt-2 leading-[1]">
            {title}
          </h2>
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
            <p className="text-[11px] text-muted-foreground mt-1">Inclusive of all taxes</p>
            <button
              onClick={() => setEmiOpen(true)}
              className="mt-2 text-xs text-accent hover:text-accent/80 inline-flex items-center gap-1 transition"
            >
              <Calculator className="h-3 w-3" /> Calculate monthly installment
            </button>
          </div>

          {/* Frequently bought together */}
          {addOns.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Frequently bought together
              </p>
              <div className="flex gap-2 flex-wrap">
                {addOns.map((a, i) => {
                  const on = selected.has(i);
                  return (
                    <button
                      key={a.name}
                      onClick={() => toggle(i)}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs transition-all ${
                        on
                          ? "border-accent/60 bg-accent/10 text-foreground shadow-[0_0_20px_hsl(var(--accent-glow)/0.3)]"
                          : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30"
                      }`}
                    >
                      <span className={`h-3.5 w-3.5 rounded-full grid place-items-center border ${
                        on ? "bg-accent border-accent" : "border-white/20"
                      }`}>
                        {on && <Check className="h-2.5 w-2.5 text-background" />}
                      </span>
                      <span>{a.name}</span>
                      <span className="text-muted-foreground">+{format(a.priceNPR)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex gap-3">
            <button className="elastic px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2
              hover:shadow-[0_0_30px_hsl(var(--accent-glow)/0.5)] transition-shadow">
              Buy Now <ArrowRight className="h-4 w-4" />
            </button>
            <button className="elastic glass px-6 py-3 rounded-full text-sm">Learn more</button>
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
