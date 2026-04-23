import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TopNav } from "@/components/TopNav";
import { MobileDock } from "@/components/MobileDock";
import { Hero } from "@/components/Hero";
import { StickyShowcase } from "@/components/StickyShowcase";
import { BentoGrid } from "@/components/BentoGrid";
import { Product3DViewer } from "@/components/Product3DViewer";
import { LocalLogistics } from "@/components/LocalLogistics";
import { Payments } from "@/components/Payments";
import { Footer } from "@/components/Footer";
import { SpecSheet } from "@/components/SpecSheet";
import { ChatAssistant } from "@/components/ChatAssistant";
import { QuickCompare } from "@/components/QuickCompare";
import { Bag } from "@/components/Bag";

const Index = () => {
  const [specOpen, setSpecOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);

  const addCompare = (t: string) =>
    setCompare(prev => (prev.includes(t) ? prev : [...prev, t].slice(0, 3)));

  return (
    <ThemeProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <TopNav onOpenBag={() => setBagOpen(true)} />
        <main>
          <Hero onOpenSpec={() => setSpecOpen(true)} />
          <StickyShowcase />
          <BentoGrid onCompare={addCompare} />
          <Product3DViewer onOpenSpec={() => setSpecOpen(true)} />
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
    </ThemeProvider>
  );
};

export default Index;
