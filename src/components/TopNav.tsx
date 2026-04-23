import { motion } from "framer-motion";
import { Moon, Search, ShoppingBag, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export const TopNav = () => {
  const { theme, toggle } = useTheme();
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-4 w-[min(1200px,calc(100%-2rem))]"
    >
      <div className="glass rounded-full flex items-center justify-between px-5 py-2.5">
        <a href="#" className="flex items-center gap-2 font-display font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-background text-xs">SW</span>
          <span className="hidden sm:inline">Shangrila World</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {["Phones", "Laptops", "Audio", "Wearables", "Support"].map(l => (
            <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button aria-label="Search" className="p-2 rounded-full hover:bg-foreground/5 transition-colors"><Search className="h-4 w-4" /></button>
          <button aria-label="Toggle theme" onClick={toggle} className="p-2 rounded-full hover:bg-foreground/5 transition-colors">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button aria-label="Cart" className="p-2 rounded-full hover:bg-foreground/5 transition-colors relative">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 grid place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">2</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};
