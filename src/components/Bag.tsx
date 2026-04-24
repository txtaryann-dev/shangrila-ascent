import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { useCurrency } from "./CurrencyProvider";

export const Bag = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const { format } = useCurrency();

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
                  <h3 className="font-display text-2xl font-bold mt-1">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={clear}
                      aria-label="Clear bag"
                      className="elastic glass h-9 w-9 rounded-full grid place-items-center text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={onClose} aria-label="Close" className="elastic glass h-9 w-9 rounded-full grid place-items-center">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 space-y-3 scrollbar-none">
                {items.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-16">
                    Your bag is empty.
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {items.map(i => {
                    const discounted = i.priceNPR < i.listPriceNPR;
                    return (
                      <motion.div
                        key={i.sku + i.priceNPR}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="glass rounded-2xl p-3 flex gap-3 items-center"
                      >
                        <div className="h-16 w-16 rounded-xl overflow-hidden bg-black shrink-0">
                          {i.img && <img src={i.img} alt={i.name} className="h-full w-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{i.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                            <span>{format(i.priceNPR)}</span>
                            {discounted && (
                              <span className="line-through opacity-50">{format(i.listPriceNPR)}</span>
                            )}
                          </div>
                          {i.note && (
                            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-[hsl(var(--accent-glow))]">
                              {i.note}
                            </div>
                          )}
                          <div className="mt-2 inline-flex items-center gap-1 glass rounded-full px-1.5 py-0.5">
                            <button onClick={() => setQty(i.sku, i.qty - 1)} className="h-5 w-5 grid place-items-center">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs px-1 tabular-nums">{i.qty}</span>
                            <button onClick={() => setQty(i.sku, i.qty + 1)} className="h-5 w-5 grid place-items-center">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => remove(i.sku)}
                          aria-label="Remove"
                          className="text-muted-foreground hover:text-foreground p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="p-6 border-t border-border/50 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-medium tabular-nums"
                  >
                    {format(subtotal)}
                  </motion.span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Delivery to Kathmandu</span>
                  <span className="text-[hsl(var(--accent-glow))]">Free · Tomorrow</span>
                </div>
                <button
                  disabled={items.length === 0}
                  className="elastic w-full py-3 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-40"
                >
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
