import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import phone from "@/assets/obsidian-phone.jpg";
import headphones from "@/assets/obsidian-headphones.jpg";
import laptop from "@/assets/obsidian-laptop.jpg";
import watch from "@/assets/obsidian-watch.jpg";

export interface CartItem {
  sku: string;
  name: string;
  priceNPR: number;       // effective unit price (after wholesale discount, if any)
  listPriceNPR: number;   // original list price
  qty: number;
  img?: string;
  note?: string;          // e.g. "Wholesale −10%"
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  addMany: (items: Array<Omit<CartItem, "qty"> & { qty?: number }>) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

/* Map SKUs (used by Wholesale) to local product imagery */
const IMG_BY_SKU: Record<string, string> = {
  "SW-PHN-AURPRO": phone,
  "SW-LAP-FBPRO": laptop,
  "SW-AUD-ECHO": headphones,
  "SW-WCH-PULSE": watch,
};
export const imageForSku = (sku: string) => IMG_BY_SKU[sku];

const SEED: CartItem[] = [
  { sku: "SW-PHN-AURPRO", name: "Aurora Pro 256 GB", priceNPR: 149900, listPriceNPR: 149900, qty: 1, img: phone },
  { sku: "SW-AUD-ECHO", name: "Echo Studio", priceNPR: 38500, listPriceNPR: 38500, qty: 1, img: headphones },
];

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(SEED);

  const add: CartCtx["add"] = useCallback((it) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.sku === it.sku && p.priceNPR === it.priceNPR);
      const qty = it.qty ?? 1;
      if (i === -1) return [...prev, { ...it, qty, img: it.img ?? imageForSku(it.sku) }];
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + qty };
      return next;
    });
  }, []);

  const addMany: CartCtx["addMany"] = useCallback((arr) => {
    setItems(prev => {
      const next = [...prev];
      arr.forEach(it => {
        const qty = it.qty ?? 1;
        const i = next.findIndex(p => p.sku === it.sku && p.priceNPR === it.priceNPR);
        if (i === -1) next.push({ ...it, qty, img: it.img ?? imageForSku(it.sku) });
        else next[i] = { ...next[i], qty: next[i].qty + qty };
      });
      return next;
    });
  }, []);

  const setQty: CartCtx["setQty"] = useCallback((sku, qty) => {
    setItems(prev =>
      qty <= 0 ? prev.filter(p => p.sku !== sku) : prev.map(p => p.sku === sku ? { ...p, qty } : p)
    );
  }, []);

  const remove: CartCtx["remove"] = useCallback((sku) => {
    setItems(prev => prev.filter(p => p.sku !== sku));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.priceNPR * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, count, subtotal, add, addMany, setQty, remove, clear }}>
      {children}
    </Ctx.Provider>
  );
};

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};
