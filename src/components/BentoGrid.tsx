import { motion } from "framer-motion";
import { ArrowUpRight, Plus, Check, Truck, Camera as CameraIcon } from "lucide-react";
import { useRef, useState } from "react";
import phone from "@/assets/obsidian-phone.jpg";
import laptop from "@/assets/obsidian-laptop.jpg";
import headphones from "@/assets/obsidian-headphones.jpg";
import watch from "@/assets/obsidian-watch.jpg";
import earbuds from "@/assets/obsidian-earbuds.jpg";
import tablet from "@/assets/obsidian-tablet.jpg";

type Stock = "in" | "low" | "out";
type T = {
  title: string;
  tag: string;
  img: string;
  price: string;
  sku: string;
  stock: Stock;
  eta: string;
  className: string;
};

const tiles: T[] = [
  { title: "Aurora Pro", tag: "Smartphone", img: phone, price: "From Rs 1,49,900", sku: "SW-PHN-AURPRO", stock: "in", eta: "Same day · KTM", className: "md:col-span-2 md:row-span-2" },
  { title: "Featherbook", tag: "Laptop", img: laptop, price: "From Rs 2,19,000", sku: "SW-LAP-FBPRO", stock: "in", eta: "1–2 days", className: "md:col-span-2" },
  { title: "Echo Studio", tag: "Headphones", img: headphones, price: "Rs 38,500", sku: "SW-AUD-ECHO", stock: "in", eta: "Same day · KTM", className: "" },
  { title: "Pulse Watch", tag: "Wearable", img: watch, price: "Rs 52,000", sku: "SW-WCH-PULSE", stock: "low", eta: "2–3 days", className: "" },
  { title: "Drift Buds", tag: "Earbuds", img: earbuds, price: "Rs 24,900", sku: "SW-AUD-DRIFT", stock: "in", eta: "Same day · KTM", className: "" },
  { title: "Slate Pad", tag: "Tablet", img: tablet, price: "Rs 89,000", sku: "SW-TAB-SLATE", stock: "in", eta: "1–2 days", className: "" },
];

const stockBadge = (s: Stock) => {
  if (s === "in") return { dot: "bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153/.8)]", text: "In stock" };
  if (s === "low") return { dot: "bg-amber-400 shadow-[0_0_8px_rgb(251_191_36/.8)]", text: "Low stock" };
  return { dot: "bg-rose-500 shadow-[0_0_8px_rgb(244_63_94/.7)]", text: "Backorder" };
};

const Card = ({ t, i, onCompare, added }: { t: T; i: number; onCompare: (title: string) => void; added: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current!.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const sb = stockBadge(t.stock);
  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={`glow-card group relative overflow-hidden squircle rounded-3xl glass min-h-[260px] transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_hsl(var(--accent-glow)/0.45)] ${t.className}`}
    >
      <img
        src={t.img} alt={t.title} loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.06]"
      />
      {/* Stronger gradient overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[hsl(var(--accent-glow)/0.18)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/70 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur">
              {t.tag}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full bg-white/10 backdrop-blur text-white/85">
              <span className={`h-1.5 w-1.5 rounded-full ${sb.dot}`} />
              {sb.text}
            </span>
          </div>
          <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition -translate-x-2 group-hover:translate-x-0 shrink-0" />
        </div>
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">{t.title}</h3>
          <div className="mt-1 flex items-center gap-3 text-[10px] text-white/60">
            <span className="font-mono">{t.sku}</span>
            <span className="inline-flex items-center gap-1"><Truck className="h-3 w-3" /> {t.eta}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm text-white/80">{t.price}</p>
            <button
              onClick={(e) => { e.stopPropagation(); onCompare(t.title); }}
              aria-pressed={added}
              className={`elastic rounded-full text-[10px] px-2.5 py-1 inline-flex items-center gap-1 transition-colors ${
                added
                  ? "bg-emerald-500/90 text-white shadow-[0_0_18px_rgb(52_211_153/.6)]"
                  : "glass text-white hover:bg-white/20"
              }`}
            >
              {added ? <><Check className="h-3 w-3" /> Added</> : <><Plus className="h-3 w-3" /> Compare</>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const BentoGrid = ({ onCompare }: { onCompare: (title: string) => void }) => {
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const [addedSet, setAddedSet] = useState<Set<string>>(new Set());

  const handleCompare = (title: string) => {
    onCompare(title);
    setAddedSet(prev => new Set(prev).add(title));
    setRecentlyAdded(title);
    setTimeout(() => setRecentlyAdded(curr => (curr === title ? null : curr)), 2200);
  };

  return (
  <section className="relative pt-16 pb-32 md:pt-24" id="shop">
    {/* Ambient halo */}
    <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[600px] pointer-events-none">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[hsl(var(--accent-glow)/0.14)] blur-[160px]" />
      <div className="absolute right-1/4 top-40 h-[300px] w-[400px] rounded-full bg-[hsl(var(--accent-glow-2)/0.12)] blur-[140px]" />
    </div>

    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-[11px] text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-glow))] shadow-[0_0_8px_hsl(var(--accent-glow))]" />
          The Lineup · 2026
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[0.98]">
          A studio for <span className="text-gradient">every craft.</span>
        </h1>
        <p className="text-muted-foreground mt-5 text-base md:text-lg max-w-xl mx-auto">
          Six devices, one obsession. Hand-picked electronics engineered for the way you create, work and move across Nepal.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <a href="#viewer" className="elastic px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:shadow-[0_0_30px_hsl(var(--accent-glow)/0.55)] hover:scale-[1.03] transition-all">
            Explore Aurora
          </a>
          <a href="#delivery" className="elastic glass-strong px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 hover:bg-foreground/5 hover:scale-[1.03] transition-all">
            View delivery &amp; shipping options <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[220px] gap-4">
        {tiles.map((t, i) => <Card key={t.title} t={t} i={i} onCompare={handleCompare} added={addedSet.has(t.title)} />)}
      </div>
    </div>

    {/* Compare-added confirmation toast */}
    {recentlyAdded && (
      <motion.div
        key={recentlyAdded}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-[60] glass-strong squircle px-4 py-2.5 text-sm inline-flex items-center gap-2 shadow-2xl"
      >
        <span className="h-5 w-5 grid place-items-center rounded-full bg-emerald-500 text-white">
          <Check className="h-3 w-3" />
        </span>
        <span><span className="font-semibold">{recentlyAdded}</span> added to compare</span>
      </motion.div>
    )}
  </section>
  );
};

// Re-export icon to keep tree-shaking explicit
export { CameraIcon };
