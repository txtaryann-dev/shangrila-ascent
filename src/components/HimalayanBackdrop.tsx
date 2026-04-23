import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Faint Himalayan skyline that subtly parallaxes with cursor. */
export const HimalayanBackdrop = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      setPos({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-[55vh] opacity-[0.12] dark:opacity-20"
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 40, damping: 20 }}
    >
      <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
        <defs>
          <linearGradient id="peak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="peak2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,600 L0,420 L120,300 L210,360 L320,180 L430,310 L520,240 L640,90 L760,260 L870,200 L980,330 L1100,220 L1220,300 L1340,250 L1440,360 L1440,600 Z" fill="url(#peak)" />
        <path d="M0,600 L0,500 L100,440 L220,470 L340,380 L460,440 L580,360 L700,420 L820,350 L940,430 L1060,380 L1180,450 L1300,400 L1440,470 L1440,600 Z" fill="url(#peak2)" opacity="0.7" />
      </svg>
    </motion.div>
  );
};
