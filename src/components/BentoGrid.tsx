import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { useRef } from "react";
import phone from "@/assets/obsidian-phone.jpg";
import laptop from "@/assets/obsidian-laptop.jpg";
import headphones from "@/assets/obsidian-headphones.jpg";
import watch from "@/assets/obsidian-watch.jpg";
import earbuds from "@/assets/obsidian-earbuds.jpg";
import tablet from "@/assets/obsidian-tablet.jpg";

type T = { title: string; tag: string; img: string; price: string; className: string };
const tiles: T[] = [
  { title: "Aurora Pro", tag: "Smartphone", img: phone, price: "From Rs 1,49,900", className: "md:col-span-2 md:row-span-2" },
  { title: "Featherbook", tag: "Laptop", img: laptop, price: "From Rs 2,19,000", className: "md:col-span-2" },
  { title: "Echo Studio", tag: "Headphones", img: headphones, price: "Rs 38,500", className: "" },
  { title: "Pulse Watch", tag: "Wearable", img: watch, price: "Rs 52,000", className: "" },
  { title: "Drift Buds", tag: "Earbuds", img: earbuds, price: "Rs 24,900", className: "" },
  { title: "Slate Pad", tag: "Tablet", img: tablet, price: "Rs 89,000", className: "" },
];

const Card = ({ t, i, onCompare }: { t: T; i: number; onCompare: (title: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    ref.current!.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`glow-card group relative overflow-hidden squircle rounded-3xl glass min-h-[260px] ${t.className}`}
    >
      <img
        src={t.img} alt={t.title} loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
        <div className="flex items-start justify-between">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/70 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur">
            {t.tag}
          </span>
          <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition -translate-x-2 group-hover:translate-x-0" />
        </div>
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">{t.title}</h3>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm text-white/70">{t.price}</p>
            <button
              onClick={(e) => { e.stopPropagation(); onCompare(t.title); }}
              className="elastic glass rounded-full text-[10px] px-2.5 py-1 inline-flex items-center gap-1 text-white"
            >
              <Plus className="h-3 w-3" /> Compare
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const BentoGrid = ({ onCompare }: { onCompare: (title: string) => void }) => (
  <section className="relative py-32" id="shop">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="flex items-end justify-between mb-12 gap-4"
      >
        <div>
          <p className="text-xs text-[hsl(var(--accent-glow))] font-medium tracking-[0.2em] uppercase">The Lineup</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mt-3">A studio for every craft.</h2>
        </div>
        <a href="#" className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
          View all <ArrowUpRight className="h-4 w-4" />
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[220px] gap-4">
        {tiles.map((t, i) => <Card key={t.title} t={t} i={i} onCompare={onCompare} />)}
      </div>
    </div>
  </section>
);
