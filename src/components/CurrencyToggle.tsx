import { motion } from "framer-motion";
import { useCurrency, Currency } from "./CurrencyProvider";

export const CurrencyToggle = () => {
  const { currency, setCurrency } = useCurrency();
  const opts: Currency[] = ["NPR", "USD"];
  return (
    <div className="relative inline-flex items-center rounded-full border border-white/10 bg-foreground/5 p-0.5 text-[11px]">
      {opts.map((o) => {
        const on = currency === o;
        return (
          <button
            key={o}
            onClick={() => setCurrency(o)}
            className={`relative z-10 px-2.5 py-1 rounded-full transition ${
              on ? "text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {on && (
              <motion.span
                layoutId="curr-pill"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 rounded-full bg-foreground -z-10"
              />
            )}
            {o}
          </button>
        );
      })}
    </div>
  );
};
