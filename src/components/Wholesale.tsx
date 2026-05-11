import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Upload, Plus, Minus, Trash2, FileJson, FileSpreadsheet, FileText, Sun, Moon, ShoppingBag, ChevronDown } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useCurrency } from "./CurrencyProvider";
import { useTheme } from "./ThemeProvider";
import { useCart } from "./CartProvider";

/* ---------- Catalog ---------- */
interface CatalogItem {
  sku: string;
  name: string;
  category: string;
  priceNPR: number;
}

const DEFAULT_CATALOG: CatalogItem[] = [
  { sku: "SW-PHN-AURPRO", name: "Aurora Pro Smartphone", category: "Smartphones", priceNPR: 149900 },
  { sku: "SW-LAP-FBPRO", name: "Featherbook Pro 14\"", category: "Laptops", priceNPR: 219000 },
  { sku: "SW-AUD-ECHO", name: "Echo Studio Headphones", category: "Audio", priceNPR: 38500 },
  { sku: "SW-WCH-PULSE", name: "Pulse Watch", category: "Wearables", priceNPR: 52000 },
  { sku: "SW-ACC-MAGSAFE", name: "MagSafe Charger", category: "Accessories", priceNPR: 4900 },
  { sku: "SW-ACC-CASE", name: "Leather Case", category: "Accessories", priceNPR: 6500 },
];

/* ---------- Wholesale tiers ---------- */
const TIERS = [
  { min: 1, max: 4, pct: 0, label: "Retail" },
  { min: 5, max: 9, pct: 5, label: "Tier 1" },
  { min: 10, max: 24, pct: 10, label: "Tier 2" },
  { min: 25, max: 49, pct: 15, label: "Tier 3" },
  { min: 50, max: Infinity, pct: 20, label: "Tier 4" },
];
const tierFor = (q: number) => TIERS.find(t => q >= t.min && q <= t.max) ?? TIERS[0];

/* ---------- CSV utils ---------- */
const toCSV = (rows: Array<Record<string, unknown>>) => {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(","), ...rows.map(r => keys.map(k => esc(r[k])).join(","))].join("\n");
};
const parseCSV = (text: string): Record<string, string>[] => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const splitLine = (line: string) => {
    const out: string[] = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === ",") { out.push(cur); cur = ""; }
        else if (c === '"') inQ = true;
        else cur += c;
      }
    }
    out.push(cur);
    return out;
  };
  const headers = splitLine(lines[0]).map(h => h.trim());
  return lines.slice(1).map(l => {
    const cells = splitLine(l);
    return Object.fromEntries(headers.map((h, i) => [h, (cells[i] ?? "").trim()]));
  });
};

