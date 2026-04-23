import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const specs = [
  { group: "Display", items: [["Size", "6.7\" Liquid Aurora"], ["Refresh", "120 Hz ProMotion"], ["Brightness", "2,500 nits HDR"]] },
  { group: "Performance", items: [["Chip", "A19 Bionic 3nm"], ["Cores", "8-core CPU · 10-core GPU"], ["Neural", "16-core NPU"]] },
  { group: "Camera", items: [["Main", "48 MP ƒ/1.6"], ["Ultra-wide", "12 MP ƒ/2.2"], ["Tele", "5× Optical Zoom"]] },
  { group: "Battery", items: [["Capacity", "4,800 mAh"], ["Video", "Up to 32 hrs"], ["Charge", "45W wired · 25W MagSafe"]] },
];

export const SpecSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
        />
        <motion.aside
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 220 }}
          className="fixed right-0 top-0 h-full w-full sm:w-[460px] z-[61] p-4"
        >
          <div className="glass-strong h-full rounded-3xl overflow-y-auto p-7 scrollbar-none">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-accent uppercase tracking-wider">Spec Sheet</p>
                <h3 className="font-display text-3xl font-bold mt-1">Aurora Pro</h3>
              </div>
              <button onClick={onClose} aria-label="Close" className="elastic glass h-9 w-9 rounded-full grid place-items-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-7">
              {specs.map(s => (
                <div key={s.group}>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{s.group}</h4>
                  <div className="glass rounded-2xl divide-y divide-border/50">
                    {s.items.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="elastic mt-7 w-full py-3 rounded-full bg-foreground text-background text-sm font-medium">
              Add to Cart · Rs 1,49,900
            </button>
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);
