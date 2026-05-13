import { motion } from "framer-motion";
import { MapPin, Truck, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NepalMap, type Hub } from "./NepalMap";

const hubs: Hub[] = [
  { city: "Kathmandu",  eta: "Same day", code: "KTM", lat: 27.7172, lng: 85.3240 },
  { city: "Pokhara",    eta: "1–2 days", code: "PKR", lat: 28.2096, lng: 83.9856 },
  { city: "Butwal",     eta: "2–3 days", code: "BWA", lat: 27.7006, lng: 83.4484 },
  { city: "Biratnagar", eta: "2–3 days", code: "BIR", lat: 26.4525, lng: 87.2718 },
];
const hubNotes: Record<string, string> = {
  KTM: "Free express", PKR: "Standard", BWA: "Standard", BIR: "Standard",
};

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
          {/* Real Nepal map (Leaflet) with updated 2020 boundary */}
          <div className="relative glass rounded-2xl overflow-hidden">
            <NepalMap hubs={hubs} active={active} onSelect={setActive} />
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
                <div className="text-[11px] text-muted-foreground">{hubNotes[h.code]}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
