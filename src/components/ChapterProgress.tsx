import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Section {
  id: string;
  label: string;
}

export const ChapterProgress = ({ sections }: { sections: Section[] }) => {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive((visible.target as HTMLElement).id);
      },
      { threshold: [0.3, 0.5, 0.7] }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
      {sections.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center gap-3 justify-end"
            aria-label={s.label}
          >
            <motion.span
              animate={{ opacity: on ? 1 : 0, x: on ? 0 : 10 }}
              className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
            >
              {s.label}
            </motion.span>
            <motion.span
              animate={{
                scale: on ? 1.4 : 1,
                backgroundColor: on ? "hsl(var(--accent-glow))" : "hsl(var(--muted-foreground) / 0.4)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="block h-1.5 w-1.5 rounded-full shadow-[0_0_8px_hsl(var(--accent-glow)/0.6)]"
            />
          </a>
        );
      })}
    </div>
  );
};
