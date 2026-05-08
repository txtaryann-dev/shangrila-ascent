import { motion, useReducedMotion } from "framer-motion";
import { RotateCw, Maximize2 } from "lucide-react";
import { useState } from "react";
import { AuroraPhone3D } from "./AuroraPhone3D";

/** Real-time 3D viewer of the Aurora Pro device. */
export const Product3DViewer = ({ onOpenSpec }: { onOpenSpec: () => void }) => {
  const [angle, setAngle] = useState(15);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const shouldReduce = useReducedMotion();

  return (
    <section className="relative py-24" id="viewer">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={shouldReduce ? { duration: 0 } : { duration: 0.8 }}
        >
          <p className="text-sm text-accent font-medium tracking-wider uppercase">Interactive · Aurora Pro</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">Inspect every angle.</h2>
          <p className="text-muted-foreground mt-4 max-w-md">
            A real-time WebGL model of the Aurora Pro. Drag to rotate, watch light dance across titanium edges, and explore every contour from your browser.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="elastic glass px-5 py-2.5 rounded-full text-sm inline-flex items-center gap-2"
              onClick={() => setAngle(a => a + 90)}>
              <RotateCw className="h-4 w-4" /> Rotate
            </button>
            <button onClick={onOpenSpec} className="elastic px-5 py-2.5 rounded-full bg-foreground text-background text-sm inline-flex items-center gap-2">
              <Maximize2 className="h-4 w-4" /> Full Specs
            </button>
          </div>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Real-time WebGL rendering",
              "Physically-based titanium materials",
              "Touch & mouse controlled · 360°",
            ].map(t => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={shouldReduce ? { duration: 0 } : { duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-square rounded-[2.5rem] overflow-hidden cursor-grab active:cursor-grabbing select-none
            bg-[radial-gradient(ellipse_at_50%_30%,hsl(var(--accent-glow)/0.2),transparent_60%),radial-gradient(ellipse_at_70%_80%,hsl(280_90%_60%/0.16),transparent_55%),linear-gradient(180deg,hsl(0_0%_6%),hsl(0_0%_2%))]
            border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
          onPointerDown={(e) => {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            setDragging(true); setStartX(e.clientX);
          }}
          onPointerUp={(e) => {
            (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
            setDragging(false);
          }}
          onPointerCancel={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
          onPointerMove={(e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            // Lower sensitivity for premium feel; spring handles smoothing
            setAngle(a => a + dx * 0.25);
            setStartX(e.clientX);
          }}
        >
          {/* Perspective grid floor */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.12]
              [background-image:linear-gradient(to_right,hsl(var(--accent-glow)/0.6)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--accent-glow)/0.6)_1px,transparent_1px)]
              [background-size:40px_40px]
              [mask-image:linear-gradient(to_top,black,transparent_90%)]
              [transform:perspective(600px)_rotateX(60deg)] origin-bottom"
          />

          {/* Ambient halos */}
          <div aria-hidden className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[hsl(280_90%_60%/0.18)] blur-3xl pointer-events-none" />

          {/* 3D Canvas */}
          <div className="absolute inset-0">
            <AuroraPhone3D rotationY={angle} />
          </div>

          {/* Corner crosshair markers */}
          <div aria-hidden className="absolute top-6 right-6 h-3 w-3 border-t border-r border-white/30" />
          <div aria-hidden className="absolute bottom-6 left-6 h-3 w-3 border-b border-l border-white/30" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-xl pointer-events-none inline-flex items-center gap-2 shadow-[0_8px_30px_-10px_hsl(var(--accent-glow)/0.5)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-glow))] animate-pulse" />
            Drag to rotate • Scroll to zoom
          </div>
          <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accent backdrop-blur-xl pointer-events-none">
            ◉ Live 3D
          </div>
          <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-xl pointer-events-none">
            WebGL
          </div>
        </motion.div>
      </div>
    </section>
  );
};
