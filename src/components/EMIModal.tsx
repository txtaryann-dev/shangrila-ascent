import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { X, Calculator, Zap, Building2 } from "lucide-react";
import { useCurrency } from "./CurrencyProvider";

interface Props {
  open: boolean;
  onClose: () => void;
  basePrice: number; // NPR
  productName: string;
}

const tenors = [3, 6, 9, 12, 18, 24];
type Provider = "khalti" | "esewa" | "bank";
const APR: Record<Provider, number> = { khalti: 0, esewa: 0, bank: 0.1399 };
const MAX_TENOR: Record<Provider, number> = { khalti: 12, esewa: 9, bank: 24 };

const providers: { id: Provider; label: string; sub: string; icon: typeof Zap; accent: string }[] = [
  { id: "khalti", label: "Khalti", sub: "0% interest · up to 12 mo", icon: Zap,       accent: "270 90% 65%" },
  { id: "esewa",  label: "eSewa",  sub: "0% interest · up to 9 mo",  icon: Zap,       accent: "150 80% 50%" },
  { id: "bank",   label: "Bank EMI", sub: "13.99% APR · up to 24 mo", icon: Building2, accent: "220 100% 60%" },
];

export const EMIModal = ({ open, onClose, basePrice, productName }: Props) => {
  const [provider, setProvider] = useState<Provider>("khalti");
  const [months, setMonths] = useState(12);
  const { format } = useCurrency();

  const allowedTenors = tenors.filter(t => t <= MAX_TENOR[provider]);
  const safeMonths = allowedTenors.includes(months) ? months : allowedTenors[allowedTenors.length - 1];

  const { monthly, totalPayable, interest } = useMemo(() => {
    const r = APR[provider] / 12;
    if (r === 0) {
      const m = Math.round(basePrice / safeMonths);
      return { monthly: m, totalPayable: m * safeMonths, interest: 0 };
    }
    // standard amortization
    const m = Math.round((basePrice * r) / (1 - Math.pow(1 + r, -safeMonths)));
    const total = m * safeMonths;
    return { monthly: m, totalPayable: total, interest: total - basePrice };
  }, [basePrice, safeMonths, provider]);

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
            className="fixed left-1/2 top-1/2 z-[61] w-[min(480px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 glass-strong squircle p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                  <Calculator className="h-3 w-3" /> EMI Calculator
                </p>
                <h3 className="font-display text-xl font-semibold mt-1">{productName}</h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-foreground/10 transition" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Provider pills */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {providers.map(p => {
                const on = provider === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={`text-left rounded-xl p-3 border transition ${
                      on ? "border-foreground/40 bg-foreground/5"
                         : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg mb-2"
                      style={{ background: `hsl(${p.accent} / 0.18)`, color: `hsl(${p.accent})` }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-xs font-semibold">{p.label}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">{p.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Result */}
            <motion.div
              key={`${provider}-${safeMonths}-${monthly}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-foreground/5 border border-white/5"
            >
              <p className="text-xs text-muted-foreground">Monthly installment</p>
              <p className="font-display text-3xl font-bold mt-1 tabular-nums">
                {format(monthly)}<span className="text-sm text-muted-foreground font-normal">/mo</span>
              </p>
              <div className="text-[11px] text-muted-foreground mt-2 flex flex-wrap gap-x-3 gap-y-0.5">
                <span>Total payable <span className="text-foreground tabular-nums">{format(totalPayable)}</span></span>
                <span>· {safeMonths} months</span>
                <span>· {APR[provider] === 0 ? "0% interest" : `${(APR[provider]*100).toFixed(2)}% APR`}</span>
                {interest > 0 && <span>· interest <span className="text-foreground tabular-nums">{format(interest)}</span></span>}
              </div>
            </motion.div>

            {/* Tenure */}
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Tenure</p>
              <div className="flex gap-2 flex-wrap">
                {allowedTenors.map(t => (
                  <button
                    key={t}
                    onClick={() => setMonths(t)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition ${
                      safeMonths === t
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
              {provider === "bank"
                ? "Available with Nabil, NIC Asia, NMB, and Standard Chartered Nepal."
                : "Promo financing — no interest, no hidden fees. Subject to KYC approval."}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
