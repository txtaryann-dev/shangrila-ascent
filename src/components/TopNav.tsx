import { motion, AnimatePresence } from "framer-motion";
import { Moon, Search, ShoppingBag, Sun, MapPin, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { CurrencyToggle } from "./CurrencyToggle";

const stock = [
  { city: "Kathmandu", status: "in", label: "In stock" },
  { city: "Pokhara", status: "in", label: "In stock" },
  { city: "Butwal", status: "low", label: "Low stock" },
  { city: "Biratnagar", status: "out", label: "Notify me" },
];

const dot = (s: string) =>
  s === "in"
    ? "bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153_/_0.8)]"
    : s === "low"
    ? "bg-amber-400 shadow-[0_0_8px_rgb(251_191_36_/_0.8)]"
    : "bg-rose-500 shadow-[0_0_8px_rgb(244_63_94_/_0.7)]";

export const TopNav = ({ onOpenBag }: { onOpenBag: () => void }) => {
  const { theme, toggle } = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navLinks: { label: string; href: string }[] = [
    { label: "Phones", href: "#ch-phones" },
    { label: "Laptops", href: "#ch-laptops" },
    { label: "Audio", href: "#ch-audio" },
    { label: "Wearables", href: "#ch-wearables" },
    { label: "Cameras", href: "#ch-cameras" },
    { label: "Accessories", href: "#shop" },
    { label: "Support", href: "#delivery" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-4 w-[min(1200px,calc(100%-2rem))]"
    >
      <div className="glass-strong squircle rounded-full flex items-center justify-between px-5 py-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <a href="#" className="flex items-center gap-2 font-semibold tracking-tight text-[15px]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-background text-[11px] font-bold">SW</span>
            <span className="hidden sm:inline">Shangrila</span>
          </a>
          <button
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            onClick={toggle}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-border/40 bg-background/40 hover:bg-foreground/5 transition shrink-0"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-[13px] text-muted-foreground">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="relative hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:scale-x-0 after:origin-left after:bg-foreground after:transition-transform hover:after:scale-x-100">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {/* Nepal Availability */}
          <div className="relative">
            <button
              onClick={() => setNavOpen(o => !o)}
              className="hidden sm:flex elastic items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground"
            >
              <MapPin className="h-3.5 w-3.5" />
              Nepal
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
            <AnimatePresence>
              {navOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 mt-3 w-64 glass-strong squircle p-2 z-50"
                >
                  <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">Availability</div>
                  {stock.map(s => (
                    <div key={s.city} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-foreground/5 transition">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2 w-2 rounded-full ${dot(s.status)}`} />
                        <span className="text-sm">{s.city}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:block mr-1"><CurrencyToggle /></div>
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(o => !o)}
            className="p-2 rounded-full hover:bg-foreground/5 hover:scale-110 active:scale-95 transition"
          >
            <Search className="h-4 w-4" />
          </button>
          <button aria-label="Bag" onClick={onOpenBag} className="p-2 rounded-full hover:bg-foreground/5 hover:scale-110 active:scale-95 transition relative">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 grid place-items-center rounded-full bg-[hsl(var(--accent-glow))] text-[10px] font-semibold text-white">2</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};
