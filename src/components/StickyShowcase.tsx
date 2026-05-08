import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import phone from "@/assets/obsidian-phone.jpg";

const features = [
  { tag: "Performance", title: "A19 Bionic. Forged on 3nm.", body: "An 8-core CPU and 16-core neural engine deliver studio-grade compute, in your pocket." },
  { tag: "Display", title: "Liquid Aurora at 2,500 nits.", body: "ProMotion 120Hz with HDR brilliance — visible even under the Himalayan sun." },
  { tag: "Camera", title: "5× telephoto. Cinematic 4K.", body: "Three lenses, one breakthrough. Capture pin-sharp moments from peak to street." },
];

export const StickyShowcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rot = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <section ref={ref} className="relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Pinned product */}
          <div className="lg:sticky lg:top-32 h-[60vh] lg:h-[80vh] relative">
            <div aria-hidden className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[hsl(var(--accent-glow)/0.25)] blur-[120px]" />
            </div>
            <motion.img
              src={phone} alt="Aurora Pro" loading="lazy"
              style={{ rotate: rot, scale }}
              className="absolute inset-0 m-auto h-full w-full object-contain drop-shadow-[0_40px_80px_hsl(var(--accent-glow)/0.4)]"
            />
          </div>

          {/* Scrolling text blocks */}
          <div className="space-y-[40vh] py-[20vh]">
            {features.map((f, i) => (
              <motion.div
                key={f.tag}
                initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ margin: "-30% 0px -30% 0px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs text-[hsl(var(--accent-glow))] tracking-[0.2em] uppercase mb-3">{f.tag}</p>
                <h3 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">{f.title}</h3>
                <p className="mt-5 text-muted-foreground text-base md:text-lg max-w-md">{f.body}</p>
                <div className="mt-6 text-xs text-muted-foreground/60">0{i + 1} / 0{features.length}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
