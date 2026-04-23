import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import phone from "@/assets/obsidian-phone.jpg";
import headphones from "@/assets/obsidian-headphones.jpg";

const items = [
  { name: "Aurora Pro 256 GB", price: 149900, img: phone, qty: 1 },
  { name: "Echo Studio", price: 38500, img: headphones, qty: 1 },
];

export const Bag = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[440px] z-[61] p-4"
          >
            <div className="glass-strong squircle h-full rounded-3xl flex flex-col">
              <div className="flex items-start justify-between p-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Your bag</p>
                  <h3 className="font-display text-2xl font-bold mt-1">{items.length} items</h3>
                </div>
                <button onClick={onClose} aria-label="Close" className="elastic glass h-9 w-9 rounded-full grid place-items-center">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 space-y-3 scrollbar-none">
                {items.map(i => (
                  <div key={i.name} className="glass rounded-2xl p-3 flex gap-3 items-center">
                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-black shrink-0">
                      <img src={i.img} alt={i.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{i.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Rs {i.price.toLocaleString("en-IN")}</div>
                      <div className="mt-2 inline-flex items-center gap-1 glass rounded-full px-1.5 py-0.5">
                        <button className="h-5 w-5 grid place-items-center"><Minus className="h-3 w-3" /></button>
                        <span className="text-xs px-1">{i.qty}</span>
                        <button className="h-5 w-5 grid place-items-center"><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-border/50 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">Rs {total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Delivery to Kathmandu</span>
                  <span className="text-[hsl(var(--accent-glow))]">Free · Tomorrow</span>
                </div>
                <button className="elastic w-full py-3 rounded-full bg-foreground text-background text-sm font-medium">
                  Checkout
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
