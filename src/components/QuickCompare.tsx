import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, X, Check } from "lucide-react";
import { useState } from "react";

const matrix = [
  ["Display", "6.7\" Liquid Aurora", "6.1\" Liquid Aurora", "10.9\" Liquid"],
  ["Chip", "A19 Bionic", "A18", "M3 Pro"],
  ["Camera", "48 MP · 5× tele", "48 MP · 3× tele", "12 MP"],
  ["Battery", "32 hrs video", "26 hrs video", "10 hrs"],
  ["Weight", "187 g", "171 g", "466 g"],
];

export const QuickCompare = ({ items, onRemove, onClear }: {
  items: string[]; onRemove: (t: string) => void; onClear: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const visible = items.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="compare"
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 200 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(720px,calc(100%-2rem))]"
      >
        <div className="glass-strong squircle rounded-3xl overflow-hidden">
          {/* Bar */}
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-center justify-between px-5 py-3 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Compare</span>
              <div className="flex -space-x-2">
                {visible.map(t => (
                  <span key={t} className="h-7 w-7 rounded-full glass grid place-items-center text-[10px] font-semibold">
                    {t.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground hidden sm:inline">{items.length} item{items.length > 1 ? "s" : ""}</span>
            </div>
            <ChevronUp className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-border/60"
              >
                <div className="p-5">
                  <div className="grid" style={{ gridTemplateColumns: `120px repeat(${visible.length}, minmax(0,1fr)) auto` }}>
                    <div />
                    {visible.map(t => (
                      <div key={t} className="flex items-center justify-between gap-2 pb-3">
                        <span className="font-medium text-sm">{t}</span>
                        <button onClick={() => onRemove(t)} aria-label={`Remove ${t}`} className="elastic h-6 w-6 grid place-items-center rounded-full glass">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div />
                    {matrix.map((row, ri) => (
                      <div key={ri} className="contents">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground py-2.5 border-t border-border/50">{row[0]}</div>
                        {visible.map((_, ci) => (
                          <div key={ci} className="text-sm py-2.5 border-t border-border/50">{row[ci + 1] ?? "—"}</div>
                        ))}
                        <div className="border-t border-border/50" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground transition">Clear all</button>
                    <button className="elastic px-4 py-2 rounded-full bg-foreground text-background text-xs font-medium inline-flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" /> Side-by-side
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
