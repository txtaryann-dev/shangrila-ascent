import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HimalayanBackdrop } from "@/components/HimalayanBackdrop";
import { TopNav } from "@/components/TopNav";
import { MobileDock } from "@/components/MobileDock";
import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { Product3DViewer } from "@/components/Product3DViewer";
import { LocalLogistics } from "@/components/LocalLogistics";
import { Payments } from "@/components/Payments";
import { Footer } from "@/components/Footer";
import { SpecSheet } from "@/components/SpecSheet";
import { ChatAssistant } from "@/components/ChatAssistant";

const Index = () => {
  const [specOpen, setSpecOpen] = useState(false);
  return (
    <ThemeProvider>
      <div className="relative min-h-screen overflow-x-hidden">
        <HimalayanBackdrop />
        <TopNav />
        <main>
          <Hero onOpenSpec={() => setSpecOpen(true)} />
          <BentoGrid />
          <Product3DViewer onOpenSpec={() => setSpecOpen(true)} />
          <LocalLogistics />
          <Payments />
        </main>
        <Footer />
        <MobileDock />
        <SpecSheet open={specOpen} onClose={() => setSpecOpen(false)} />
        <ChatAssistant />
      </div>
    </ThemeProvider>
  );
};

export default Index;