const downloadFile = (filename: string, content: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ---------- Component ---------- */
export const Wholesale = ({ onOpenBag }: { onOpenBag?: () => void }) => {
  const { format, currency } = useCurrency();
  const { theme, toggle } = useTheme();
  const { addMany } = useCart();
  const [catalog, setCatalog] = useState<CatalogItem[]>(DEFAULT_CATALOG);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<"catalog" | "quote" | "cart">("catalog");

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
  };

  /* derived totals */
  const lines = useMemo(() => {
    return catalog
      .map(item => {
        const q = qty[item.sku] ?? 0;
        const tier = tierFor(q);
        const subtotal = item.priceNPR * q;
        const discount = Math.round((subtotal * tier.pct) / 100);
        const total = subtotal - discount;
        return { ...item, q, tier, subtotal, discount, total };
      })
      .filter(l => l.q > 0);
  }, [catalog, qty]);

  const grand = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
    const discount = lines.reduce((s, l) => s + l.discount, 0);
    const vat = Math.round((subtotal - discount) * 0.13);
    const total = subtotal - discount + vat;
    return { subtotal, discount, vat, total, units: lines.reduce((s, l) => s + l.q, 0) };
  }, [lines]);

  const setQ = (sku: string, n: number) =>
    setQty(prev => ({ ...prev, [sku]: Math.max(0, n) }));

  /* --- export --- */
  const exportCatalogCSV = () => {
    downloadFile("shangrila-catalog.csv", toCSV(catalog as unknown as Array<Record<string, unknown>>), "text/csv");
    showToast("Catalog exported as CSV");
  };
  const exportCatalogJSON = () => {
    downloadFile("shangrila-catalog.json", JSON.stringify(catalog, null, 2), "application/json");
    showToast("Catalog exported as JSON");
  };
  const exportQuoteCSV = () => {
    if (!lines.length) return showToast("Add quantities first");
    const rows = lines.map(l => ({
      sku: l.sku, name: l.name, category: l.category,
      unit_price_npr: l.priceNPR, quantity: l.q,
      tier: l.tier.label, discount_pct: l.tier.pct,
      subtotal_npr: l.subtotal, discount_npr: l.discount, line_total_npr: l.total,
    }));
    rows.push({
      sku: "—", name: "GRAND TOTAL", category: "", unit_price_npr: 0,
      quantity: grand.units, tier: "", discount_pct: 0,
      subtotal_npr: grand.subtotal, discount_npr: grand.discount, line_total_npr: grand.total,
    });
    downloadFile("shangrila-wholesale-quote.csv", toCSV(rows), "text/csv");
    showToast("Quote exported as CSV");
  };
  const exportQuoteJSON = () => {
    if (!lines.length) return showToast("Add quantities first");
    const payload = {
      generated_at: new Date().toISOString(),
      currency: "NPR",
      lines, totals: grand,
    };
    downloadFile("shangrila-wholesale-quote.json", JSON.stringify(payload, null, 2), "application/json");
    showToast("Quote exported as JSON");
  };
  const exportQuotePDF = () => {
    if (!lines.length) return showToast("Add quantities first");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const quoteId = `SW-Q-${Date.now().toString(36).toUpperCase()}`;
    const today = new Date();
    const validUntil = new Date(today.getTime() + 14 * 24 * 3600_000);
    const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

    // Header
    doc.setFillColor(15, 15, 18);
    doc.rect(0, 0, 595, 110, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold").setFontSize(22).text("Shangrila World", 40, 50);
    doc.setFont("helvetica", "normal").setFontSize(10).text("Wholesale Quote", 40, 70);
    doc.setFontSize(9).setTextColor(180);
    doc.text(`Quote ID: ${quoteId}`, 555, 40, { align: "right" });
    doc.text(`Issued: ${fmtDate(today)}`, 555, 55, { align: "right" });
    doc.text(`Valid until: ${fmtDate(validUntil)}`, 555, 70, { align: "right" });
    doc.text(`Currency: NPR`, 555, 85, { align: "right" });

    doc.setTextColor(40);
    doc.setFontSize(10).text(`Total units: ${grand.units}`, 40, 135);

    autoTable(doc, {
      startY: 150,
      head: [["SKU", "Product", "Qty", "Unit (Rs)", "Tier", "Disc", "Line total (Rs)"]],
      body: lines.map(l => [
        l.sku, l.name, String(l.q),
        l.priceNPR.toLocaleString("en-IN"),
        l.tier.label,
        l.tier.pct ? `−${l.tier.pct}%` : "—",
        l.total.toLocaleString("en-IN"),
      ]),
      headStyles: { fillColor: [15, 15, 18], textColor: 255, fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: 40 },
      alternateRowStyles: { fillColor: [248, 248, 250] },
      columnStyles: {
        2: { halign: "right" }, 3: { halign: "right" },
        5: { halign: "right" }, 6: { halign: "right", fontStyle: "bold" },
      },
      margin: { left: 40, right: 40 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    const labelX = 380, valX = 555;
    doc.setFontSize(10).setTextColor(40);
    doc.text("Subtotal", labelX, finalY);
    doc.text(`Rs ${grand.subtotal.toLocaleString("en-IN")}`, valX, finalY, { align: "right" });
    doc.text("Wholesale discount", labelX, finalY + 16);
    doc.setTextColor(40, 110, 220).text(`− Rs ${grand.discount.toLocaleString("en-IN")}`, valX, finalY + 16, { align: "right" });
    doc.setTextColor(40);
    doc.text("VAT (13%)", labelX, finalY + 32);
    doc.text(`Rs ${grand.vat.toLocaleString("en-IN")}`, valX, finalY + 32, { align: "right" });
    doc.setLineWidth(0.5).line(labelX, finalY + 40, 555, finalY + 40);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("Grand total", labelX, finalY + 58);
    doc.text(`Rs ${grand.total.toLocaleString("en-IN")}`, valX, finalY + 58, { align: "right" });

    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(120);
    doc.text(
      "This quote is an estimate. Final pricing confirmed on PO. Inclusive of 13% VAT. Shangrila World · Kathmandu, Nepal.",
      40, 800,
    );
    doc.save(`shangrila-quote-${quoteId}.pdf`);
    showToast("Quote PDF generated");
  };
  const exportCartJSON = () => {
    const cart = lines.map(l => ({ sku: l.sku, name: l.name, quantity: l.q, unit_price_npr: l.priceNPR }));
    if (!cart.length) return showToast("Cart is empty");
    downloadFile("shangrila-cart.json", JSON.stringify(cart, null, 2), "application/json");
    showToast("Cart saved");
  };

  /* --- add quote lines into the site cart --- */
  const addAllToCart = () => {
    if (!lines.length) return showToast("Add quantities first");
    addMany(
      lines.map(l => ({
        sku: l.sku,
        name: l.name,
        priceNPR: Math.round(l.priceNPR * (1 - l.tier.pct / 100)),
        listPriceNPR: l.priceNPR,
        qty: l.q,
        note: l.tier.pct > 0 ? `Wholesale −${l.tier.pct}% · ${l.tier.label}` : undefined,
      }))
    );
    showToast(`${grand.units} unit${grand.units > 1 ? "s" : ""} added to bag`);
    setQty({});
    setTimeout(() => onOpenBag?.(), 350);
  };

  /* --- import --- */
  const onPickFile = (mode: "catalog" | "quote" | "cart") => {
    setImportMode(mode);
    fileRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const isJSON = file.name.toLowerCase().endsWith(".json");
      const data: Record<string, string>[] = isJSON ? JSON.parse(text) : parseCSV(text);
      if (!Array.isArray(data) || !data.length) return showToast("File is empty or invalid");

      if (importMode === "catalog") {
        const next: CatalogItem[] = data
          .map(r => ({
            sku: String(r.sku ?? "").trim(),
            name: String(r.name ?? "").trim(),
            category: String(r.category ?? "Misc").trim(),
            priceNPR: Number(r.priceNPR ?? r.price_npr ?? r.unit_price_npr ?? 0),
          }))
          .filter(r => r.sku && r.name && r.priceNPR > 0);
        if (!next.length) return showToast("No valid catalog rows");
        setCatalog(next);
        showToast(`Imported ${next.length} catalog items`);
      } else {
        const nextQty: Record<string, number> = { ...qty };
        let n = 0;
        data.forEach(r => {
          const sku = String(r.sku ?? "").trim();
          const q = Number(r.quantity ?? r.qty ?? 0);
          if (sku && q > 0) { nextQty[sku] = (nextQty[sku] ?? 0) + q; n++; }
        });
        if (!n) return showToast("No quantities found");
        setQty(nextQty);
        showToast(`Imported ${n} line${n > 1 ? "s" : ""}`);
      }
    } catch {
      showToast("Could not parse file");
    }
  };

  return (
    <section id="ch-wholesale" className="relative min-h-screen px-6 lg:px-12 py-24">
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.json,application/json,text/csv"
        onChange={handleFile}
        className="hidden"
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              05 · Wholesale
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Buy by the <span className="text-gradient">crate.</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Quantity-based tier pricing for resellers and businesses across Nepal.
              Import a SKU list, get a live quote, export it as CSV or JSON.
            </p>
          </div>

          {/* Theme + currency note */}
          <div className="flex items-center gap-2">
            <div className="glass squircle px-3 py-2 text-[11px] text-muted-foreground">
              Pricing in <span className="text-foreground font-medium">{currency}</span>
            </div>
            <button
              onClick={toggle}
              className="glass squircle elastic flex items-center gap-2 px-3 py-2 text-xs"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {theme === "dark" ? "Light" : "Dark"} mode
            </button>
          </div>
        </div>

        {/* Tier ladder — stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
          {TIERS.map(t => (
            <div key={t.label} className="glass squircle p-4 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_hsl(var(--accent-glow)/0.35)]">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.label}</div>
              <div className="text-lg font-semibold mt-1">
                {t.max === Infinity ? `${t.min}+ units` : `${t.min}–${t.max} units`}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {t.pct === 0 ? "Standard pricing" : `${t.pct}% off list`}
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar — consolidated into grouped menus */}
        <div className="glass-strong squircle p-3 mb-6 flex flex-wrap items-center gap-2">
          <ToolbarMenu
            label="Catalog"
            actions={[
              { label: "Import CSV / JSON", icon: <Upload className="h-3.5 w-3.5" />, onClick: () => onPickFile("catalog") },
              { label: "Export as CSV", icon: <FileSpreadsheet className="h-3.5 w-3.5" />, onClick: exportCatalogCSV },
              { label: "Export as JSON", icon: <FileJson className="h-3.5 w-3.5" />, onClick: exportCatalogJSON },
            ]}
          />
          <ToolbarMenu
            label="Quote"
            actions={[
              { label: "Import quantities", icon: <Upload className="h-3.5 w-3.5" />, onClick: () => onPickFile("quote") },
              { label: "Export quote (CSV)", icon: <Download className="h-3.5 w-3.5" />, onClick: exportQuoteCSV },
              { label: "Export quote (JSON)", icon: <Download className="h-3.5 w-3.5" />, onClick: exportQuoteJSON },
              { label: "Export quote (PDF)", icon: <FileText className="h-3.5 w-3.5" />, onClick: exportQuotePDF },
            ]}
          />
          <ToolbarMenu
            label="Cart"
            actions={[
              { label: "Import cart", icon: <Upload className="h-3.5 w-3.5" />, onClick: () => onPickFile("cart") },
              { label: "Export cart", icon: <Download className="h-3.5 w-3.5" />, onClick: exportCartJSON },
            ]}
          />

          <button
            onClick={addAllToCart}
            className="glass squircle elastic flex items-center gap-2 px-3 py-2 text-xs text-[hsl(var(--accent-glow))] hover:text-foreground hover:scale-[1.04] transition-transform"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add all to cart
          </button>

          <button
            onClick={() => setQty({})}
            className="ml-auto glass squircle elastic flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear quantities
          </button>
        </div>

        {/* Catalog table */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="glass-strong squircle overflow-hidden">
            <div className="grid grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-3 px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <div>Product</div><div>Unit price</div><div>Quantity</div><div className="text-right">Line total</div>
            </div>
            <div className="divide-y divide-border/40">
              {catalog.map(item => {
                const q = qty[item.sku] ?? 0;
                const tier = tierFor(q);
                const total = item.priceNPR * q * (1 - tier.pct / 100);
                return (
                  <div key={item.sku} className="grid grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-3 items-center px-5 py-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.sku} · {item.category}
                      </div>
                    </div>
                    <div className="text-sm">{format(item.priceNPR)}</div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setQ(item.sku, q - 1)}
                        className="h-7 w-7 grid place-items-center rounded-full glass elastic"
                        aria-label="Decrease"
                      ><Minus className="h-3 w-3" /></button>
                      <input
                        type="number"
                        min={0}
                        value={q}
                        onChange={(e) => setQ(item.sku, Number(e.target.value) || 0)}
                        className="w-14 text-center bg-transparent border border-border rounded-md py-1 text-sm tabular-nums focus:outline-none focus:border-foreground/40"
                      />
                      <button
                        onClick={() => setQ(item.sku, q + 1)}
                        className="h-7 w-7 grid place-items-center rounded-full glass elastic"
                        aria-label="Increase"
                      ><Plus className="h-3 w-3" /></button>
                      {q > 0 && tier.pct > 0 && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-[hsl(var(--accent-glow))]">
                          −{tier.pct}%
                        </span>
                      )}
                    </div>
                    <div className="text-right text-sm tabular-nums">
                      {q > 0 ? format(total) : <span className="text-muted-foreground">—</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="glass-strong squircle p-6 h-fit lg:sticky lg:top-28">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Quote summary</div>
            <Row label="Units" value={String(grand.units)} />
            <Row label="Subtotal" value={format(grand.subtotal)} />
            <Row label="Wholesale discount" value={`− ${format(grand.discount)}`} accent />
            <Row label="VAT (13%)" value={format(grand.vat)} />
            <div className="h-px bg-border/60 my-3" />
            <div className="flex items-end justify-between">
              <span className="text-sm text-muted-foreground">Total payable</span>
              <motion.span
                key={grand.total}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-2xl font-bold tabular-nums"
              >
                {format(grand.total)}
              </motion.span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Inclusive of VAT. Final pricing confirmed on PO.
            </p>
            <button
              onClick={addAllToCart}
              disabled={!lines.length}
              className="mt-5 w-full elastic px-4 py-3 rounded-full bg-foreground text-background text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Add all to cart · checkout
            </button>
            <button
              onClick={exportQuoteCSV}
              disabled={!lines.length}
              className="mt-2 w-full elastic px-4 py-2.5 rounded-full glass text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              Generate quote (CSV)
            </button>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground mt-6">
          Tip: import a CSV with columns <code className="text-foreground/80">sku, quantity</code> to bulk-fill the quote,
          or <code className="text-foreground/80">sku, name, category, priceNPR</code> to replace the catalog.
        </p>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-strong squircle px-4 py-2.5 text-sm z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Row = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`text-sm tabular-nums ${accent ? "text-[hsl(var(--accent-glow))]" : ""}`}>{value}</span>
  </div>
);

interface ToolbarAction { label: string; icon: React.ReactNode; onClick: () => void; }
const ToolbarMenu = ({ label, actions }: { label: string; actions: ToolbarAction[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="glass squircle elastic flex items-center gap-2 px-3 py-2 text-xs hover:scale-[1.04] transition-transform"
      >
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full mt-2 z-30 min-w-[200px] glass-strong squircle p-1.5"
          >
            {actions.map(a => (
              <button
                key={a.label}
                onMouseDown={(e) => { e.preventDefault(); a.onClick(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs hover:bg-foreground/5 transition text-left"
              >
                {a.icon}
                <span>{a.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
