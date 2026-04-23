import { motion, useScroll, useTransform } from "framer-motion";
import { Truck, Wand2, Headphones } from "lucide-react";
import heroPhone from "@/assets/hero-phone.png";
import { useMemo, useRef } from "react";

const features = [
  { icon: Truck, title: "Nepal-Wide", sub: "Delivery" },
  { icon: Wand2, title: "Product", sub: "Customization" },
  { icon: Headphones, title: "Local Tech", sub: "Support" },
];

export const Hero = ({ onOpenSpec }: { onOpenSpec: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Generate a static starfield once
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 1.6 + 0.4,
        d: Math.random() * 4 + 2,
        o: Math.random() * 0.6 + 0.2,
      })),
    []
  );

  return (
    <section ref={ref} className="relative min-h-screen pt-28 pb-16 overflow-hidden">
      {/* Starfield */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
        {stars.map((st, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-foreground"
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              width: st.s,
              height: st.s,
              opacity: st.o,
            }}
            animate={{ opacity: [st.o, st.o * 0.3, st.o] }}
            transition={{ duration: st.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {/* Cosmic glows */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[820px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute left-1/3 top-1/2 h-[300px] w-[300px] rounded-full bg-primary/30 dark:bg-accent/20 blur-[100px]" />
      </div>

      <div className="container relative z-10">
        {/* Hero stage with phone */}
        <motion.div
          style={{ y, scale, opacity }}
          className="relative mx-auto max-w-4xl aspect-[16/10] rounded-[2.5rem] overflow-hidden glass"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-transparent to-background/40" />
          <motion.img
            src={heroPhone}
            alt="Shangrila flagship phone"
            width={1536}
            height={1024}
            className="absolute inset-0 m-auto h-[88%] w-auto object-contain drop-shadow-[0_30px_60px_hsl(var(--accent)/0.35)]"
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-x-0 bottom-4 text-center text-[10px] tracking-[0.4em] text-muted-foreground/70 uppercase">
            Shangrila · World · Nepal
          </div>
        </motion.div>

        {/* Floating feature pills (left) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-20"
        >
          <div className="glass rounded-2xl p-3 flex flex-col gap-3">
            {features.map(({ icon: Icon, title, sub }) => (
              <button
                key={title}
                className="elastic flex flex-col items-center gap-1 w-20 py-2 rounded-xl hover:bg-foreground/5"
              >
                <Icon className="h-5 w-5 text-accent" />
                <div className="text-[10px] leading-tight text-center">
                  <div className="font-medium">{title}</div>
                  <div className="text-muted-foreground">{sub}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Headline + CTA below */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-12 max-w-3xl mx-auto"
        >
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Innovation, Redefined. <br className="hidden sm:block" />
            <span className="text-gradient">Elevate Your Everyday.</span>
          </h1>
          <p className="text-muted-foreground mt-5 text-base md:text-lg max-w-xl mx-auto">
            Experience the future of mobility with the all-new Shangrila S26 Ultra.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button className="elastic glass-strong px-7 py-3 rounded-full text-sm font-medium">
              Shop Now
            </button>
            <button
              onClick={onOpenSpec}
              className="elastic px-7 py-3 rounded-full bg-foreground text-background text-sm font-medium"
            >
              View Specs
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
