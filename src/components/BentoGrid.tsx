import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import phones from "@/assets/hero-device.jpg";
import laptop from "@/assets/product-laptop.jpg";
import headphones from "@/assets/product-headphones.jpg";
import watch from "@/assets/product-watch.jpg";
import earbuds from "@/assets/product-earbuds.jpg";
import camera from "@/assets/product-camera.jpg";

type Tile = {
  title: string; tag: string; img: string; className: string; price?: string; tone?: "dark" | "light";
};

const tiles: Tile[] = [
  { title: "Aurora Pro", tag: "Smartphones", img: phones, price: "From Rs 1,49,900", tone: "dark", className: "md:col-span-2 md:row-span-2" },
  { title: "Featherbook Air", tag: "Laptops", img: laptop, price: "From Rs 2,19,000", tone: "light", className: "md:col-span-2" },
  { title: "Echo Studio", tag: "Headphones", img: headphones, price: "Rs 38,500", tone: "light", className: "" },
  { title: "Pulse Watch", tag: "Wearables", img: watch, price: "Rs 52,000", tone: "light", className: "" },
  { title: "Drift Buds", tag: "Earbuds", img: earbuds, price: "Rs 24,900", tone: "light", className: "" },
  { title: "Vista R7", tag: "Cameras", img: camera, price: "Rs 1,89,000", tone: "light", className: "" },
];

export const BentoGrid = () => (
  <section className="relative py-24" id="shop">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}
        className="flex items-end justify-between mb-10 gap-4"
      >
        <div>
          <p className="text-sm text-accent font-medium tracking-wider uppercase">Curated</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">A studio for every craft.</h2>
        </div>
        <a href="#" className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
          View all <ArrowUpRight className="h-4 w-4" />
        </a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[200px] gap-4">
        {tiles.map((t, i) => (
          <motion.button
            key={t.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className={`group relative overflow-hidden rounded-3xl glass text-left min-h-[260px] ${t.className}`}
          >
            <img src={t.img} alt={t.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className={`absolute inset-0 ${t.tone === "dark" ? "bg-gradient-to-t from-black/70 via-black/20 to-transparent" : "bg-gradient-to-t from-background/85 via-background/10 to-transparent"}`} />
            <div className={`absolute inset-0 p-6 flex flex-col justify-between ${t.tone === "dark" ? "text-white" : "text-foreground"}`}>
              <div className="flex items-start justify-between">
                <span className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full ${t.tone === "dark" ? "bg-white/15 backdrop-blur" : "bg-foreground/10"}`}>{t.tag}</span>
                <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">{t.title}</h3>
                {t.price && <p className={`text-sm mt-1 ${t.tone === "dark" ? "text-white/70" : "text-muted-foreground"}`}>{t.price}</p>}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  </section>
);
