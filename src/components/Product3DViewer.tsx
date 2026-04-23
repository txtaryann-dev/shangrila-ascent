import { motion } from "framer-motion";
import { RotateCw, Maximize2 } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-device.jpg";

/** Placeholder 3D viewer — rotates the product image with mouse drag. */
export const Product3DViewer = ({ onOpenSpec }: { onOpenSpec: () => void }) => {
  const [angle, setAngle] = useState(15);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  return (
    <section className="relative py-24" id="viewer">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          <p className="text-sm text-accent font-medium tracking-wider uppercase">Interactive</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">Inspect every angle.</h2>
          <p className="text-muted-foreground mt-4 max-w-md">
            Drag to rotate. Pinch to zoom. A studio-grade 3D preview that brings the device into your living room — no AR app required.
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
              "Touch & mouse controlled",
              "Material accurate finishes",
            ].map(t => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="relative aspect-square glass-strong rounded-[2.5rem] overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={(e) => { setDragging(true); setStartX(e.clientX); }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onMouseMove={(e) => { if (dragging) { setAngle(a => a + (e.clientX - startX) * 0.5); setStartX(e.clientX); } }}
          onTouchStart={(e) => { setDragging(true); setStartX(e.touches[0].clientX); }}
          onTouchEnd={() => setDragging(false)}
          onTouchMove={(e) => { if (dragging) { setAngle(a => a + (e.touches[0].clientX - startX) * 0.5); setStartX(e.touches[0].clientX); } }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <motion.img
              src={hero} alt="3D preview" className="w-3/4 h-3/4 object-contain drop-shadow-2xl"
              animate={{ rotateY: angle }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
              draggable={false}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground">
            Drag to rotate · 360°
          </div>
          <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-wider text-accent">3D Preview</div>
        </motion.div>
      </div>
    </section>
  );
};
