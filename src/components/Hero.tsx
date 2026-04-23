import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-device.jpg";
import { useRef } from "react";

export const Hero = ({ onOpenSpec }: { onOpenSpec: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-muted-foreground mb-6">
            <Sparkles className="h-3 w-3 text-accent" /> New · Aurora Series 2026
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight text-center">
            Innovation <br /> at the <span className="text-gradient">Peak.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Curated electronics for the modern Nepal. Engineered with precision, delivered to your doorstep — Kathmandu to Pokhara.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="elastic px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium inline-flex items-center gap-2">
              Shop Aurora <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onOpenSpec} className="elastic glass px-6 py-3 rounded-full text-sm font-medium">
              View Spec Sheet
            </button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-sm">
            {[["A19", "Bionic"], ["48h", "Battery"], ["IP68", "Sealed"]].map(([k, v]) => (
              <div key={k}>
                <div className="font-display text-2xl font-bold">{k}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div style={{ y, scale, opacity }} className="relative aspect-square">
          <div className="absolute inset-0 rounded-[3rem] overflow-hidden glass">
            <img src={heroImg} alt="Aurora device" className="h-full w-full object-cover" width={1536} height={1536} />
          </div>
          <motion.div
            className="absolute -bottom-6 -left-6 glass-strong rounded-2xl p-4 w-44"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
          >
            <div className="text-xs text-muted-foreground">Starting at</div>
            <div className="font-display text-2xl font-bold">Rs 1,49,900</div>
            <div className="text-[10px] text-accent mt-1">EMI from Rs 12,491/mo</div>
          </motion.div>
          <motion.div
            className="absolute -top-4 -right-4 glass rounded-full p-3 animate-float"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring" }}
          >
            <Sparkles className="h-5 w-5 text-accent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
