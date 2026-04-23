import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Calculator } from "lucide-react";
import { useCurrency } from "./CurrencyProvider";

interface Props {
  open: boolean;
  onClose: () => void;
  basePrice: number; // NPR
  productName: string;
}

const tenors = [3, 6, 12, 18, 24];

export const EMIModal = ({ open, onClose, basePrice, productName }: Props) => {
  const [months, setMonths] = useState(12);
  const { format } = useCurrency();
  const monthly = Math.round(basePrice / months);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-[61] w-[min(440px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 glass-strong squircle p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                  <Calculator className="h-3 w-3" /> EMI Calculator
                </p>
                <h3 className="font-display text-xl font-semibold mt-1">{productName}</h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-foreground/10 transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-foreground/5 border border-white/5">
              <p className="text-xs text-muted-foreground">Monthly installment</p>
              <p className="font-display text-3xl font-bold mt-1">{format(monthly)}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
              <p className="text-[11px] text-muted-foreground mt-1">Total {format(basePrice)} over {months} months · 0% interest</p>
            </div>

            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Tenure</p>
              <div className="flex gap-2 flex-wrap">
                {tenors.map(t => (
                  <button
                    key={t}
                    onClick={() => setMonths(t)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition ${
                      months === t
                        ? "bg-foreground text-background border-foreground"
                        : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30"
                    }`}
                  >
                    {t} mo
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground mt-4">
              Available with Nabil, NIC Asia, NMB, and Standard Chartered Nepal.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
