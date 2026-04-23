import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { TopNav } from "@/components/TopNav";
import { MobileDock } from "@/components/MobileDock";
import { BentoGrid } from "@/components/BentoGrid";
import { Product3DViewer } from "@/components/Product3DViewer";
import { ProductChapter } from "@/components/ProductChapter";
import { ChapterProgress } from "@/components/ChapterProgress";
import { LocalLogistics } from "@/components/LocalLogistics";
import { Payments } from "@/components/Payments";
import { Footer } from "@/components/Footer";
import { SpecSheet } from "@/components/SpecSheet";
import { ChatAssistant } from "@/components/ChatAssistant";
import { QuickCompare } from "@/components/QuickCompare";
import { Bag } from "@/components/Bag";

import phone from "@/assets/obsidian-phone.jpg";
import laptop from "@/assets/obsidian-laptop.jpg";
import headphones from "@/assets/obsidian-headphones.jpg";
import watch from "@/assets/obsidian-watch.jpg";

const chapters = [
  { id: "ch-phones", label: "Smartphones" },
  { id: "ch-laptops", label: "Laptops" },
  { id: "ch-audio", label: "Audio" },
  { id: "ch-wearables", label: "Wearables" },
];

const Index = () => {
  const [specOpen, setSpecOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);

  const addCompare = (t: string) =>
    setCompare(prev => (prev.includes(t) ? prev : [...prev, t].slice(0, 3)));

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <div className="relative min-h-screen overflow-x-hidden bg-background">
          <TopNav onOpenBag={() => setBagOpen(true)} />
          <ChapterProgress sections={chapters} />

          <main className="pt-24">
            <BentoGrid onCompare={addCompare} />
            <Product3DViewer onOpenSpec={() => setSpecOpen(true)} />

            <ProductChapter
              id="ch-phones"
              index="01"
              category="Smartphones"
              tagline="Aurora Pro"
              title="Light. Years ahead."
              body="Titanium. Edge-to-edge OLED. The most advanced camera system we've ever shipped — engineered for the mountains and the metro."
              image={phone}
              basePriceNPR={149900}
              bullets={[
                "6.7\" Super Retina XDR · ProMotion 120Hz",
                "A18 Pro · 8GB RAM",
                "48MP triple-lens · 5x optical zoom",
              ]}
              addOns={[
                { name: "MagSafe Charger", priceNPR: 4900 },
                { name: "Leather Case", priceNPR: 6500 },
                { name: "AppleCare+", priceNPR: 18000 },
              ]}
            />

            <ProductChapter
              id="ch-laptops"
              index="02"
              category="Laptops"
              tagline="Featherbook Pro"
              title="Studio in your bag."
              body="A precision-machined chassis, a display that breathes color, and battery life measured in days — for creators who refuse to compromise."
              image={laptop}
              basePriceNPR={219000}
              bullets={[
                "14\" Liquid Retina XDR · 1600 nits",
                "M4 Pro · 18GB unified memory",
                "Up to 22 hours of battery",
              ]}
              addOns={[
                { name: "USB-C Hub", priceNPR: 7500 },
                { name: "Sleeve", priceNPR: 4200 },
                { name: "Magic Mouse", priceNPR: 12500 },
              ]}
            />

            <ProductChapter
              id="ch-audio"
              index="03"
              category="Audio"
              tagline="Echo Studio"
              title="Silence, perfected."
              body="Adaptive noise cancellation tuned by acoustic engineers in Kathmandu. Soft memory-foam ear cups. 40 hours of cinema-grade sound."
              image={headphones}
              basePriceNPR={38500}
              bullets={[
                "Active Noise Cancellation · Spatial Audio",
                "40-hour battery · USB-C fast charge",
                "Premium aluminum yokes",
              ]}
              addOns={[
                { name: "Travel Case", priceNPR: 3200 },
                { name: "Replacement Cushions", priceNPR: 2800 },
              ]}
            />

            <ProductChapter
              id="ch-wearables"
              index="04"
              category="Wearables"
              tagline="Pulse Watch"
              title="Wellness, elevated."
              body="Sapphire crystal. Always-on Retina display. ECG, blood oxygen, and a 36-hour battery — strapped to the strongest titanium case we make."
              image={watch}
              basePriceNPR={52000}
              bullets={[
                "Always-on Retina · Sapphire crystal",
                "ECG · Blood Oxygen · Skin temperature",
                "36-hour battery · GPS + Cellular",
              ]}
              addOns={[
                { name: "Sport Loop", priceNPR: 4800 },
                { name: "Milanese Band", priceNPR: 8900 },
              ]}
            />

            <LocalLogistics />
            <Payments />
          </main>
          <Footer />
          <MobileDock />
          <SpecSheet open={specOpen} onClose={() => setSpecOpen(false)} />
          <Bag open={bagOpen} onClose={() => setBagOpen(false)} />
          <QuickCompare
            items={compare}
            onRemove={(t) => setCompare(prev => prev.filter(x => x !== t))}
            onClear={() => setCompare([])}
          />
          <ChatAssistant />
        </div>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default Index;
