import { motion } from "framer-motion";
import { MapPin, Truck, Clock } from "lucide-react";
import { useState } from "react";

const hubs = [
  { city: "Kathmandu", eta: "Same day", note: "Free express", code: "KTM" },
  { city: "Pokhara", eta: "1–2 days", note: "Standard", code: "PKR" },
  { city: "Butwal", eta: "2–3 days", note: "Standard", code: "BWA" },
  { city: "Biratnagar", eta: "2–3 days", note: "Standard", code: "BIR" },
];

export const LocalLogistics = () => {
  const [active, setActive] = useState(0);
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
          <div className="grid grid-cols-2 gap-3">
            {hubs.map((h, i) => (
              <motion.button
                key={h.city}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className={`glass rounded-2xl p-5 text-left transition-all ${active === i ? "ring-2 ring-accent" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{h.code}</span>
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                </div>
                <div className="font-display text-xl font-bold mt-3">{h.city}</div>
                <div className="text-xs text-muted-foreground mt-1">{h.note}</div>
              </motion.button>
            ))}
          </div>

          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-strong rounded-3xl p-7 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-accent">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> LIVE
              </div>
              <h3 className="font-display text-3xl font-bold mt-3">Delivering to {hubs[active].city}</h3>
              <p className="text-muted-foreground mt-2 text-sm">Order in the next 2 hrs 14 min for fastest dispatch.</p>
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
      </div>
    </section>
  );
};
