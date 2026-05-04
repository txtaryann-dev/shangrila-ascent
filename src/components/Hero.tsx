import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import phone from "@/assets/obsidian-phone.jpg";

export const Hero = ({ onOpenSpec }: { onOpenSpec: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yScroll = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacityScroll = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 80, damping: 20 });
  const rotX = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 80, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Accent glow halo */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-[hsl(var(--accent-glow)/0.18)] blur-[140px]" />
        <div className="absolute left-1/3 bottom-0 h-[300px] w-[400px] rounded-full bg-[hsl(var(--accent-glow-2)/0.15)] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 px-6"
      >
        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-[11px] text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-glow))] shadow-[0_0_8px_hsl(var(--accent-glow))]" />
          New · Aurora Pro
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[0.98] max-w-4xl mx-auto">
          Light. Years <span className="text-gradient">ahead.</span>
        </h1>
        <p className="text-muted-foreground mt-5 text-base md:text-lg max-w-xl mx-auto">
          Forged in titanium. Tuned in Kathmandu. The new Aurora Pro is the most advanced device we’ve ever crafted.
        </p>
      </motion.div>

      <motion.div
        style={{ y: yScroll, opacity: opacityScroll }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative w-full max-w-3xl aspect-[4/3] px-6"
      >
        <motion.img
          src={phone}
          alt="Aurora Pro"
          width={1280}
          height={1280}
          style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d" }}
          className="absolute inset-0 m-auto h-full w-full object-contain drop-shadow-[0_40px_80px_hsl(var(--accent-glow)/0.45)]"
        />
        {/* Subtle gradient overlay for text contrast on hero image */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mt-10 flex items-center gap-3"
      >
        <button className="elastic px-7 py-3 rounded-full bg-foreground text-background text-sm font-medium transition-all hover:shadow-[0_0_40px_hsl(var(--accent-glow)/0.6)] hover:scale-[1.04] active:scale-[0.98]">
          Buy from Rs 1,49,900
        </button>
        <button onClick={onOpenSpec} className="elastic glass-strong px-7 py-3 rounded-full text-sm font-medium transition-all hover:bg-foreground/5 hover:scale-[1.04] hover:border-foreground/30 active:scale-[0.98]">
          Learn more
        </button>
      </motion.div>
    </section>
  );
};
