import { createContext, useContext, useState, ReactNode } from "react";

export type Currency = "NPR" | "USD";
const RATE = 133.5; // NPR per 1 USD

interface Ctx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (npr: number) => string;
  toEMI: (npr: number, months?: number) => string;
}

const CurrencyContext = createContext<Ctx | null>(null);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("NPR");

  const format = (npr: number) => {
    if (currency === "USD") {
      const v = npr / RATE;
      return `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    }
    return `Rs ${npr.toLocaleString("en-IN")}`;
  };

  const toEMI = (npr: number, months = 12) => format(Math.round(npr / months));

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, toEMI }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
};
