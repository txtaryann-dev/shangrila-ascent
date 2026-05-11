import { motion } from "framer-motion";
import { MapPin, Truck, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const hubs = [
  { city: "Kathmandu", eta: "Same day", note: "Free express", code: "KTM", x: 56, y: 58 },
  { city: "Pokhara",   eta: "1–2 days", note: "Standard",     code: "PKR", x: 39, y: 50 },
  { city: "Butwal",    eta: "2–3 days", note: "Standard",     code: "BWA", x: 34, y: 70 },
  { city: "Biratnagar",eta: "2–3 days", note: "Standard",     code: "BIR", x: 80, y: 76 },
];

/** Nepal cutoff: 16:00 NPT (UTC+5:45). Returns ms remaining (or 0 if past). */
const useNptCountdown = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => {
    const NPT_OFFSET_MIN = 5 * 60 + 45;
    const nptNow = new Date(now + NPT_OFFSET_MIN * 60_000);
    const cutoff = new Date(Date.UTC(
      nptNow.getUTCFullYear(), nptNow.getUTCMonth(), nptNow.getUTCDate(), 16, 0, 0
    ));
    let diff = cutoff.getTime() - nptNow.getTime();
    if (diff < 0) diff += 24 * 3600_000;
    const h = Math.floor(diff / 3600_000);
    const m = Math.floor((diff % 3600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    const past = cutoff.getTime() - nptNow.getTime() < 0;
    return { h, m, s, past };
  }, [now]);
};

export const LocalLogistics = () => {
  const [active, setActive] = useState(0);
  const cd = useNptCountdown();

  return (
    <section className="relative py-24" id="delivery">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-sm text-accent font-medium tracking-wider uppercase">Local Logistics</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">From Thamel to your door.</h2>
          <p className="text-muted-foreground mt-4">Real-time delivery estimates across major Nepalese hubs, powered by our partner network.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Stylized Nepal map with clickable pins */}
          <div className="relative glass rounded-2xl p-5 overflow-hidden min-h-[280px]">
            <span className="absolute top-3 left-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Network · Nepal</span>
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
              {/* Stylized Nepal outline */}
              <path
                d="M5,55 C12,40 22,38 30,42 C40,30 55,32 65,40 C75,36 85,42 92,52 C95,62 88,72 78,78 C66,84 50,82 36,80 C22,82 10,72 5,55 Z"
                fill="hsl(var(--accent-glow) / 0.06)"
                stroke="hsl(var(--accent-glow) / 0.35)"
                strokeWidth="0.4"
              />
              {/* Animated route from KTM to active hub */}
              {active !== 0 && (
                <line
                  x1={hubs[0].x} y1={hubs[0].y}
                  x2={hubs[active].x} y2={hubs[active].y}
                  stroke="hsl(var(--accent-glow))"
                  strokeWidth="0.5"
                  strokeDasharray="1.2 1"
                  className="motion-safe:animate-pulse"
                />
              )}
            </svg>
            {hubs.map((h, i) => {
              const on = i === active;
              const same = h.eta === "Same day";
              return (
                <button
                  key={h.city}
                  onClick={() => setActive(i)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  aria-label={`Select ${h.city}`}
                >
                  <span className={`block h-3 w-3 rounded-full transition-all ${
                    on ? "bg-accent ring-4 ring-accent/30 scale-125"
                       : same ? "bg-emerald-400 shadow-[0_0_10px_rgb(52_211_153/0.7)]"
                       : "bg-foreground/60 group-hover:bg-foreground"
                  }`} />
                  <span className={`absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-medium ${
                    on ? "text-foreground" : "text-muted-foreground"
                  }`}>{h.code}</span>
                </button>
              );
            })}
          </div>

          {/* Live panel */}
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-strong rounded-3xl p-7 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-accent">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> LIVE · NPT
              </div>
              <h3 className="font-display text-3xl font-bold mt-3">Delivering to {hubs[active].city}</h3>
              <p className="text-muted-foreground mt-2 text-sm tabular-nums">
                {active === 0 && !cd.past
                  ? <>Order within <span className="text-foreground font-semibold">{String(cd.h).padStart(2,"0")}h {String(cd.m).padStart(2,"0")}m {String(cd.s).padStart(2,"0")}s</span> for same-day dispatch.</>
                  : <>Cutoff passed · next dispatch tomorrow at 09:00 NPT.</>}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="glass rounded-2xl p-4">
                <Clock className="h-5 w-5 text-accent mb-2" />
                <div className="text-2xl font-display font-bold">{hubs[active].eta}</div>
                <div className="text-xs text-muted-foreground">Estimated</div>
              </div>
              <div className="glass rounded-2xl p-4">
                <Truck className="h-5 w-5 text-accent mb-2" />
                <div className="text-2xl font-display font-bold">Rs 0</div>
                <div className="text-xs text-muted-foreground">Shipping</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hub chips below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {hubs.map((h, i) => {
            const sameDay = h.eta === "Same day";
            return (
              <button
                key={h.city}
                onClick={() => setActive(i)}
                className={`relative glass rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 ${
                  active === i ? "ring-2 ring-accent" : ""
                } ${sameDay ? "border border-emerald-400/30" : ""}`}
              >
                {sameDay && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/40">
                    Same day
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{h.code}</span>
                  <MapPin className={`h-3.5 w-3.5 ${sameDay ? "text-emerald-400" : "text-accent"}`} />
                </div>
                <div className="font-display text-lg font-bold mt-2">{h.city}</div>
                <div className="text-[11px] text-muted-foreground">{h.note}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
